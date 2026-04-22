import React from 'react';
import {Plus, Trash2} from 'lucide-react';
import SubMenuEditor from '@/components/admin/SubMenuEditor';
import SliderLinker from '@/components/admin/SliderLinker';
import EditorAccordionItem from '@/components/admin/EditorAccordionItem';

const MenuSection = ({
                         menuData, isHe, openItems, toggleAccordion, moveMenu,
                         updateMenuTitle, updateMenuBg, addMenu, removeMenu,
                         addSubMenu, handleFileUpload, removeFile, setMenuData,
                         linkItemToSub, unlinkItemFromSub
                     }) => {
    const t = (obj) => isHe ? obj?.he || '' : obj?.en || '';

    return (
        <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{isHe ? 'ניהול תפריטים' : 'Menu Management'}</h2>
                <button onClick={addMenu}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg transition">
                    <Plus size={18}/> {isHe ? 'תפריט חדש' : 'New Menu'}
                </button>
            </div>

            {menuData.map((menu, index) => (
                <EditorAccordionItem
                    key={menu.id}
                    id={menu.id}
                    index={index}
                    totalItems={menuData.length}
                    isOpen={openItems[menu.id]}
                    onToggle={toggleAccordion}
                    onRemove={removeMenu}
                    onMove={moveMenu}
                    titleInputs={
                        <>
                            <input className="border-none bg-transparent font-bold focus:ring-0" dir="rtl"
                                   value={menu.title?.he || ''}
                                   onChange={(e) => updateMenuTitle(menu.id, 'he', e.target.value)}
                                   placeholder="כותרת בעברית"/>
                            <input className="border-none bg-transparent font-bold focus:ring-0" dir="ltr"
                                   value={menu.title?.en || ''}
                                   onChange={(e) => updateMenuTitle(menu.id, 'en', e.target.value)}
                                   placeholder="English Title"/>
                        </>
                    }
                >
                    <div
                        className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                        {/* Section Image / URL */}
                        <div className="space-y-2">
    {/* Label traduit */}
    <label className="font-bold text-slate-400 block text-[10px] uppercase">
        {isHe ? 'תמונת רקע לכרטיס' : 'Card background image'}
    </label>

    {/* Input File - Notez qu'on a retiré "multiple" */}
    <input
        type="file"
        accept="image/*"
        onChange={(e) => updateMenuBg(e, menu.id)}
        className="text-[10px] w-full file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
    />

    {/* Affichage de la preview si une image existe */}
    {menu.bgImage && (
        <div className="flex gap-2 mt-2">
            <div className="relative w-16 h-10 group">
                <img
                    src={menu.bgImage}
                    className="w-full h-full object-cover rounded border shadow-sm"
                    alt="background preview"
                />
                <button
                    onClick={() => {
                        // Logique pour supprimer l'image (remise à null)
                        setMenuData(menuData.map(m => m.id === menu.id ? { ...m, bgImage: null } : m));
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                >
                    <Trash2 size={10}/>
                </button>
            </div>
        </div>
    )}
</div>
                    </div>

                    {/* Menu Specific UI: Sub-items */}
                    <div className={`space-y-4 border-blue-100 ${isHe ? 'border-r-4 pr-6' : 'border-l-4 pl-6'}`}>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{isHe ? 'תתי-תפריט' : 'Sub-items'}</h4>
                        {menu.subItems.map(sub => (
                            <div key={sub.id} className="space-y-3">
                                <SubMenuEditor sub={sub} menuId={menu.id} isHe={isHe}
                                               handleFileUpload={handleFileUpload} removeFile={removeFile}
                                               setMenuData={setMenuData} menuData={menuData}/>
                                <SliderLinker isHe={isHe} menuData={menuData} linkedItemIds={sub.linkedItemIds}
                                              onLink={(itemId) => linkItemToSub(menu.id, sub.id, itemId)}
                                              onUnlink={(itemId) => unlinkItemFromSub(menu.id, sub.id, itemId)} t={t}/>
                            </div>
                        ))}
                        <button onClick={() => addSubMenu(menu.id)}
                                className="text-blue-600 text-xs font-bold hover:underline">+ {isHe ? 'הוסף תת-תפריט' : 'Add Sub-item'}</button>
                    </div>
                </EditorAccordionItem>
            ))}
        </section>
    );
};

export default MenuSection;