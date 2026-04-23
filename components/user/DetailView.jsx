import React, {useState} from 'react';
import {FileText, ChevronRight, ChevronLeft, Download, Eye, Loader2, MessageCircle} from 'lucide-react';
import GalleryBanderole from './GalleryBanderole.jsx';

// 1. EXTRACTED COMPONENT: This handles its own state legally
const PDFRow = ({pdf, i, isHe}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const pdfUrl = typeof pdf === 'string' ? pdf : pdf.url;
    const pdfName = typeof pdf === 'string' ? `Document ${i + 1}` : (pdf.name || `Document ${i + 1}`);

    const handleDownload = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsDownloading(true);
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            window.open(pdfUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group/doc">
            <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                <div className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded shrink-0">PDF</div>
                <span className="font-bold text-slate-700 truncate">{pdfName}</span>
            </div>

            <div className="flex items-center gap-2">
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Open in new tab"
                >
                    <Eye size={20}/>
                </a>

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isDownloading ? 'text-slate-300 bg-slate-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    {isDownloading ? <Loader2 size={20} className="animate-spin"/> : <Download size={20}/>}
                </button>
            </div>
        </div>
    );
};

const DetailView = ({activeSubItem, setActiveSubItem, menuData, t, isHe, uiText}) => {
    const getLinkedItemsData = (ids) => {
        if (!ids || !Array.isArray(ids)) return [];
        const foundItems = [];
        ids.forEach(id => {
            menuData.forEach(category => {
                const item = category.subItems.find(s => s.id === id);
                if (item) foundItems.push(item);
            });
        });
        return foundItems;
    };

    const linkedItems = getLinkedItemsData(activeSubItem.linkedItemIds);
    const allMedia = [
        ...(activeSubItem.videos || []).map(url => ({url, type: 'video'})),
        ...(activeSubItem.images || []).map(url => ({url, type: 'image'}))
    ];

    const WhatsAppButton = ({htmlContent, isHe, activityTitle}) => {
        const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
        const mobileRegex = /05\d[- ]?\d{7}/g;
        const matches = plainText.match(mobileRegex);
        if (!matches || matches.length === 0) return null;

        const firstMatch = matches[0];
        const rawNumber = firstMatch.replace(/\D/g, '');
        const formattedNumber = `972${rawNumber.substring(1)}`;
        const defaultMsg = isHe
            ? `שלום, אני מעוניין בפרטים אודות "${activityTitle}". אשמח שתחזרו אלי.`
            : `Hi, I am interested in "${activityTitle}". Please contact me.`;

        return (
            <div className="mb-12 flex justify-start w-full">
                <a
                    href={`https://wa.me/${formattedNumber}?text=${encodeURIComponent(defaultMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all"
                >
                    <MessageCircle size={22} fill="white"/>
                    <span>{isHe ? 'שלח ווטסאפ' : 'WhatsApp Message'}</span>
                </a>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4" dir={isHe ? 'rtl' : 'ltr'}>
            <button
                onClick={() => {
                    setActiveSubItem(null);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }}
                className="text-blue-600 mb-8 flex items-center gap-2 font-bold"
            >
                {isHe ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
                {uiText.back}
            </button>

            <h1 className="text-4xl font-black mb-6 text-slate-800">{t(activeSubItem.title)}</h1>

            <div
                className={`text-base leading-relaxed text-slate-600 mb-12 
                    ${isHe ? 'text-right border-r-4 pr-6' : 'text-left border-l-4 pl-6'} border-blue-500`}
                dangerouslySetInnerHTML={{__html: t(activeSubItem.content)}}
            />

            <WhatsAppButton htmlContent={t(activeSubItem.content)} isHe={isHe} activityTitle={t(activeSubItem.title)}/>

            {activeSubItem.pdfs?.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] mt-12">
                    <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-slate-800">
                        <FileText className="text-blue-600" size={24}/>
                        {uiText.docsTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeSubItem.pdfs.map((pdf, i) => (
                            <PDFRow key={i} pdf={pdf} i={i} isHe={isHe}/>
                        ))}
                    </div>
                </div>
            )}

            {allMedia.length > 0 && <GalleryBanderole media={allMedia} isHe={isHe}/>}

            {linkedItems.length > 0 && (
                <div className="mt-16 mb-20">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-2">
                        {isHe ? 'קישורים קשורים' : 'Related Links'}
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x">
                        {linkedItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSubItem(item);
                                    window.scrollTo({top: 0, behavior: 'smooth'});
                                }}
                                className="relative flex-shrink-0 w-72 h-44 rounded-[2rem] overflow-hidden shadow-lg snap-start transition-transform hover:scale-[1.02]"
                            >
                                <img src={item.image || (item.images && item.images[0])}
                                     className="absolute inset-0 w-full h-full object-cover" alt=""/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                                <div
                                    className={`absolute inset-0 p-6 flex flex-col justify-end text-white ${isHe ? 'text-right' : 'text-left'}`}>
                                    <h4 className="font-black text-lg">{t(item.title)}</h4>
                                    <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                                        {isHe ? 'צפה עכשיו' : 'View Now'}
                                        {isHe ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailView;