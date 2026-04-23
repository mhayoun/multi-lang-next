import {useState, useEffect} from 'react';
import {DEFAULT_MENU} from '@/lib/menuData';
import {DEFAULT_NEWS} from '@/lib/newsData';
import {createNewMenu, createNewSubMenu, createNewNews} from '@/lib/data';

export const useMenuManager = () => {
    const [mounted, setMounted] = useState(false);
    const [menuData, setMenuData] = useState(DEFAULT_MENU);
    const [newsData, setNewsData] = useState(DEFAULT_NEWS);
    const [logo, setLogo] = useState(null);
    const [view, setView] = useState('user');
    const [lang, setLang] = useState('he');
    const [activeSubItem, setActiveSubItem] = useState(null);

    // 1. INITIAL LOAD: Sync with Cloud (Redis)
    useEffect(() => {
        const syncData = async () => {
            try {
                // Try to fetch from Upstash via our API
                const response = await fetch('/api/settings');
                const cloudData = await response.json();

                if (cloudData && !cloudData.error && Object.keys(cloudData).length > 0) {
                    // Success! Use Cloud Data
                    if (cloudData.menuData) setMenuData(cloudData.menuData);
                    if (cloudData.newsData) setNewsData(cloudData.newsData);
                    if (cloudData.logo) setLogo(cloudData.logo);
                } else {
                    // Fallback to LocalStorage if Cloud is empty
                    const savedData = localStorage.getItem('siteData');
                    const savedNews = localStorage.getItem('siteNews');
                    const savedLogo = localStorage.getItem('siteLogo');

                    if (savedData) setMenuData(JSON.parse(savedData));
                    if (savedNews) setNewsData(JSON.parse(savedNews));
                    if (savedLogo) setLogo(savedLogo);
                }
            } catch (err) {
                console.error("Cloud sync failed, using local fallback:", err);
            } finally {
                setMounted(true);
            }
        };

        syncData();
    }, []);

    // 2. Local Backup (Persistence for offline editing)
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('siteData', JSON.stringify(menuData));
            localStorage.setItem('siteNews', JSON.stringify(newsData));
            if (logo) localStorage.setItem('siteLogo', logo);
        }
    }, [menuData, newsData, logo, mounted]);

    // --- TRANSLATION HELPER ---
    const t = (obj) => obj?.[lang] || obj?.['he'] || '';

    // --- ACTIONS (Menu & News) ---
    const uploadDefaults = () => {
        if (window.confirm("Restore default menu and news structure?")) {
            setMenuData(DEFAULT_MENU);
            setNewsData(DEFAULT_NEWS); // This will now reset the news too
        }
    };

    const addMenu = () => setMenuData(prev => [...prev, createNewMenu()]);

    const addSubMenu = (menuId) => {
        setMenuData(prev => prev.map(m =>
            m.id === menuId ? {...m, subItems: [...(m.subItems || []), createNewSubMenu()]} : m
        ));
    };

    const removeMenu = (menuId) => setMenuData(prev => prev.filter(m => m.id !== menuId));

    const moveMenu = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= menuData.length) return;
        const updatedData = [...menuData];
        const [movedItem] = updatedData.splice(fromIndex, 1);
        updatedData.splice(toIndex, 0, movedItem);
        setMenuData(updatedData);
    };

    const addNews = () => setNewsData(prev => [...prev, createNewNews()]);
    const removeNews = (id) => setNewsData(prev => prev.filter(n => n.id !== id));

    // --- VERCEL BLOB UPLOAD HANDLING ---
    const handleFileUpload = async (e, targetId, subId, type, isNews = false) => {
        const files = Array.from(e.target.files);
        const setter = isNews ? setNewsData : setMenuData;

        for (const file of files) {
            try {
                const response = await fetch(`/api/upload?filename=${file.name}`, {
                    method: 'POST',
                    body: file,
                });

                const newBlob = await response.json();
                const fileUrl = newBlob.url;

                setter(prev => prev.map(item => {
                    if (item.id !== targetId) return item;

                    if (!subId && (type === 'bgImage' || type === 'image' || type === 'logo')) {
                        if (type === 'logo') setLogo(fileUrl);
                        return {...item, [type]: fileUrl};
                    }

                    if (isNews) {
                        const fileEntry = type === 'pdfs' ? {url: fileUrl, name: file.name} : fileUrl;
                        return {...item, [type]: [...(item[type] || []), fileEntry]};
                    }

                    const updateSubItems = (items) => items.map(s => {
                        if (s.id !== subId) return s;
                        const fileEntry = type === 'pdfs' ? {url: fileUrl, name: file.name} : fileUrl;
                        return {...s, [type]: [...(s[type] || []), fileEntry]};
                    });

                    return {...item, subItems: updateSubItems(item.subItems || [])};
                }));
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }
    };

    const removeFile = (targetId, subId, type, index, isNews = false) => {
        const setter = isNews ? setNewsData : setMenuData;
        setter(prev => prev.map(item => {
            if (item.id !== targetId) return item;

            if (isNews) {
                const newList = [...(item[type] || [])];
                newList.splice(index, 1);
                return {...item, [type]: newList};
            }

            return {
                ...item,
                subItems: (item.subItems || []).map(s => {
                    if (s.id !== subId) return s;
                    const newList = [...(s[type] || [])];
                    newList.splice(index, 1);
                    return {...s, [type]: newList};
                })
            };
        }));
    };

    return {
        mounted,
        menuData, setMenuData,
        newsData, setNewsData,
        logo, setLogo,
        view, setView,
        lang, setLang,
        activeSubItem, setActiveSubItem,
        t,
        uploadDefaults,
        addMenu, addSubMenu, removeMenu, moveMenu,
        addNews, removeNews,
        handleFileUpload,
        removeFile
    };
};