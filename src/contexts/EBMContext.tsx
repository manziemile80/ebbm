import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'student';

export interface User {
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'sale';
  quantity: number;
  date: string;
  reference: string;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
  cashier: string;
}

const VAT_RATE = 0.18;

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: 'BK-001', name: 'Accounting Textbook', price: 15000, stock: 50, category: 'Books' },
  { id: '2', code: 'BK-002', name: 'Tax Law Manual', price: 22000, stock: 30, category: 'Books' },
  { id: '3', code: 'ST-001', name: 'Calculator (Scientific)', price: 8500, stock: 100, category: 'Stationery' },
  { id: '4', code: 'ST-002', name: 'Notebook A4 (Pack 5)', price: 3500, stock: 200, category: 'Stationery' },
  { id: '5', code: 'ST-003', name: 'Pen Set (Blue/Black)', price: 1200, stock: 300, category: 'Stationery' },
  { id: '6', code: 'BK-003', name: 'Financial Reporting Guide', price: 18000, stock: 25, category: 'Books' },
  { id: '7', code: 'IT-001', name: 'USB Flash Drive 32GB', price: 5000, stock: 80, category: 'IT Supplies' },
  { id: '8', code: 'IT-002', name: 'Mouse (Wireless)', price: 7500, stock: 45, category: 'IT Supplies' },
];

interface EBMContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  transactions: Transaction[];
  addSale: (items: CartItem[], cashierName: string) => Transaction;
  stockMovements: StockMovement[];
  addStockIn: (productId: string, quantity: number, reference: string) => void;
}

const EBMContext = createContext<EBMContextType | null>(null);

export const useEBM = () => {
  const ctx = useContext(EBMContext);
  if (!ctx) throw new Error('useEBM must be inside EBMProvider');
  return ctx;
};

export const EBMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const login = (name: string, role: UserRole) => setUser({ name, role });
  const logout = () => setUser(null);

  const addProduct = (p: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...p, id: crypto.randomUUID() }]);
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
  };

  const addSale = useCallback((items: CartItem[], cashierName: string): Transaction => {
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const subtotal = total / (1 + VAT_RATE);
    const vat = total - subtotal;
    const txn: Transaction = {
      id: `INV-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      items,
      subtotal,
      vat,
      total,
      cashier: cashierName,
    };
    setTransactions(prev => [txn, ...prev]);
    setProducts(prev => prev.map(p => {
      const item = items.find(i => i.id === p.id);
      return item ? { ...p, stock: p.stock - item.quantity } : p;
    }));
    items.forEach(item => {
      setStockMovements(prev => [{
        id: crypto.randomUUID(),
        productId: item.id,
        productName: item.name,
        type: 'sale',
        quantity: item.quantity,
        date: new Date().toISOString(),
        reference: txn.id,
      }, ...prev]);
    });
    return txn;
  }, []);

  const addStockIn = (productId: string, quantity: number, reference: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p));
    const product = products.find(p => p.id === productId);
    setStockMovements(prev => [{
      id: crypto.randomUUID(),
      productId,
      productName: product?.name || '',
      type: 'in',
      quantity,
      date: new Date().toISOString(),
      reference,
    }, ...prev]);
  };

  return (
    <EBMContext.Provider value={{ user, login, logout, products, addProduct, updateProduct, deleteProduct, transactions, addSale, stockMovements, addStockIn }}>
      {children}
    </EBMContext.Provider>
  );
};
