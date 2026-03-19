import { useState, useRef } from 'react';
import { useEBM, CartItem, Transaction } from '@/contexts/EBMContext';
import { ShoppingCart, Plus, Minus, Trash2, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const SalesTerminal = () => {
  const { products, addSale, user } = useEBM();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [search, setSearch] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>EBM Receipt</title>
      <style>
        body { font-family: monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .row { display: flex; justify-content: space-between; }
        .dashed { border-top: 1px dashed #999; padding-top: 6px; margin-top: 6px; }
        .small { font-size: 10px; color: #666; }
      </style></head><body>${receiptRef.current.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    if (!receipt) return;
    const doc = new jsPDF({ unit: 'mm', format: [80, 200] });
    const w = 80;
    let y = 10;
    const lineH = 4.5;

    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.text('EDTECH SOLUTIONS TRAINING CENTER', w / 2, y, { align: 'center' });
    y += lineH;
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text('KIGALI, RWANDA', w / 2, y, { align: 'center' });
    y += lineH;
    doc.text('TIN: 100200300', w / 2, y, { align: 'center' });
    y += lineH + 2;
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.text('*** EBM RECEIPT ***', w / 2, y, { align: 'center' });
    y += lineH + 3;

    // Dashed line
    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, y, w - 5, y);
    y += lineH;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.text(`Receipt #: ${receipt.id}`, 5, y); y += lineH;
    doc.text(`Date: ${new Date(receipt.date).toLocaleString()}`, 5, y); y += lineH;
    doc.text(`Cashier: ${receipt.cashier}`, 5, y); y += lineH + 1;

    doc.line(5, y, w - 5, y);
    y += lineH;

    // Items
    receipt.items.forEach(item => {
      const name = `${item.name} x${item.quantity}`;
      const amount = (item.price * item.quantity).toLocaleString();
      doc.text(name, 5, y);
      doc.text(amount, w - 5, y, { align: 'right' });
      y += lineH;
    });

    y += 1;
    doc.line(5, y, w - 5, y);
    y += lineH;

    // Totals
    doc.text('TOTAL EXCL VAT', 5, y);
    doc.text(receipt.subtotal.toFixed(0), w - 5, y, { align: 'right' });
    y += lineH;
    doc.setFont('courier', 'bold');
    doc.text('VAT (18%)', 5, y);
    doc.text(receipt.vat.toFixed(0), w - 5, y, { align: 'right' });
    y += lineH + 1;
    doc.setFontSize(9);
    doc.text('TOTAL RWF', 5, y);
    doc.text(receipt.total.toLocaleString(), w - 5, y, { align: 'right' });
    y += lineH + 4;

    // Footer
    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.text('SDC ID: 0102030405', w / 2, y, { align: 'center' });
    y += lineH;
    doc.text(`MSDCID: ${receipt.id.slice(-8)}`, w / 2, y, { align: 'center' });
    y += lineH + 2;
    doc.setFontSize(7);
    doc.text('THANK YOU FOR PRACTICING', w / 2, y, { align: 'center' });

    doc.save(`receipt-${receipt.id}.pdf`);
  };

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())) && p.stock > 0
  );

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = i.quantity + delta;
      if (newQty <= 0) return i;
      const product = products.find(p => p.id === id);
      if (product && newQty > product.stock) return i;
      return { ...i, quantity: newQty };
    }));
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const subtotal = total / 1.18;
  const vat = total - subtotal;

  const handleComplete = () => {
    if (cart.length === 0) return;
    const txn = addSale(cart, user?.name || 'Unknown');
    setReceipt(txn);
    setCart([]);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      <div className="col-span-8 flex flex-col gap-4 overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-input rounded-lg text-sm w-64 bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1">
          {filtered.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-4 flex flex-col justify-between cursor-pointer hover:ring-2 ring-accent/20 transition-all active:scale-[0.98]"
            >
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{product.code}</span>
                <h3 className="font-medium text-sm text-foreground">{product.name}</h3>
              </div>
              <div className="mt-3 flex justify-between items-end">
                <span className="text-sm font-mono font-semibold tabular-nums text-foreground">RWF {product.price.toLocaleString()}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${product.stock < 20 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                  Qty: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2"><ShoppingCart size={16} /> Current Cart</h2>
            <span className="text-xs text-muted-foreground">{cart.length} items</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart size={36} strokeWidth={1} className="mb-2 opacity-20" />
                <p className="text-sm">Cart is empty</p>
              </div>
            )}
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between text-sm gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono tabular-nums">{item.quantity} × {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded hover:bg-muted text-muted-foreground"><Minus size={12} /></button>
                    <span className="text-xs font-mono tabular-nums w-6 text-center text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded hover:bg-muted text-muted-foreground"><Plus size={12} /></button>
                    <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive ml-1"><Trash2 size={12} /></button>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-xs w-20 text-right text-foreground">{(item.price * item.quantity).toLocaleString()}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-4 bg-surface border-t border-border space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal (Excl. VAT)</span>
              <span className="font-mono tabular-nums">{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>VAT (18%)</span>
              <span className="font-mono tabular-nums">{vat.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span className="font-mono tabular-nums">RWF {total.toLocaleString()}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleComplete}
              className="w-full mt-3 py-2.5 bg-success text-success-foreground rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              Issue EBM Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receipt && (
          <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-card shadow-2xl rounded-sm max-w-sm w-full p-1"
            >
              <div ref={receiptRef} className="receipt-paper border-2 border-dashed border-border p-6 text-foreground">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-sm">EDTECH SOLUTIONS TRAINING CENTER</h3>
                  <p>KIGALI, RWANDA</p>
                  <p>TIN: 100200300</p>
                  <p className="mt-2 font-bold">*** EBM RECEIPT ***</p>
                </div>
                <div className="border-b border-dashed border-border pb-2 mb-2">
                  <p>Receipt #: {receipt.id}</p>
                  <p>Date: {new Date(receipt.date).toLocaleString()}</p>
                  <p>Cashier: {receipt.cashier}</p>
                </div>
                <div className="space-y-1 mb-3">
                  {receipt.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                      <span className="tabular-nums">{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-border pt-2 space-y-1">
                  <div className="flex justify-between"><span>TOTAL EXCL VAT</span><span className="tabular-nums">{receipt.subtotal.toFixed(0)}</span></div>
                  <div className="flex justify-between font-bold"><span>VAT (18%)</span><span className="tabular-nums">{receipt.vat.toFixed(0)}</span></div>
                  <div className="flex justify-between text-sm font-bold pt-2"><span>TOTAL RWF</span><span className="tabular-nums">{receipt.total.toLocaleString()}</span></div>
                </div>
                <div className="text-center mt-6 text-[10px] text-muted-foreground">
                  <p>SDC ID: 0102030405</p>
                  <p>INTERNAL DATA: {crypto.randomUUID().slice(0, 8).toUpperCase()}</p>
                  <p className="mt-3">THANK YOU FOR PRACTICING</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-all rounded-sm">
                  <Download size={14} /> Download
                </button>
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-all rounded-sm">
                  <Printer size={14} /> Print
                </button>
              </div>
              <button onClick={() => setReceipt(null)} className="w-full mt-1 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all rounded-sm">
                Close & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesTerminal;
