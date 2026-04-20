import { useState, useEffect } from 'react';
import { DEFAULT_MENU } from '@/lib/menuData';
import { createNewMenu, createNewSubMenu, createNewNews } from '@/lib/data';

export const useMenuManager = () => {
    const [mounted, setMounted] = useState(false);
    const [menuData, setMenuData] = useState(DEFAULT_MENU);
    const [newsData, setNewsData] = useState([]);
    const [logo, setLogo] = useState(null);
    const [view, setView] = useState('user');
    const [lang, setLang] = useState('he');
    const [activeSubItem, setActiveSubItem] = useState(null);

    // 1. Handle Hydration & Initial Load
    useEffect(() => {
        const savedData = localStorage.getItem('siteData');
        const savedNews = localStorage.getItem('siteNews');
        const savedLogo = localStorage.getItem('siteLogo');

        if (savedData) setMenuData(JSON.parse(savedData));
        if (savedNews) setNewsData(JSON.parse(savedNews));
        if (savedLogo) setLogo(savedLogo);

        setMounted(true);
    }, []);

    // 2. Persistence (Sync to LocalStorage)
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('siteData', JSON.stringify(menuData));
        }
    }, [menuData, mounted]);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('siteNews', JSON.stringify(newsData));
        }
    }, [newsData, mounted]);

    useEffect(() => {
        if (mounted) {
            if (logo) localStorage.setItem('siteLogo', logo);
            else localStorage.removeItem('siteLogo');
        }
    }, [logo, mounted]);

    // --- TRANSLATION HELPER ---
    const t = (obj) => obj?.[lang] || obj?.['he'] || '';

    // --- ACTIONS (Menu & News) ---
    const uploadDefaults = () => {
        if (window.confirm("Restore default menu structure?")) setMenuData(DEFAULT_MENU);
    };

    const addMenu = () => setMenuData(prev => [...prev, createNewMenu()]);

    const addSubMenu = (menuId) => {
        setMenuData(prev => prev.map(m =>
            m.id === menuId ? { ...m, subItems: [...(m.subItems || []), createNewSubMenu()] } : m
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
                // Upload to our new Next.js API route
                const response = await fetch(`/api/upload?filename=${file.name}`, {
                    method: 'POST',
                    body: file,
                });

                const newBlob = await response.json();
                const fileUrl = newBlob.url;

                setter(prev => prev.map(item => {
                    if (item.id !== targetId) return item;

                    // Case 1: Root items (Logo, BgImage, or Main News Image)
                    if (!subId && (type === 'bgImage' || type === 'image' || type === 'logo')) {
                        if (type === 'logo') setLogo(fileUrl);
                        return { ...item, [type]: fileUrl };
                    }

                    // Case 2: News Items (store directly on the object)
                    if (isNews) {
                        const fileEntry = type === 'pdfs' ? { url: fileUrl, name: file.name } : fileUrl;
                        return { ...item, [type]: [...(item[type] || []), fileEntry] };
                    }

                    // Case 3: SubMenu items
                    const updateSubItems = (items) => items.map(s => {
                        if (s.id !== subId) return s;
                        const fileEntry = type === 'pdfs' ? { url: fileUrl, name: file.name } : fileUrl;
                        return { ...s, [type]: [...(s[type] || []), fileEntry] };
                    });

                    return { ...item, subItems: updateSubItems(item.subItems || []) };
                }));
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Upload failed. Check your Vercel Blob configuration.");
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
                return { ...item, [type]: newList };
            }

            return {
                ...item,
                subItems: (item.subItems || []).map(s => {
                    if (s.id !== subId) return s;
                    const newList = [...(s[type] || [])];
                    newList.splice(index, 1);
                    return { ...s, [type]: newList };
                })
            };
        }));
    };

    return {
        mounted, // Export this to check if we can render UI
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