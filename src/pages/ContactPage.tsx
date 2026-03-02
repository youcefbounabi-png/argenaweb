import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TicketModal } from '../components/ui/TicketModal';
import SEO from '../components/ui/SEO';

export const ContactPage: React.FC = () => {
    const { language } = useLanguage();
    const [ticketOpen, setTicketOpen] = useState(false);

    const t = {
        title: language === 'EN' ? 'Contact' : 'اتصل بنا',
        subtitle: language === 'EN' ? 'Establish Communication' : 'خلينا على اتصال',
        openTicket: language === 'EN' ? 'OPEN TICKET' : 'طلب الدعم'
    };

    const contacts = [
        { icon: Mail, label: 'Email', value: 'ARGENASTREETWEAR@GMAIL.COM', link: 'mailto:argenastreetwear@gmail.com', onClick: undefined },
        { icon: Instagram, label: 'Instagram', value: '@ARGENA.STREETWEAR', link: 'https://www.instagram.com/argena.streetwear/', onClick: undefined },
        { icon: Send, label: 'Support', value: t.openTicket, link: undefined, onClick: () => setTicketOpen(true) },
    ];

    return (
        <>
            <SEO
                title="Contact"
                description="Establish communication with Argena Streetwear. Contact us for support, inquiries, or custom orders."
            />
            <div className="min-h-screen pt-48 pb-32 px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <h1 className={`${language === 'EN' ? 'font-[UnifrakturMaguntia] italic' : 'font-sans font-bold'} metallic-text text-7xl md:text-9xl mb-8`}>{t.title}</h1>
                    <p className={`font-mono text-xs text-silver tracking-[0.4em] uppercase ${language === 'AR' ? 'uppercase-none font-sans font-bold tracking-widest' : ''}`}>{t.subtitle}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl">
                    {contacts.map((item, i) => {
                        const Tag = item.onClick ? 'button' : 'a';
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Tag
                                    {...(item.onClick ? { onClick: item.onClick } : { href: item.link })}
                                    className="group w-full flex flex-col items-center p-12 border border-silver/10 hover:border-silver/40 transition-colors duration-500 cursor-pointer"
                                >
                                    <item.icon size={32} className="text-silver mb-6 group-hover:text-white transition-colors" strokeWidth={1} />
                                    <p className={`font-mono text-[10px] text-silver mb-2 tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-medium' : ''}`}>{item.label}</p>
                                    <p className={`font-mono text-xs text-white tracking-widest uppercase ${language === 'AR' ? 'uppercase-none font-sans font-bold' : ''}`}>{item.value}</p>
                                </Tag>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <TicketModal isOpen={ticketOpen} onClose={() => setTicketOpen(false)} />
        </>
    );
};

export default ContactPage;
