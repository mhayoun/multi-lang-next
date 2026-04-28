import React, {useState} from 'react';
import {Settings, User, LogOut, Menu, X, ChevronDown} from 'lucide-react';
import {LANGUAGES} from '@/lib/data';
import {signIn, signOut, useSession} from "next-auth/react";

const Navbar = ({logic, uiText}) => {
    const {data: session} = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleHomeClick = () => {
        logic.setActiveSubItem(null);
        logic.setView('user');
        setIsMenuOpen(false);
    };

    const handleSubItemClick = (sub) => {
        if (sub.contentMode === 'linker' && sub.linkedItemId) {
            const targetSubItem = logic.menuData
                ?.flatMap(menu => menu.subItems || [])
                .find(item => String(item.id) === String(sub.linkedItemId));

            if (targetSubItem) {
                logic.setActiveSubItem(targetSubItem);
            } else {
                logic.setActiveSubItem(sub);
            }
        } else {
            logic.setActiveSubItem(sub);
        }

        logic.setView('user');
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSignOut = () => {
        logic.setView('user');
        signOut();
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="px-6 py-2.5 flex justify-between items-center max-w-7xl mx-auto">

                {/* --- LEFT SIDE --- */}
                <div className="flex items-center gap-2 md:gap-8">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        {isMenuOpen ? <X size={20}/> : <Menu size={20}/>}
                    </button>

                    <button
                        onClick={handleHomeClick}
                        className="flex items-center transition-all active:scale-95 outline-none hover:brightness-110"
                    >
                        {logic.logo ? (
                            <img src={logic.logo} alt="Logo" className="h-8 md:h-9 w-auto object-contain"/>
                        ) : (
                            <h1 className="font-black text-sm md:text-base tracking-tighter text-slate-800 uppercase group">
                                Dynamic<span className="text-blue-600 group-hover:text-blue-700">Port</span>
                            </h1>
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-1 h-8 items-center ml-2">
                        {logic.menuData.map((menu) => {
                            const hasSubItems = menu.subItems && menu.subItems.length > 0;
                            const isSingleItem = menu.subItems && menu.subItems.length === 1;
                            const isContact = menu.type === 'contact';

                            return (
                                <div key={menu.id} className="relative group h-full flex items-center">
                                    <button
                                        onClick={() => {
                                            if (isContact) {
                                                document.getElementById('footer')?.scrollIntoView({behavior: 'smooth'});
                                            } else if (isSingleItem) {
                                                handleSubItemClick(menu.subItems[0]);
                                            }
                                        }}
                                        /* ADDED: hover:font-black and transition-all.
                                           We use px-3 to ensure there is enough room for the text to expand slightly without jumping.
                                        */
                                        className={`px-3 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 hover:scale-105 ${
                                            (isSingleItem || isContact) 
                                            ? 'hover:text-blue-600 hover:font-black hover:bg-slate-50 cursor-pointer' 
                                            : 'text-slate-600 cursor-default group-hover:font-black group-hover:text-slate-900'
                                        }`}
                                    >
                                        {logic.t(menu.title)}
                                        {hasSubItems && !isSingleItem && !isContact && (
                                            <ChevronDown size={12} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                                        )}
                                    </button>

                                    {hasSubItems && !isSingleItem && !isContact && (
                                        <div className="absolute top-full ltr:left-0 rtl:right-0 mt-0 hidden group-hover:block pt-2 z-[60]">
                                            <div className="bg-white shadow-xl border border-slate-100 rounded-xl p-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-150">
                                                {menu.subItems.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleSubItemClick(sub)}
                                                        /* ADDED: hover:font-black for sub-items */
                                                        className="w-full text-start px-3 py-2 hover:bg-blue-50 hover:text-blue-700 hover:font-black rounded-lg text-[12px] font-bold transition-all"
                                                    >
                                                        {logic.t(sub.title)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- RIGHT SIDE --- */}
                <div className="flex items-center gap-3">
                    {session && (
                        <div className="hidden sm:flex bg-slate-100 rounded-full p-1 border border-slate-200">
                            <button
                                onClick={() => logic.setView('user')}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:scale-105 ${
                                    logic.view === 'user' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <User size={12}/> {uiText.user}
                            </button>
                            <button
                                onClick={() => logic.setView('admin')}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 transition-all hover:scale-105 ${
                                    logic.view === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <Settings size={12}/> {uiText.switch}
                            </button>
                        </div>
                    )}

                    <select
                        value={logic.lang}
                        onChange={(e) => logic.setLang(e.target.value)}
                        className="bg-transparent font-black text-[12px] uppercase tracking-tighter outline-none cursor-pointer border-none focus:ring-0 text-slate-700 hover:text-blue-600 transition-colors"
                    >
                        {Object.entries(LANGUAGES).map(([code, info]) => (
                            <option key={code} value={code} className="font-bold">{info.label}</option>
                        ))}
                    </select>

                    <div className="border-l border-slate-200 pl-3 h-6 flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-2">
                                <img src={session.user.image} className="w-7 h-7 rounded-full border border-slate-200 shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer" alt="P"/>
                                <button onClick={handleSignOut} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                                    <LogOut size={16}/>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => signIn("google")} className="text-[12px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 hover:scale-110 transition-all">
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU --- */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 animate-in slide-in-from-top duration-300 shadow-inner">
                    {logic.menuData.map((menu) => {
                        const isContact = menu.type === 'contact';
                        const hasSubItems = menu.subItems && menu.subItems.length > 0;

                        return (
                            <div key={menu.id} className="space-y-1">
                                {isContact ? (
                                    <button
                                        onClick={() => handleSubItemClick(menu)}
                                        className="w-full text-start px-3 py-2 text-blue-600 hover:bg-blue-50 hover:font-black rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all"
                                    >
                                        {logic.t(menu.title)}
                                    </button>
                                ) : (
                                    <div className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-[0.2em] pt-2">
                                        {logic.t(menu.title)}
                                    </div>
                                )}

                                {hasSubItems && menu.subItems.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleSubItemClick(sub)}
                                        className="w-full text-start px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:font-black rounded-lg text-xs font-bold transition-all"
                                    >
                                        {logic.t(sub.title)}
                                    </button>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </nav>
    );
};

export default Navbar;