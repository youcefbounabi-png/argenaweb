import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    id: number;
    title: string;
    price: string;
    image: string;
    category: string;
    quantity: number;
    selectedColor?: string;
}

interface CartContextValue {
    items: CartItem[];
    count: number;
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number, selectedColor?: string) => void;
    updateQty: (id: number, qty: number, selectedColor?: string) => void;
    clearCart: () => void;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    isCheckoutOpen: boolean;
    openCheckout: (product?: any) => void;
    closeCheckout: () => void;
    selectedProduct: any;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    const addItem = useCallback((product: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id && i.selectedColor === product.selectedColor);
            if (existing) {
                return prev.map(i =>
                    (i.id === product.id && i.selectedColor === product.selectedColor)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((id: number, selectedColor?: string) => {
        setItems(prev => prev.filter(i => !(i.id === id && i.selectedColor === selectedColor)));
    }, []);

    const updateQty = useCallback((id: number, qty: number, selectedColor?: string) => {
        if (qty < 1) return;
        setItems(prev => prev.map(i =>
            (i.id === id && i.selectedColor === selectedColor)
                ? { ...i, quantity: qty }
                : i
        ));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const openCheckout = useCallback((product?: any) => {
        setSelectedProduct(product || null);
        setIsCheckoutOpen(true);
    }, []);

    const closeCheckout = useCallback(() => {
        setIsCheckoutOpen(false);
        setSelectedProduct(null);
    }, []);

    return (
        <CartContext.Provider value={{
            items, count, addItem, removeItem, updateQty, clearCart,
            isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
            isCheckoutOpen, openCheckout, closeCheckout, selectedProduct
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
