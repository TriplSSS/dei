"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: string;
  priceNum: number;
  img: string;
  qty: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "setQty"; slug: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "dei-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.items.find((i) => i.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.slug === action.item.slug ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, qty }] };
    }
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.slug === action.slug ? { ...i, qty: Math.max(1, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case "remove":
      return { items: state.items.filter((i) => i.slug !== action.slug) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);
  const storageReadyRef = useRef(false);

  // загрузка из localStorage при монтировании
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      /* игнорируем повреждённые данные */
    }

    const timer = window.setTimeout(() => {
      storageReadyRef.current = true;
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // сохранение
  useEffect(() => {
    if (!storageReadyRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* приватный режим / переполнение — не критично */
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const total = state.items.reduce((s, i) => s + i.priceNum * i.qty, 0);
    return {
      items: state.items,
      count,
      total,
      add: (item, qty) => {
        dispatch({ type: "add", item, qty });
        setIsOpen(true);
      },
      remove: (slug) => dispatch({ type: "remove", slug }),
      setQty: (slug, qty) => dispatch({ type: "setQty", slug, qty }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [state.items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart должен использоваться внутри <CartProvider>");
  return ctx;
}
