import React from 'react';
import NewsSection from '@/components/admin/NewsSection';
import MenuSection from '@/components/admin/MenuSection';
import SettingSection from '@/components/admin/SettingSection';
import MessagesSection from '@/components/admin/MessagesSection';
import AdminTabs from '@/components/admin/AdminTabs';
import {useAdminLogic} from '@/components/admin/useAdminLogic';


const AdminInterface = ({logic, currentLang = 'he'}) => {
    const isHe = currentLang === 'he';

    const {
        activeTab, setActiveTab, openItems, toggleAccordion, updateLogo,
        updateMenuBg, updateMenuTitle, updateNewsTitle, linkItemToNews, unlinkItemFromNews,
        linkItemToSub, unlinkItemFromSub, publishToCloud, moveSubMenu, removeSubMenu
    } = useAdminLogic(logic);

    const {
        menuData, newsData, handleFileUpload, removeFile, addMenu,
        addSubMenu, removeMenu, addNews, removeNews, logo, setLogo,
        moveMenu, moveNews, setMenuData, setNewsData, t
    } = logic;

    const exportData = () => {
        const downloadJSON = (data, fileName) => {
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        };
        downloadJSON(menuData, 'DEFAULT_MENU.json');
        downloadJSON(newsData, 'DEFAULT_NEWS.json');
        downloadJSON(newsData, 'DEFAULT_FOOTER.json');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 px-4" dir={isHe ? "rtl" : "ltr"}>

            {/* Navigation & Publish Control */}
            <AdminTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isHe={isHe}
                publishToCloud={publishToCloud}
            />

            <main className="min-h-[400px]">
                {activeTab === 'settings' && (
                    <SettingSection
                        logic={logic}
                        isHe={isHe}
                        exportData={exportData}
                        logo={logo}
                        setLogo={setLogo}
                        updateLogo={updateLogo}
                    />
                )}

                {/* Added Messages Section */}
                {activeTab === 'messages' && (
                    <MessagesSection isHe={isHe}/>
                )}

                {activeTab === 'menu' && (
                    <MenuSection
                        menuData={menuData}
                        isHe={isHe}
                        openItems={openItems}
                        toggleAccordion={toggleAccordion}
                        moveMenu={moveMenu}
                        updateMenuTitle={updateMenuTitle}
                        updateMenuBg={updateMenuBg}
                        addMenu={addMenu}
                        removeMenu={removeMenu}
                        addSubMenu={addSubMenu}
                        removeSubMenu={removeSubMenu}
                        moveSubMenu={moveSubMenu}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        setMenuData={setMenuData}
                        linkItemToSub={linkItemToSub}
                        unlinkItemFromSub={unlinkItemFromSub}
                        publishToCloud={publishToCloud}
                    />
                )}

                {activeTab === 'news' && (
                    <NewsSection
                        newsData={newsData}
                        menuData={menuData}
                        isHe={isHe}
                        t={t}
                        openItems={openItems}
                        toggleAccordion={toggleAccordion}
                        updateNewsTitle={updateNewsTitle}
                        linkItemToNews={linkItemToNews}
                        unlinkItemFromNews={unlinkItemFromNews}
                        removeNews={removeNews}
                        addNews={addNews}
                        moveNews={moveNews}
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        setNewsData={setNewsData}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminInterface;