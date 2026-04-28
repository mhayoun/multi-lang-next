import React from 'react';
import { Clock, LayoutGrid } from 'lucide-react';

const FooterSection = ({ logic, isHe }) => {
    const { t, menuData, footerData, lang, updateFooter } = logic;

    const footer = footerData || { hours: { items: [] } };

    const handleFooterChange = (index, field, value) => {
        const updatedFooter = { ...footer };
        // If it's a simple value update (label/text)
        if (typeof value === 'string' && (field === 'label' || field === 'value')) {
            updatedFooter.hours.items[index][field][lang] = value;
        } else {
            // If it's a complex update (like linking a sub-item)
            updatedFooter.hours.items[index][field] = value;
        }
        updateFooter(updatedFooter);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
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
                                    {isHe ? 'תווית (למשל: בריכה)' : 'Label (e.g. Pool)'}
                                </label>
                                <input
                                    className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={item.label[lang] || ''}
                                    onChange={(e) => handleFooterChange(idx, 'label', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase px-1">
                                    {isHe ? 'טקסט להצגה (למשל: צפה בלו"ז)' : 'Display Text (e.g. View Schedule)'}
                                </label>
                                <input
                                    className="w-full p-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={item.value[lang] || ''}
                                    onChange={(e) => handleFooterChange(idx, 'value', e.target.value)}
                                />
                            </div>
                        </div>

                        {item.isLink && (
                            <div className="bg-blue-100/50 p-3 rounded-xl border border-blue-200 space-y-2">
                                <div className="flex items-center gap-2 text-blue-800 font-bold text-[10px] uppercase">
                                    <LayoutGrid size={14} />
                                    <span>{isHe ? 'קשר לפריט בתפריט' : 'Link to Menu Item'}</span>
                                </div>
                                <select
                                    className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
                                    value={item.linkedSubItemId || ""}
                                    onChange={(e) => handleFooterChange(idx, 'linkedSubItemId', e.target.value)}
                                >
                                    <option value="">{isHe ? '-- בחר פריט תפריט --' : '-- Select item --'}</option>
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
                                            menuData.flatMap(c => c.subItems).find(s => String(s.id) === String(item.linkedSubItemId))?.title?.[lang] || 'Item'
                                        }</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FooterSection;