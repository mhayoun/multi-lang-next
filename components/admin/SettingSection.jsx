import React from 'react';
import LogoSection from '@/components/admin/LogoSection';
import { Download } from 'lucide-react';

const SettingSection = ({ logic, isHe, exportData, logo, setLogo, updateLogo }) => {
    const settings = logic?.siteSettings || {
        contact: { email: '', address: { he: '', en: '' } }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Logo Management */}
            <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <LogoSection logo={logo} setLogo={setLogo} updateLogo={updateLogo} isHe={isHe} />
            </div>

            {/* Contact Management */}
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

            {/* Export */}
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