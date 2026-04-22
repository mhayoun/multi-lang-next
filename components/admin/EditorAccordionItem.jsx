import React from 'react';
import { ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const EditorAccordionItem = ({
    children,
    id,
    index,
    totalItems,
    isOpen,
    onToggle,
    onRemove,
    onMove,
    icon: Icon,
    titleInputs,
    isHe,
    itemData, // On utilise un nom générique pour l'objet (news ou menu)
    onFileUpload,
    onUpdateField
}) => (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
            <div className="flex flex-col gap-1">
                <button
                    disabled={index === 0}
                    onClick={() => onMove(index, index - 1)}
                    className="p-1 hover:bg-white rounded border disabled:opacity-30 text-slate-500"
                >
                    <ArrowUp size={14} />
                </button>
                <button
                    disabled={index === totalItems - 1}
                    onClick={() => onMove(index, index + 1)}
                    className="p-1 hover:bg-white rounded border disabled:opacity-30 text-slate-500"
                >
                    <ArrowDown size={14} />
                </button>
            </div>

            {Icon && <Icon className="text-blue-500 shrink-0" size={20} />}

            <div className="flex-1 grid grid-cols-2 gap-2">
                {titleInputs}
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => onRemove(id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={18} />
                </button>
                <button onClick={() => onToggle(id)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
        </div>

        {/* Content */}
        {isOpen && (
            <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">

                {/* --- SECTIONS IMAGES DE FOND (Déplacées ici pour éviter les erreurs de layout) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
                    {/* MOBILE */}
                    <div className="space-y-2 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                        <label className="font-bold text-slate-400 block text-[10px] uppercase">
                            {isHe ? 'תמונת רקע למובייל' : 'Mobile Background Image'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onFileUpload(e, id, 'bgImage_mob')}
                            className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {itemData?.bgImage_mob && (
                            <div className="relative w-12 h-20 mt-2 group">
                                <img src={itemData.bgImage_mob} className="w-full h-full object-cover rounded border shadow-sm" alt="preview" />
                                <button
                                    onClick={() => onUpdateField(id, 'bgImage_mob', '')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* WEB */}
                    <div className="space-y-2 p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                        <label className="font-bold text-slate-400 block text-[10px] uppercase">
                            {isHe ? 'תמונת רקע לדסקטופ (סליידר)' : 'Web Background Image (Slider)'}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onFileUpload(e, id, 'bgImage_web')}
                            className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {itemData?.bgImage_web && (
                            <div className="relative w-24 h-10 mt-2 group">
                                <img src={itemData.bgImage_web} className="w-full h-full object-cover rounded border shadow-sm" alt="preview" />
                                <button
                                    onClick={() => onUpdateField(id, 'bgImage_web', '')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {children}
            </div>
        )}
    </div>
);

export default EditorAccordionItem;