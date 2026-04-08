import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/admin');
            }
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-bg text-fg flex items-center justify-center p-6 font-mono cursor-auto" style={{ cursor: 'auto' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-fg/5 border border-silver/20 p-8 rounded-sm backdrop-blur-xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-fg text-bg flex items-center justify-center mb-6">
                        <Lock size={24} />
                    </div>
                    <h1 className="font-[UnifrakturMaguntia] text-5xl mb-2">Admin</h1>
                    <p className="text-silver text-xs uppercase tracking-[0.2em]">Secure Gateway</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] text-silver mb-2 tracking-widest uppercase">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-silver/30 py-3 text-sm outline-none focus:border-fg transition-colors"
                            placeholder="admin@argena.com"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] text-silver mb-2 tracking-widest uppercase">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-silver/30 py-3 text-sm outline-none focus:border-fg transition-colors tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-fg text-bg py-4 text-xs font-bold uppercase tracking-[0.2em] border border-fg hover:bg-bg hover:text-fg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Archive'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
