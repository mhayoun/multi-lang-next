import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, Maximize2, PlayCircle } from 'lucide-react';

const GalleryBanderole = ({ media, isHe }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    const items = media || [];
    if (items.length === 0) return null;

    const hasMultipleItems = items.length > 1;

    const nextItem = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (isHe ? (prev - 1 + items.length) % items.length : (prev + 1) % items.length));
    };

    const prevItem = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (isHe ? (prev + 1) % items.length : (prev - 1 + items.length) % items.length));
    };

    const scroll = (direction) => {
        const container = document.getElementById('gallery-banderole-container');
        const distance = isHe ? 400 : -400;
        const scrollAmount = direction === 'left' ? distance : -distance;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    // Helper to render media content
    const renderMedia = (item, isSingle = false) => (
        <div
            onClick={() => setSelectedIndex(0)}
            className={`relative overflow-hidden shadow-lg cursor-pointer group border border-slate-100 bg-slate-900 
                ${isSingle ? 'w-full h-64 md:h-96 rounded-[2.5rem]' : 'w-80 h-52 rounded-[2rem] flex-shrink-0 snap-start'}`}
        >
            {item.type === 'video' ? (
                <div className="w-full h-full relative">
                    <video src={item.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle size={isSingle ? 64 : 48} className="text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            ) : (
                <img
                    src={item.url}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt=""
                />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                    <Maximize2 className="text-white" size={isSingle ? 32 : 24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="mb-12 relative group/gallery" dir={isHe ? 'rtl' : 'ltr'}>
            {/*<h3 className={`text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-2 ${isHe ? 'text-right' : 'text-left'}`}>
                {isHe ? 'גלריית מדיה' : 'Media Gallery'}
            </h3>*/}

            {!hasMultipleItems ? (
                /* SINGLE ITEM VIEW */
                <div className="px-2">
                    {renderMedia(items[0], true)}
                </div>
            ) : (
                /* MULTIPLE ITEMS GALLERY */
                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-blue-600 hover:text-white ${isHe ? 'right-2' : 'left-2'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-blue-600 hover:text-white ${isHe ? 'left-2' : 'right-2'}`}
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div
                        id="gallery-banderole-container"
                        className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x scroll-smooth px-2"
                    >
                        {items.map((item, i) => (
                            <React.Fragment key={i}>
                                {renderMedia(item, false)}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* --- LIGHTBOX OVERLAY --- */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setSelectedIndex(null)}
                >
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-end z-[10000]">
                        <button
                            className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95 shadow-2xl"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(null);
                            }}
                        >
                            <X size={32} strokeWidth={3} />
                        </button>
                    </div>

                    {hasMultipleItems && (
                        <>
                            <button
                                className="absolute left-4 md:left-8 text-white/50 hover:text-white p-4 transition-all z-[1000]"
                                onClick={isHe ? nextItem : prevItem}
                            >
                                <ChevronLeft size={48} />
                            </button>
                            <button
                                className="absolute right-4 md:right-8 text-white/50 hover:text-white p-4 transition-all z-[1000]"
                                onClick={isHe ? prevItem : nextItem}
                            >
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}

                    <div className="w-full max-w-5xl px-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full flex justify-center items-center h-[70vh]">
                            {items[selectedIndex].type === 'video' ? (
                                <video src={items[selectedIndex].url} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl" />
                            ) : (
                                <img src={items[selectedIndex].url} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" alt="Preview" />
                            )}
                        </div>

                        {hasMultipleItems && (
                            <div className="mt-8 px-5 py-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/60 text-xs font-medium tracking-widest uppercase">
                                {selectedIndex + 1} / {items.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryBanderole;