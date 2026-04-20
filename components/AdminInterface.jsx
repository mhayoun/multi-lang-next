import React from 'react';
// Use the @ alias to point directly to the folders
import NewsSection from '@/components/admin/NewsSection';
import MenuSection from '@/components/admin/MenuSection';
import LogoSection from '@/components/admin/LogoSection';
import AdminTabs from '@/components/admin/AdminTabs';
import {useAdminLogic} from '@/components/admin/useAdminLogic';

const AdminInterface = ({logic, currentLang = 'he'}) => {
    const isHe = currentLang === 'he';

    // State and specific handlers from custom hook
    const {
        activeTab, setActiveTab, openItems, toggleAccordion, updateLogo,
        updateMenuBg, updateMenuTitle, updateNewsTitle, linkItemToNews, unlinkItemFromNews,
        linkItemToSub, unlinkItemFromSub, publishToCloud
    } = useAdminLogic(logic);

    // Destructure data and generic actions from logic prop
    const {
        menuData, newsData, handleFileUpload, removeFile, addMenu,
        addSubMenu, removeMenu, addNews, removeNews, logo, setLogo,
        moveMenu, moveNews, setMenuData, setNewsData, t
    } = logic;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20 px-4" dir={isHe ? "rtl" : "ltr"}>

            {/* Add this inside your return, maybe above the LogoSection */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div>
                    <h2 className="text-blue-800 font-bold">{isHe ? 'ניהול אתר' : 'Site Management'}</h2>
                    <p className="text-blue-600 text-sm">{isHe ? 'שמור את כל השינויים לענן' : 'Save all changes to the cloud'}</p>
                </div>
                <button
                    onClick={publishToCloud}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg flex items-center gap-2"
                >
                    <span>{isHe ? 'פרסם שינויים' : 'Publish Changes'}</span>
                </button>
            </div>

            {/* 1. Logo Management */}
            <LogoSection
                logo={logo}
                setLogo={setLogo}
                updateLogo={updateLogo}
                isHe={isHe}
            />

            {/* 2. Navigation Control */}
            <AdminTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isHe={isHe}
            />

            {/* 3. Main Content Area */}
            <main className="min-h-[400px]">
                {activeTab === 'menu' ? (
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
                        handleFileUpload={handleFileUpload}
                        removeFile={removeFile}
                        setMenuData={setMenuData}
                        linkItemToSub={linkItemToSub}
                        unlinkItemFromSub={unlinkItemFromSub}
                    />
                ) : (
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