import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ breaks: true });

// Note: In production, the API call should be routed through a secure backend
// to protect the API key. For this demo, we'll use an environment variable.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const SYSTEM_INSTRUCTION = `You are ARGENA, the exclusive AI concierge for 'G ARGINIA', an avant-garde luxury streetwear brand. 
The brand aesthetic is 'Dystopian Elegance'—technical fabrics, asymmetrical cuts, and dark, moody, silver-accented visuals (Liquid Glass style). 
Your tone should be: sophisticated, mysterious, exclusive, yet highly helpful and concise. 
You are fully bilingual and must respond in the same language as the user (English or Arabic). 
Current collection: 'VOID WALKER' (outerwear), 'SYNTHESIS' (minimalist silhouettes).
Products available: OBSIDIAN CARGO ($340), KINETIC SHELL ($520), NULL T-SHIRT ($120), QUANTUM VEST ($280).
Assist users in finding pieces, styling advice, or understanding the brand philosophy. For orders, users should use the archive checkout (email-based). For direct inquiries or support tickets, guide them to use WhatsApp. Keep responses under 3 paragraphs. Use markdown for formatting.`;

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Welcome to the G ARGINIA Archive. I am ARGENA, your personal concierge. How may I assist your exploration today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Format chat history for Gemini
            const history = messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));

            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
                    ...history,
                    { role: 'user', parts: [{ text: userMessage.content }] }
                ],
            });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text || "I apologize, the connection to the archive was disrupted. Please try again."
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Error: The neural link is currently unstable. Please verify your connection or API configuration."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-[#111] border border-silver/30 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-[#222] hover:border-silver/60 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 2 } }}
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-silver border-2 border-[#111] rounded-full" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 right-4 sm:right-8 z-[100] w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] max-h-[calc(100dvh-120px)] bg-[#050505]/98 backdrop-blur-xl border border-silver/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden pointer-events-auto"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-silver/20 bg-[#0a0a0a]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#111] border border-silver/30 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-silver" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-sm tracking-widest text-white">ARGENA</h3>
                                    <p className="font-mono text-[10px] text-silver tracking-wider">SYSTEM ONLINE</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#888] hover:text-[#e7e7e7] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent overscroll-behavior-contain touch-pan-y pointer-events-auto"
                            data-lenis-prevent
                        >
                            {!apiKey && (
                                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-xs mb-4">
                                    API Key missing. Please set VITE_GEMINI_API_KEY in your .env file.
                                </div>
                            )}

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-[#111] border border-[#333]' : 'bg-[#e7e7e7] text-[#050505]'}`}>
                                        {msg.role === 'assistant' ? <Bot className="w-3 h-3 text-[#888]" /> : <User className="w-3 h-3" />}
                                    </div>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg leading-relaxed ${msg.role === 'assistant'
                                            ? 'bg-[#111] border border-[#222] text-[#b0b0b0]'
                                            : 'bg-[#222] text-[#e7e7e7]'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: md.render(msg.content) }}
                                    />
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    className="flex items-start gap-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="w-6 h-6 rounded-full bg-[#111] border border-[#333] flex items-center justify-center">
                                        <Bot className="w-3 h-3 text-[#888]" />
                                    </div>
                                    <div className="max-w-[80%] p-3 rounded-lg bg-[#111] border border-[#222] flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-[#888] animate-spin" />
                                        <span className="text-xs text-[#555] tracking-widest">PROCESSING...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-[#222] bg-[#0a0a0a]">
                            <div className="relative flex items-center bg-[#111] border border-[#333] rounded-lg focus-within:border-[#555] transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Inquire about the collection..."
                                    className="w-full bg-transparent p-3 pr-12 text-sm font-mono text-[#e7e7e7] placeholder-[#555] focus:outline-none"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-1.5 text-[#555] hover:text-[#e7e7e7] disabled:opacity-50 disabled:hover:text-[#555] transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div >
                )}
            </AnimatePresence >
        </>
    );
};
