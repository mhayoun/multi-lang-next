import React, {useState} from 'react';
import {Settings, User, LogOut, Menu, X} from 'lucide-react';
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
        // CHECK: Is this sub-item a "Linker" to another item?
        if (sub.contentMode === 'linker' && sub.linkedItemId) {
            // Search through all menus and sub-items to find the "Target"
            const targetSubItem = logic.menuData
                ?.flatMap(menu => menu.subItems || [])
                .find(item => String(item.id) === String(sub.linkedItemId));

            if (targetSubItem) {
                // If found, redirect the navigation to the TARGET instead of the clicked item
                logic.setActiveSubItem(targetSubItem);
                console.log(`Redirecting from ${sub.id} to linked item ${targetSubItem.id}`);
            } else {
                // Fallback: if target not found, just open the clicked item
                logic.setActiveSubItem(sub);
            }
        } else {
            // DEFAULT: Normal editor mode
            logic.setActiveSubItem(sub);
        }

        logic.setView('user');
        setIsMenuOpen(false);

        // Jump to the top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleSignOut = () => {
        logic.setView('user');
        signOut();
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="px-6 py-3 flex justify-between items-center">

                {/* --- LEFT SIDE: HAMBURGER + LOGO --- */}
                <div className="flex items-center gap-2 md:gap-6">
                    {/* Hamburger (Mobile Only) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>

                    {/* Logo */}
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center transition-transform active:scale-95 outline-none"
                    >
                        {logic.logo ? (
                            <img src={logic.logo} alt="Logo" className="h-9 md:h-10 w-auto object-contain"/>
                        ) : (
                            <h1 className="font-bold text-lg md:text-xl tracking-tight text-blue-600">DynamicPort</h1>
                        )}
                    </button>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex gap-4 border-slate-200 h-6 items-center px-4 border-x ml-2">
                        {logic.menuData.map((menu) => {
                            const hasSubItems = menu.subItems && menu.subItems.length > 0;
                            const isSingleItem = menu.subItems && menu.subItems.length === 1;
                            const isContact = menu.type === 'contact';
                            return (
                                <div key={menu.id} className="relative group h-full flex items-center">
                                    <button
                                        onClick={() => {
                                            if (isContact) {
                                                const footer = document.getElementById('footer');
                                                if (footer) {
                                                    footer.scrollIntoView({behavior: 'smooth'});
                                                }
                                            } else if (isSingleItem) {
                                                handleSubItemClick(menu.subItems[0]);
                                            }
                                        }}
                                        className={`font-medium transition-colors py-2 ${
                                            (isSingleItem || isContact) ? 'hover:text-blue-600 cursor-pointer' : 'cursor-default'
                                        }`}
                                    >
                                        {logic.t(menu.title)}
                                    </button>

                                    {hasSubItems && !isSingleItem && !isContact && (
                                        <div
                                            className="absolute ltr:left-0 rtl:right-0 top-full mt-1 hidden group-hover:flex flex-col bg-white shadow-xl border border-slate-100 rounded-xl p-1.5 min-w-[200px] z-[60]">
                                            {menu.subItems.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => handleSubItemClick(sub)}
                                                    className="w-full text-start px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm font-medium transition-all"
                                                >
                                                    {logic.t(sub.title)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- RIGHT SIDE CONTROLS --- */}
                <div className="flex items-center gap-4">
                    {/* RESTORED: Admin/User View Switcher */}
                    {session && (
                        <div className="hidden sm:flex bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => logic.setView('user')}
                                className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-all ${
                                    logic.view === 'user' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <User size={16}/> {uiText.user}
                            </button>
                            <button
                                onClick={() => logic.setView('admin')}
                                className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 transition-all ${
                                    logic.view === 'admin' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <Settings size={16}/> {uiText.switch}
                            </button>
                        </div>
                    )}

                    <select
                        value={logic.lang}
                        onChange={(e) => logic.setLang(e.target.value)}
                        className="bg-transparent font-bold text-sm outline-none cursor-pointer border-none focus:ring-0"
                    >
                        {Object.entries(LANGUAGES).map(([code, info]) => (
                            <option key={code} value={code}>{info.label}</option>
                        ))}
                    </select>

                    <div className="border-l border-slate-200 pl-4 h-8 flex items-center">
                        {session ? (
                            <div className="flex items-center gap-2">
                                <img src={session.user.image} className="w-8 h-8 rounded-full border shadow-sm"
                                     alt="Profile"/>
                                <button onClick={handleSignOut}
                                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-full transition-all">
                                    <LogOut size={16}/>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className="text-[10px] uppercase tracking-widest text-slate-300 hover:text-blue-400 transition-colors duration-300"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isMenuOpen && (
                <div
                    className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 animate-in slide-in-from-top duration-200">
                    {logic.menuData.map((menu) => {
                        const isContact = menu.type === 'contact';
                        const hasSubItems = menu.subItems && menu.subItems.length > 0;

                        return (
                            <div key={menu.id} className="space-y-1">
                                {/* If it's a contact link, make the heading clickable */}
                                {isContact ? (
                                    <button
                                        onClick={() => handleSubItemClick(menu)}
                                        className="w-full text-start px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {logic.t(menu.title)}
                            </span>
                                    </button>
                                ) : (
                                    /* Otherwise, keep it as a standard group label */
                                    <div
                                        className="text-[10px] font-black text-slate-400 px-3 uppercase tracking-widest pt-2">
                                        {logic.t(menu.title)}
                                    </div>
                                )}

                                {/* Render sub-items if they exist */}
                                {hasSubItems && menu.subItems.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleSubItemClick(sub)}
                                        className="w-full text-start px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm font-medium transition-all"
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