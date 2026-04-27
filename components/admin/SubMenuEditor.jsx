import React, {useState, useEffect} from 'react';
import {
    Trash2, FileText, Eye, Code, Maximize2, X, CheckCircle2, Link,
    GripVertical, Copy, Check, Video, ExternalLink, Sparkles, Loader2, RotateCcw
} from 'lucide-react';
import {useSubMenuEditor} from '@/components/admin/useSubMenuEditor';

const SubMenuEditor = ({
                           sub,
                           menuId,
                           isHe,
                           handleFileUpload,
                           removeFile,
                           setMenuData,
                           menuData,
                           publishToCloud
                       }) => {
    const logic = useSubMenuEditor(sub, menuId, setMenuData, menuData);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [backupContent, setBackupContent] = useState(null);

    // AI Instruction Helper
    const getAutoInstruction = (lang) => lang === 'he'
        ? "צור קוד HTML נקי עבור תוכן זה (ללא תגיות html, head או body). שמור על כל הנתונים המקוריים והוסף בולטים (נקודות), צבעים ואייקונים."
        : "Generate clean HTML code for this content (excluding html, head, or body tags). Preserve all original data and include bullet points, colors, and icons.";

    const [customRequest, setCustomRequest] = useState(getAutoInstruction(logic.modalLang));

    // Update the textarea content automatically when the language changes
    useEffect(() => {
        setCustomRequest(getAutoInstruction(logic.modalLang));
    }, [logic.modalLang]);

    const handleAIGenerate = async () => {
        if (isGenerating) return;

        const currentText = sub.content?.[logic.modalLang] || '';
        if (!currentText.trim()) return;

        setBackupContent(currentText);
        setIsGenerating(true);

        try {
            const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_KEY;
            if (!GROQ_KEY) {
                throw new Error("API Key is missing. Check your .env.local and restart the server.");
            }
            const URL = "https://api.groq.com/openai/v1/chat/completions";

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are an HTML expert. Return ONLY the requested HTML body content without ``` tags or <html>/<body> tags."
                        },
                        {
                            role: "user",
                            content: `Task: ${customRequest}\n\nContent: ${currentText}`
                        }
                    ]
                })
            });

            const data = await response.json();
            const rawHtml = data.choices?.[0]?.message?.content;

            if (rawHtml) {
                const cleanHtml = rawHtml
                    .replace(/```html|```/g, '')
                    .replace(/<\/?(html|head|body)[^>]*>/gi, '')
                    .trim();

                logic.handleUpdateField('content', logic.modalLang, cleanHtml);
            }
        } catch (error) {
            console.error("AI Error:", error);
            alert(isHe ? "שגיאה בחיבור ל-AI." : "AI Connection Error.");
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * RESTORE LOGIC
     * This function takes the saved text from our backup buffer
     * and puts it back into the main content editor.
     */
    const handleRestore = () => {
        // 1. Check if we actually have a backup saved
        if (backupContent !== null) {

            // 2. Use the existing logic function to update the field
            // We pass 'content', the current language (HE/EN), and the backed-up text
            logic.handleUpdateField('content', logic.modalLang, backupContent);

            // 3. Clear the backup buffer after restoring
            // This hides the Restore button until the next AI generation
            setBackupContent(null);
        }
    };

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 text-slate-800 shadow-sm relative">

            {/* 1. HEADER */}
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    {isHe ? 'ניהול תוכן' : 'Content Management'}
                </span>
                <button
                    onClick={() => logic.setViewMode(logic.viewMode === 'edit' ? 'preview' : 'edit')}
                    className="text-[10px] bg-slate-200 px-2 py-1 rounded hover:bg-slate-300 transition flex items-center gap-1"
                >
                    {logic.viewMode === 'edit' ? <Eye size={12}/> : <Code size={12}/>}
                    {logic.viewMode === 'edit' ? (isHe ? 'תצוגה' : 'Preview') : (isHe ? 'עריכה' : 'Edit')}
                </button>
            </div>

            {/* 2. TITLE INPUTS */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    className={`border p-2 rounded text-right font-medium ${isHe ? 'order-1' : 'order-2'}`}
                    dir="rtl" value={sub.title?.he || ''} placeholder="כותרת..."
                    onChange={(e) => logic.handleUpdateField('title', 'he', e.target.value)}
                />
                <input
                    className={`border p-2 rounded text-left font-medium ${isHe ? 'order-2' : 'order-1'}`}
                    dir="ltr" value={sub.title?.en || ''} placeholder="Title..."
                    onChange={(e) => logic.handleUpdateField('title', 'en', e.target.value)}
                />
            </div>

            {/* 3. QUICK CONTENT AREA */}
            <div className="grid grid-cols-2 gap-4">
                {['he', 'en'].map((lang) => (
                    <div key={lang}
                         className={`relative group ${isHe ? (lang === 'he' ? 'order-1' : 'order-2') : (lang === 'en' ? 'order-1' : 'order-2')}`}>
                        <button
                            onClick={() => {
                                logic.setModalLang(lang);
                                logic.setIsModalOpen(true);
                            }}
                            className="absolute top-2 right-2 p-1 bg-white/80 rounded border opacity-0 group-hover:opacity-100 transition z-10 hover:bg-blue-50"
                        >
                            <Maximize2 size={14}/>
                        </button>
                        {logic.viewMode === 'edit' ? (
                            <textarea
                                className="w-full border p-2 rounded h-32 font-mono text-xs bg-slate-900 text-green-400"
                                value={sub.content?.[lang] || ''}
                                onChange={(e) => logic.handleUpdateField('content', lang, e.target.value)}
                                dir="ltr"
                            />
                        ) : (
                            <div
                                className={`w-full border p-2 rounded h-32 overflow-y-auto bg-white text-xs ${lang === 'he' ? 'text-right' : 'text-left'}`}
                                dangerouslySetInnerHTML={{__html: sub.content?.[lang] || ''}}
                                dir={lang === 'he' ? 'rtl' : 'ltr'}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* 4. FILE UPLOADS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                    <label
                        className="font-bold text-slate-400 block text-[10px] uppercase">{isHe ? 'תמונות' : 'Images'}</label>
                    <input type="file" multiple accept="image/*"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'images')}
                           className="text-[10px] w-full"/>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {sub.images?.map((img, i) => (
                            <div key={i} className="relative w-12 h-12 group">
                                <img src={img} className="w-full h-full object-cover rounded border shadow-sm"
                                     alt="preview"/>
                                <button onClick={() => removeFile(menuId, sub.id, 'images', i)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm z-10">
                                    <Trash2 size={10}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        className="font-bold text-slate-400 block text-[10px] uppercase tracking-widest">{isHe ? 'קבצי PDF' : 'PDFs'}</label>
                    <input type="file" multiple accept=".pdf"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'pdfs')}
                           className="text-[10px] w-full"/>
                    <div className="space-y-1 mt-2">
                        {sub.pdfs?.map((pdf, i) => (
                            <div key={i}
                                 className="flex items-center justify-between bg-white border rounded p-1 text-[10px] shadow-sm">
                                <span className="truncate w-24 flex items-center gap-1">
                                    <FileText size={10} className="text-red-500"/>
                                    {typeof pdf === 'string' ? pdf.split('/').pop() : (pdf.name || 'Doc')}
                                </span>
                                <button onClick={() => removeFile(menuId, sub.id, 'pdfs', i)}
                                        className="text-red-500 hover:text-red-700 transition">
                                    <Trash2 size={12}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        className="font-bold text-slate-400 block text-[10px] uppercase tracking-widest">{isHe ? 'סרטונים' : 'Videos'}</label>
                    <input type="file" multiple accept="video/*"
                           onChange={(e) => handleFileUpload(e, menuId, sub.id, 'videos')}
                           className="text-[10px] w-full"/>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {sub.videos?.map((vid, i) => (
                            <div key={i}
                                 className="relative w-12 h-12 group bg-black rounded border overflow-hidden shadow-sm">
                                <video src={vid} className="w-full h-full object-cover" muted
                                       onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()}/>
                                <div
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                                    <Video size={14} className="text-white"/>
                                </div>
                                <button onClick={() => removeFile(menuId, sub.id, 'videos', i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition z-10">
                                    <Trash2 size={10}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. YOUTUBE LINKS (NEW SECTION) */}
                <div className="space-y-2">
                    <label className="font-bold text-slate-400 block text-[10px] uppercase tracking-widest">
                        {isHe ? 'קישורי יוטיוב' : 'YouTube Links'}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={isHe ? "הדבק קישור ולחץ Enter..." : "Paste link and Enter..."}
                            className="text-[10px] w-full border rounded-md p-2 pl-7 outline-none focus:border-blue-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                    e.preventDefault();
                                    const val = e.target.value;
                                    const currentYoutubes = sub.youtubes || [];

                                    // DEBUG LOGS
                                    console.log("Adding Link:", val);
                                    console.log("Current Sub Object:", sub);

                                    logic.updateSubMenu(menuId, sub.id, {
                                        youtubes: [...currentYoutubes, val]
                                    });
                                    e.target.value = '';
                                }
                            }}
                        />
                        <Link size={12} className="absolute left-2 top-2.5 text-slate-400"/>
                    </div>

                    <div className="space-y-1 mt-2">
                        {sub.youtubes?.map((link, i) => (
                            <div key={i}
                                 className="flex items-center justify-between bg-red-50 border border-red-100 rounded p-1 text-[10px] shadow-sm">
                    <span className="truncate w-24 flex items-center gap-1 text-red-700">
                        <Video size={10} className="text-red-600"/>
                        {link}
                    </span>
                                <button
                                    onClick={() => {
                                        const filtered = sub.youtubes.filter((_, idx) => idx !== i);
                                        logic.updateSubMenu(menuId, sub.id, {youtubes: filtered});
                                    }}
                                    className="text-red-400 hover:text-red-700 transition"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. MODAL (Rich Editor) */}
            {logic.isModalOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                        {/* MODAL HEADER - STRETCHED AI BOX */}
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <div className="flex-1 flex items-center gap-3 w-full min-w-0">

                                {/* Lang Toggle */}
                                <div className="flex shrink-0 bg-slate-200 p-1 rounded-lg">
                                    <button onClick={() => logic.setModalLang('he')}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition ${logic.modalLang === 'he' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>HE
                                    </button>
                                    <button onClick={() => logic.setModalLang('en')}
                                            className={`px-3 py-1 rounded-md text-xs font-bold transition ${logic.modalLang === 'en' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>EN
                                    </button>
                                </div>

                                {/* Tools */}
                                <button onClick={logic.handleCopy}
                                        className={`shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border ${logic.copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {logic.copied ? <Check size={12}/> : <Copy size={12}/>}
                                    {isHe ? (logic.copied ? 'הועתק!' : 'העתק תוכן') : (logic.copied ? 'Copied!' : 'Copy Content')}
                                </button>

                                <a href="[https://bestonlinehtmleditor.com/](https://bestonlinehtmleditor.com/)"
                                   target="_blank" rel="noopener noreferrer"
                                   className="shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                                    <ExternalLink size={12}/>
                                    {isHe ? 'עורך HTML' : 'HTML Editor'}
                                </a>

                                {/* THE AI BOX - TAKES ALL SPACE */}
                                <div
                                    className="flex-1 flex items-center gap-2 bg-white p-1 rounded-md border border-slate-200 shadow-sm min-w-0">
                                    <button
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating}
                                        className={`shrink-0 flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-md font-bold transition border shadow-sm ${
                                            isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-transparent'
                                        }`}
                                    >
                                        {isGenerating ? <Loader2 size={12} className="animate-spin"/> :
                                            <Sparkles size={12}/>}
                                        {isHe ? (isGenerating ? '...' : 'עריכת AI') : (isGenerating ? '...' : 'Generate AI')}
                                    </button>
                                    {/* RESTORE BUTTON - ONLY SHOWS IF BACKUP EXISTS */}
                                    {backupContent !== null && (
                                        <button
                                            onClick={handleRestore}
                                            title="Restore previous version"
                                            className="shrink-0 flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-md font-bold transition border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                                        >
                                            <RotateCcw size={12}/>
                                            {isHe ? 'שחזר' : 'Undo AI'}
                                        </button>
                                    )}
                                    <textarea
                                        value={customRequest}
                                        onChange={(e) => setCustomRequest(e.target.value)}
                                        dir={logic.modalLang === 'he' ? 'rtl' : 'ltr'}
                                        placeholder={isHe ? "הנחיות ל-AI..." : "AI instructions..."}
                                        className="h-10 flex-1 w-full text-sm p-2 bg-slate-50 border-none resize-none focus:ring-0 outline-none overflow-hidden"
                                        rows={1}
                                    />
                                </div>
                            </div>

                            <button onClick={() => logic.setIsModalOpen(false)}
                                    className="ml-4 p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition shrink-0">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* SPLIT EDITOR */}
                        <div className="flex-1 flex overflow-hidden relative">
                            <div style={{width: `${logic.leftWidth}%`}}
                                 className="flex flex-col bg-slate-900 border-r border-slate-700">
                                <textarea
                                    className="flex-1 w-full p-6 font-mono text-base bg-slate-900 text-green-400 outline-none resize-none"
                                    value={sub.content?.[logic.modalLang] || ''}
                                    onChange={(e) => logic.handleUpdateField('content', logic.modalLang, e.target.value)}
                                    dir="ltr"
                                />
                            </div>
                            <div onMouseDown={logic.startResizing}
                                 className="w-1.5 h-full bg-slate-300 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors group">
                                <div className="bg-white border rounded-full p-1 shadow-sm">
                                    <GripVertical size={12} className="text-slate-400"/>
                                </div>
                            </div>
                            <div style={{width: `${100 - logic.leftWidth}%`}} className="flex flex-col bg-slate-50">
                                <div className="flex-1 overflow-y-auto p-10 bg-white m-4 rounded-xl shadow-inner"
                                     dir={logic.modalLang === 'he' ? 'rtl' : 'ltr'}
                                     dangerouslySetInnerHTML={{__html: sub.content?.[logic.modalLang] || ''}}/>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50 flex justify-end">
                            <button
                                onClick={() => {
                                    //publishToCloud();              // First, save to the cloud
                                    logic.setIsModalOpen(false);   // Then, close the modal
                                }}
                                className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                            >
                                <CheckCircle2 size={18}/>
                                {isHe ? 'שמור ופרסם שינויים' : 'Save & Publish Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubMenuEditor;