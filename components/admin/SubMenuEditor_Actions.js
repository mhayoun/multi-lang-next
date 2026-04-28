import { useState } from 'react';

//This file handles the AI interaction, clipboard operations, and backup/restore logic.

export const useSubMenuActions = (logic, isHe, sub) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);
    const [backupContent, setBackupContent] = useState(null);

    const showStatus = (type) => {
        setStatusMsg(type);
        setTimeout(() => setStatusMsg(null), 3000);
    };

    const handleAIGenerate = async (customRequest) => {
        const currentText = sub.content?.[logic.modalLang] || '';
        if (!currentText.trim() || isGenerating) return;

        setBackupContent(currentText);
        setIsGenerating(true);

        try {
            const GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_KEY;
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "Return ONLY clean HTML body content." },
                        { role: "user", content: `Task: ${customRequest}\n\nContent: ${currentText}` }
                    ]
                })
            });

            const data = await response.json();
            const rawHtml = data.choices?.[0]?.message?.content;
            if (rawHtml) {
                const cleanHtml = rawHtml.replace(/```html|```/g, '').replace(/<\/?(html|head|body)[^>]*>/gi, '').trim();
                logic.handleUpdateField('content', logic.modalLang, cleanHtml);
            }
        } catch (error) {
            alert(isHe ? "שגיאת חיבור ל-AI" : "AI Connection Error");
        } finally {
            setIsGenerating(false);
        }
    };

    const processFileToHtml = async (file, action, additionalParam) => {
        if (!file) return;
        setIsProcessingFile(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await action(formData, additionalParam);
            if (result.html) {
                await navigator.clipboard.writeText(result.html);
                showStatus('success');
            }
        } catch (e) {
            alert(isHe ? "שגיאה בעיבוד הקובץ" : "File processing error");
        } finally {
            setIsProcessingFile(false);
        }
    };

    return {
        isGenerating,
        isProcessingFile,
        statusMsg,
        backupContent,
        handleAIGenerate,
        processFileToHtml,
        handleRestore: () => {
            logic.handleUpdateField('content', logic.modalLang, backupContent);
            setBackupContent(null);
        }
    };
};