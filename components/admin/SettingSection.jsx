import React from 'react';
import LogoSection from '@/components/admin/LogoSection';
import { Download } from 'lucide-react';

const SettingSection = ({ isHe, exportData, logo, setLogo, updateLogo }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">

      {/* Line 1: Logo Management (Now First) */}
      <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
        <LogoSection
          logo={logo}
          setLogo={setLogo}
          updateLogo={updateLogo}
          isHe={isHe}
        />
      </div>

      {/* Line 2: Data Management / Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50 p-6 rounded-3xl border border-blue-100 gap-4">
        <div>
          <h2 className="text-blue-800 font-black text-xl">
            {isHe ? 'גיבוי וייצוא נתונים' : 'Data Export & Backup'}
          </h2>
          <p className="text-blue-600 text-sm">
            {isHe ? 'הורד את נתוני התפריטים והחדשות לקובץ JSON' : 'Download menu and news data to a JSON file'}
          </p>
        </div>

        <button
          onClick={exportData}
          className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-full font-bold transition-all flex items-center gap-2 text-sm shadow-sm hover:shadow-md active:scale-95"
        >
          <Download size={16} />
          <span>{isHe ? 'ייצוא נתונים' : 'Export Data'}</span>
        </button>
      </div>

    </div>
  );
};

export default SettingSection;