import React from 'react';
import LogoSection from '@/components/admin/LogoSection';
import { Download, Clock, Link as LinkIcon, LayoutGrid } from 'lucide-react';

const SettingSection = ({ logic, isHe, exportData, logo, setLogo, updateLogo }) => {
    const { t, menuData } = logic;

    const settings = logic?.siteSettings || {
        contact: { email: '', address: { he: '', en: '' } }
    };

    const footer = logic?.footerData || { hours: { items: [] } };

    // Helper to update specific footer items
    const handleFooterChange = (index, field, value) => {
        const updatedFooter = { ...footer };
        // If it's a simple value update (label/text)
        if (typeof value === 'string' && (field === 'label' || field === 'value')) {
            updatedFooter.hours.items[index][field][logic.lang] = value;
        } else {
            // If it's a complex update (like linking a sub-item)
            updatedFooter.hours.items[index][field] = value;
        }
        logic.updateFooter(updatedFooter);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">

            {/* Line 1: Logo Management */}
            <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <LogoSection logo={logo} setLogo={setLogo} updateLogo={updateLogo} isHe={isHe} />
            </div>

            {/* Footer Opening Hours & Links Management */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <Clock size={18} className="text-blue-500" />
                    <h3 className="font-bold text-lg text-slate-800">
                        {isHe ? 'שעות פעילות וקישורים' : 'Opening Hours & Links'}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {footer.hours?.items.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                        {isHe ? 'כותרת (לדוגמה: בריכה)' : 'Label (e.g. Pool)'}
                                    </label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={item.label[logic.lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                        {isHe ? 'טקסט מוצג (לדוגמה: ללוח פעילות)' : 'Display Text (e.g. View Schedule)'}
                                    </label>
                                    <input
                                        className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={item.value[logic.lang] || ''}
                                        onChange={(e) => handleFooterChange(idx, 'value', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Select Sub-item Link (Only if item is a link) */}
                            {item.isLink && (
                                <div className="bg-blue-100/50 p-3 rounded-xl border border-blue-200 space-y-2">
                                    <div className="flex items-center gap-2 text-blue-800 font-bold text-[10px] uppercase">
                                        <LayoutGrid size={14} />
                                        <span>{isHe ? 'קשר לפריט מהתפריט' : 'Link to Menu Item'}</span>
                                    </div>
                                    <select
                                        className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
                                        value={item.linkedSubItemId || ""}
                                        onChange={(e) => {
                                            const subId = e.target.value;
                                            // Find the sub-item object to store its data if needed, or just store the ID
                                            handleFooterChange(idx, 'linkedSubItemId', subId);
                                        }}
                                    >
                                        <option value="">{isHe ? '-- בחר פריט לקישור --' : '-- Select item --'}</option>
                                        {menuData.map(category => (
                                            <optgroup key={category.id} label={t(category.title)}>
                                                {category.subItems.map(sub => (
                                                    <option key={sub.id} value={sub.id}>{t(sub.title)}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    {item.linkedSubItemId && (
                                        <p className="text-[10px] text-blue-600 font-medium">
                                            {isHe ? 'מקושר כעת ל:' : 'Currently linked to:'}
                                            <span className="font-bold"> {
                                                menuData.flatMap(c => c.subItems).find(s => String(s.id) === String(item.linkedSubItemId))?.title?.[logic.lang] || 'Item'
                                            }</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Line 2: Contact Management */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-lg border-b pb-2 text-slate-800">
                    {isHe ? 'עריכת פרטי התקשרות' : 'Edit Contact Info'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Email</label>
                        <input
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={settings.contact?.email || ''}
                            onChange={(e) => logic.updateSettings('email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                            {isHe ? 'כתובת' : 'Address'}
                        </label>
                        <input
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={settings.contact?.address?.he || ''}
                            onChange={(e) => logic.updateSettings('address_he', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Line 3: Export */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-6 rounded-3xl border border-blue-100 gap-4">
                <div>
                    <h2 className="text-blue-800 font-black text-xl">{isHe ? 'גיבוי וייצוא' : 'Backup & Export'}</h2>
                </div>
                <button
                    onClick={exportData}
                    className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm hover:shadow-md active:scale-95"
                >
                    <Download size={18}/>
                    <span>{isHe ? 'ייצוא נתונים' : 'Export Data'}</span>
                </button>
            </div>
        </div>
    );
};

export default SettingSection;