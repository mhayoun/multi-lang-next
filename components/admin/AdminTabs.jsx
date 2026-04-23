import React from 'react';
import {LayoutGrid, Newspaper, CloudUpload, Settings} from 'lucide-react';

const AdminTabs = ({activeTab, setActiveTab, isHe, publishToCloud}) => {
    const tabs = [
        {id: 'menu', label: isHe ? 'תפריטים' : 'Menus', icon: LayoutGrid},
        {id: 'news', label: isHe ? 'חדשות' : 'News', icon: Newspaper},
        {id: 'settings', label: isHe ? 'הגדרות' : 'Settings', icon: Settings}
    ];

    return (
        <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 p-2 rounded-[2.5rem] shadow-inner border border-slate-200">
            {/* Tab Switcher */}
            <nav className="flex gap-1">
                {tabs.map(({id, label, icon: Icon}) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-[2rem] font-bold transition-all duration-200
              ${activeTab === id
                            ? 'bg-white shadow-md text-blue-600 scale-105'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
            `}
                    >
                        <Icon size={18}/>
                        {label}
                    </button>
                ))}
            </nav>

            {/* Action Button moved here */}
            <button
                onClick={publishToCloud}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-[2rem] font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
                <CloudUpload size={20}/>
                <span>{isHe ? 'פרסם שינויים' : 'Publish Changes'}</span>
            </button>
        </div>
    );
};

export default AdminTabs;