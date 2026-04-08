import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import ProductEditor from './ProductEditor';

const AdminDashboard = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
        fetchProducts();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/admin/login');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const deleteProduct = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Failed to delete: ' + error.message);
        } else {
            fetchProducts();
        }
    };

    const openEditor = (product = null) => {
        setEditingProduct(product);
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh list just in case
    };

    if (loading && products.length === 0) {
        return <div className="min-h-screen bg-bg text-fg flex items-center justify-center font-mono">LOADING SYSTEM...</div>;
    }

    return (
        <div className="min-h-screen bg-bg text-fg font-mono cursor-auto" style={{ cursor: 'auto' }}>
            {/* Top Navigation */}
            <header className="border-b border-silver/20 px-6 py-4 flex justify-between items-center bg-fg/5 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <h1 className="font-[UnifrakturMaguntia] text-3xl">Archive Admin</h1>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-silver hover:text-red-400 transition-colors"
                >
                    <LogOut size={14} /> Log Out
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-12 border-b border-silver/20 pb-4">
                    <div>
                        <h2 className="text-4xl mb-2">Products</h2>
                        <p className="text-silver text-xs uppercase tracking-widest">Manage your catalog</p>
                    </div>
                    <button 
                        onClick={() => openEditor(null)}
                        className="flex items-center gap-2 bg-fg text-bg px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-silver transition-colors"
                    >
                        <Plus size={16} /> New Product
                    </button>
                </div>

                {products.length === 0 && !loading ? (
                    <div className="text-center py-24 border border-dashed border-silver/20 rounded-sm">
                        <p className="text-silver uppercase tracking-widest text-sm mb-4">No products found</p>
                        <button onClick={() => openEditor(null)} className="text-fg underline uppercase text-xs tracking-widest">Create the first one</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="border border-silver/20 p-4 bg-fg/5 group">
                                <div className="aspect-square bg-black/10 mb-4 overflow-hidden rounded-sm relative">
                                    <img 
                                        src={product.image || 'https://via.placeholder.com/400'} 
                                        alt={product.title_en} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditor(product)} className="p-2 bg-bg text-fg rounded-sm hover:bg-fg hover:text-bg transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => deleteProduct(product.id)} className="p-2 bg-bg text-red-500 rounded-sm hover:bg-red-500 hover:text-bg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-sm tracking-wide">{product.title_en}</h3>
                                        <p className="text-[10px] text-silver font-sans text-right" dir="rtl">{product.title_ar}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold">{product.price}</p>
                                        <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${product.available ? 'bg-green-500/20 text-green-400' : 'bg-silver/20 text-silver'}`}>
                                            {product.available ? 'Available' : 'Draft/Soon'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isEditorOpen && (
                <ProductEditor product={editingProduct} onClose={closeEditor} />
            )}
        </div>
    );
};

export default AdminDashboard;
