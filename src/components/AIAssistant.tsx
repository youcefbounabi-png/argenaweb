import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import { supabase } from '../lib/supabase';

const md = new MarkdownIt({ breaks: true });

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const SYSTEM_INSTRUCTION = `You are ARGENA, the exclusive AI concierge for 'G ARGINIA', an avant-garde luxury streetwear brand. 
The brand aesthetic is 'Ethereal Minimalism'—technical fabrics, asymmetrical cuts, and clean, premium, silver-accented visuals (Liquid Glass style). 
Your tone should be: sophisticated, mysterious, exclusive, yet highly helpful and concise. 
You are fully bilingual and must respond in the same language as the user (English or Arabic). 
Current collection: 'THE ARCHIVE' (Exclusive Headwear).
Products available: 
- B LETTER DISTRESSED CAP (2000da) - Vintage B-Letter distressed baseball cap in premium washed cotton.
- A DISTRESSED CAP (2000da) - Vintage A-Letter distressed baseball cap in premium washed cotton.
Note: We currently only offer caps. Accessories and other clothing items are not yet available in the archive. 
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
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Format chat history for the edge function
            const history = messages.slice(1).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                text: m.content
            }));
            
            const { data, error } = await supabase.functions.invoke('gemini-chat', {
                body: {
                    systemPrompt: SYSTEM_INSTRUCTION,
                    userMessage: userMessage.content,
                    history: history
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data?.text || "I apologize, the connection to the archive was disrupted. Please try again."
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error("Gemini Assistant Error:", error);
            
            let errorMessage = "Error: The neural link is currently unstable. Please verify your connection or API configuration.";
            
            if (error.message?.includes('RATE_LIMITED')) {
                errorMessage = "The Archive concierge is currently processing high traffic. ARGENA will be with you in a moment. [Retry sync]";
            } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
                errorMessage = "Connection disruption detected. Please check your network stability.";
            } else if (error.message) {
                errorMessage = `Archive sync failed: ${error.message}`;
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-8 right-8 z-[10001] w-14 h-14 bg-fg border border-silver/30 rounded-full flex items-center justify-center shadow-lg text-bg hover:opacity-90 hover:border-silver/60 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 2 } }}
            >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-silver border-2 border-bg rounded-full" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 right-4 sm:right-8 z-[10001] w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] max-h-[calc(100dvh-120px)] bg-bg/98 backdrop-blur-xl border border-silver/20 rounded-2xl flex flex-col shadow-2xl overflow-hidden pointer-events-auto"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-silver/20 bg-bg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-silver/10 border border-silver/30 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-silver" />
                                </div>
                                <div>
                                    <h3 className="font-mono text-sm tracking-widest text-fg">ARGENA</h3>
                                    <p className="font-mono text-[10px] text-silver tracking-wider">SYSTEM ONLINE</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-silver hover:text-fg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent overscroll-behavior-contain touch-pan-y pointer-events-auto"
                            data-lenis-prevent
                        >

                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-silver/10 border border-silver/30' : 'bg-fg text-bg'}`}>
                                        {msg.role === 'assistant' ? <Bot className="w-3 h-3 text-silver" /> : <User className="w-3 h-3" />}
                                    </div>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg leading-relaxed ${msg.role === 'assistant'
                                            ? 'bg-silver/5 border border-silver/10 text-fg/80'
                                            : 'bg-silver/10 text-fg'
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
                                    <div className="w-6 h-6 rounded-full bg-silver/10 border border-silver/30 flex items-center justify-center">
                                        <Bot className="w-3 h-3 text-silver" />
                                    </div>
                                    <div className="max-w-[80%] p-3 rounded-lg bg-silver/5 border border-silver/10 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-silver animate-spin" />
                                        <span className="text-xs text-silver tracking-widest">PROCESSING...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-silver/10 bg-bg">
                            <div className="relative flex items-center bg-silver/5 border border-silver/20 rounded-lg focus-within:border-silver/40 transition-colors">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Inquire about the collection..."
                                    className="w-full bg-transparent p-3 pr-12 text-sm font-mono text-fg placeholder-silver/40 focus:outline-none"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-1.5 text-silver hover:text-fg disabled:opacity-50 disabled:hover:text-silver transition-colors"
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
