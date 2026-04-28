import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id);
        if (existing) {
          set({ items: get().items.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQuantity: (id, cantidad) => set({ items: get().items.map(i => i.id === id ? { ...i, cantidad } : i) }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
      totalPrice: () => get().items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0),
    }),
    { name: 'cart-storage' }
  )
);
