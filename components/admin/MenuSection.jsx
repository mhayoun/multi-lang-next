import React from 'react';
import {Plus, Trash2} from 'lucide-react';
import SubMenuEditor from '@/components/admin/SubMenuEditor';
import SliderLinker from '@/components/admin/SliderLinker';
import EditorAccordionItem from '@/components/admin/EditorAccordionItem';
import MenuBackgroundEditor from "@/components/admin/MenuBackgroundEditor";

const MenuSection = ({
                         menuData, isHe, openItems, toggleAccordion, moveMenu,
                         moveSubMenu, removeSubMenu,
                         updateMenuTitle, updateMenuBg, addMenu, removeMenu,
                         addSubMenu, handleFileUpload, removeFile, setMenuData,
                         linkItemToSub, unlinkItemFromSub,
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
                    {/* Card background image */}
                    <MenuBackgroundEditor
                        menu={menu}
                        isHe={isHe}
                        updateMenuBg={updateMenuBg}
                        onRemoveImage={(id) => {
                            setMenuData(menuData.map(m => m.id === id ? {...m, bgImage: null} : m));
                        }}
                    />


                    {/* Sub-items Section */}
                    <div className={`space-y-4 border-blue-100 ${isHe ? 'border-r-4 pr-6' : 'border-l-4 pl-6'}`}>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {isHe ? 'תת-תפריטים' : 'Sub-items'}
                        </h4>

                        <div className="space-y-3">
                            {menu.subItems.map((sub, subIndex) => (
                                <EditorAccordionItem
                                    key={sub.id}
                                    id={sub.id}
                                    index={subIndex}
                                    totalItems={menu.subItems.length}
                                    isOpen={openItems[sub.id]} // Ensure your toggle logic supports sub-ids
                                    onToggle={toggleAccordion}
                                    onRemove={() => removeSubMenu(menu.id, sub.id)}
                                    onMove={(from, to) => moveSubMenu(menu.id, from, to)}
                                    titleInputs={
                                        <div className="flex items-center text-sm font-medium text-slate-600">
                                            <span>{t(sub.title) || (isHe ? 'תת-פריט חדש' : 'New Sub-item')}</span>
                                        </div>
                                    }
                                >
                                    <div className="space-y-6">
                                        <SubMenuEditor
                                            sub={sub}
                                            menuId={menu.id}
                                            isHe={isHe}
                                            handleFileUpload={handleFileUpload}
                                            removeFile={removeFile}
                                            setMenuData={setMenuData}
                                            menuData={menuData}
                                        />

                                        <SliderLinker
                                            isHe={isHe}
                                            menuData={menuData}
                                            linkedItemIds={sub.linkedItemIds}
                                            onLink={(itemId) => linkItemToSub(menu.id, sub.id, itemId)}
                                            onUnlink={(itemId) => unlinkItemFromSub(menu.id, sub.id, itemId)}
                                            t={t}
                                        />
                                    </div>
                                </EditorAccordionItem>
                            ))}
                        </div>
                        <button onClick={() => addSubMenu(menu.id)}
                                className="text-blue-600 text-xs font-bold hover:underline">+ {isHe ? 'הוסף תת-תפריט' : 'Add Sub-item'}</button>
                    </div>
                </EditorAccordionItem>
            ))}
        </section>
    );
};

export default MenuSection;