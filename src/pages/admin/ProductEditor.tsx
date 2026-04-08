import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, Loader2, Plus, Trash2 } from 'lucide-react';

interface ProductEditorProps {
    product: any;
    onClose: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onClose }) => {
    const isEditing = !!product;
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title_en: product?.title_en || '',
        title_ar: product?.title_ar || '',
        price: product?.price || '',
        original_price: product?.original_price || '',
        category_en: product?.category_en || '',
        category_ar: product?.category_ar || '',
        description_en: product?.description_en || '',
        description_ar: product?.description_ar || '',
        available: product ? product.available : true,
        image: product?.image || '',
        gallery: product?.gallery || [],
        colors: product?.colors || []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'gallery_add') => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            setUploadingImage(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
            
            if (field === 'image') {
                setFormData({ ...formData, image: data.publicUrl });
            } else {
                setFormData({ ...formData, gallery: [...formData.gallery, data.publicUrl] });
            }
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        setFormData({ ...formData, gallery: newGallery });
    };

    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: '', quantity: 0, image: '' }]
        });
    };

    const updateColor = (index: number, field: string, value: any) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData({ ...formData, colors: newColors });
    };

    const removeColor = (index: number) => {
        const newColors = [...formData.colors];
        newColors.splice(index, 1);
        setFormData({ ...formData, colors: newColors });
    };

    const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            setUploadingImage(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `color_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
            updateColor(index, 'image', data.publicUrl);
        } catch (error: any) {
            alert('Error uploading color image: ' + error.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData
        };

        let result;
        if (isEditing) {
            result = await supabase.from('products').update(payload).eq('id', product.id);
        } else {
            result = await supabase.from('products').insert([payload]);
        }

        setLoading(false);

        if (result.error) {
            alert('Error saving product: ' + result.error.message);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-bg/90 backdrop-blur-sm cursor-auto" style={{ cursor: 'auto' }}>
            <div className="w-full max-w-4xl bg-bg border border-silver/20 shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh]">
                
                {/* Fixed Header */}
                <div className="border-b border-silver/20 p-6 flex justify-between items-center shrink-0 bg-bg z-10">
                    <h2 className="text-2xl font-[UnifrakturMaguntia]">{isEditing ? 'Edit Product' : 'New Product'}</h2>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-fg/10 rounded-sm transition-colors text-silver hover:text-fg">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <form id="product-form" onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12 overflow-y-auto flex-1">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest text-silver border-b border-silver/20 pb-2">English Details</h3>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Title</label>
                                <input required type="text" name="title_en" value={formData.title_en} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Category</label>
                                <input required type="text" name="category_en" value={formData.category_en} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Description</label>
                                <textarea name="description_en" value={formData.description_en} onChange={handleChange} className="w-full min-h-[100px] bg-transparent border border-silver/30 p-3 text-xs outline-none focus:border-fg" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-widest text-silver border-b border-silver/20 pb-2">Arabic Details <span className="font-sans">(التفاصيل بالعربية)</span></h3>
                            <div dir="rtl">
                                <label className="block text-[10px] tracking-widest uppercase mb-2 font-sans font-bold">الاسم</label>
                                <input required type="text" name="title_ar" value={formData.title_ar} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg font-sans" />
                            </div>
                            <div dir="rtl">
                                <label className="block text-[10px] tracking-widest uppercase mb-2 font-sans font-bold">الصنف</label>
                                <input required type="text" name="category_ar" value={formData.category_ar} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg font-sans" />
                            </div>
                            <div dir="rtl">
                                <label className="block text-[10px] tracking-widest uppercase mb-2 font-sans font-bold">الوصف</label>
                                <textarea name="description_ar" value={formData.description_ar} onChange={handleChange} className="w-full min-h-[100px] bg-transparent border border-silver/30 p-3 text-xs outline-none focus:border-fg font-sans" />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Config */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-silver border-b border-silver/20 pb-2 mb-6">Pricing & Status</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Price (e.g. 2000da)</label>
                                <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg" />
                            </div>
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Old Price (Optional)</label>
                                <input type="text" name="original_price" value={formData.original_price} onChange={handleChange} className="w-full bg-transparent border-b border-silver/30 py-2 outline-none focus:border-fg" />
                            </div>
                            <div className="flex items-center mt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="w-4 h-4 accent-fg" />
                                    <span className="text-xs uppercase tracking-widest">Available to purchase</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Images Config */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-silver border-b border-silver/20 pb-2 mb-6">Media Assets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Main Image */}
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2">Main Image (Required)</label>
                                <div className="border border-dashed border-silver/30 bg-fg/5 aspect-[4/5] max-h-[300px] flex items-center justify-center relative overflow-hidden group">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-silver text-xs flex flex-col items-center gap-2">
                                            <Upload size={24} />
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-sm">
                                        {uploadingImage ? <Loader2 className="animate-spin" /> : <span>Change Image</span>}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} disabled={uploadingImage} />
                                    </label>
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <label className="block text-[10px] tracking-widest uppercase mb-2 flex justify-between items-end">
                                    Gallery Images
                                    <label className="bg-fg text-bg px-2 py-1 flex items-center gap-1 cursor-pointer text-[8px] hover:bg-silver transition-colors">
                                        <Plus size={10} /> ADD
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery_add')} disabled={uploadingImage} />
                                    </label>
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {formData.gallery.map((url: string, index: number) => (
                                        <div key={index} className="aspect-square bg-fg/10 relative group border border-silver/20">
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.gallery.length === 0 && (
                                        <div className="col-span-3 text-silver text-[10px] py-8 text-center border border-dashed border-silver/20">
                                            No additional gallery images.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variations Config */}
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-silver border-b border-silver/20 pb-2 mb-6 flex justify-between items-end">
                            Variations (Colors & Stock)
                            <button type="button" onClick={addColor} className="bg-fg text-bg px-3 py-1 flex items-center gap-1 cursor-pointer text-[10px] hover:bg-silver transition-colors">
                                <Plus size={12} /> ADD COLOR
                            </button>
                        </h3>
                        
                        <div className="space-y-4">
                            {formData.colors.map((color: any, index: number) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-fg/5 border border-silver/20 p-4">
                                    <div className="sm:col-span-1">
                                        <div className="w-12 h-12 bg-black/10 flex items-center justify-center border border-dashed border-silver/30 relative group overflow-hidden">
                                            {color.image ? (
                                                <img src={color.image} className="w-full h-full object-cover" alt={color.name} />
                                            ) : (
                                                <Upload size={14} className="text-silver" />
                                            )}
                                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(e, index)} disabled={uploadingImage} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-5">
                                        <label className="block text-[8px] tracking-widest uppercase mb-1 text-silver">Color Name</label>
                                        <input type="text" value={color.name} onChange={(e) => updateColor(index, 'name', e.target.value)} placeholder="e.g. Black" className="w-full bg-transparent border-b border-silver/30 py-1 outline-none focus:border-fg text-sm" required />
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label className="block text-[8px] tracking-widest uppercase mb-1 text-silver">Stock Quantity</label>
                                        <input type="number" value={color.quantity} onChange={(e) => updateColor(index, 'quantity', parseInt(e.target.value) || 0)} min="0" className="w-full bg-transparent border-b border-silver/30 py-1 outline-none focus:border-fg text-sm" required />
                                    </div>
                                    <div className="sm:col-span-2 text-right">
                                        <button type="button" onClick={() => removeColor(index)} className="text-red-500 text-[10px] uppercase tracking-widest hover:text-red-400">
                                            <Trash2 size={16} className="inline mr-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.colors.length === 0 && (
                                <div className="text-silver text-[10px] py-6 text-center border border-dashed border-silver/20 uppercase tracking-widest">
                                    No variations added. Product is assumed single-variant.
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Fixed Footer Actions */}
                <div className="p-6 border-t border-silver/20 flex justify-end gap-4 shrink-0 bg-bg z-10">
                    <button type="button" onClick={onClose} className="px-6 py-3 text-xs uppercase tracking-widest text-silver hover:text-fg transition-colors">Cancel</button>
                    <button form="product-form" type="submit" disabled={loading || uploadingImage} className="px-8 py-3 bg-fg text-bg text-xs font-bold uppercase tracking-widest hover:bg-silver transition-colors flex items-center gap-2">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductEditor;
