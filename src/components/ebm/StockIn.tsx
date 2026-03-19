import { useState } from 'react';
import { useEBM } from '@/contexts/EBMContext';
import { Package } from 'lucide-react';

const StockIn = () => {
  const { products, addStockIn, stockMovements } = useEBM();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;
    addStockIn(productId, quantity, reference || 'Manual Entry');
    setProductId('');
    setQuantity(0);
    setReference('');
  };

  const inMovements = stockMovements.filter(m => m.type === 'in');

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Package size={16} className="text-accent" /> Record Stock In
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select value={productId} onChange={e => setProductId(e.target.value)} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40">
            <option value="">Select product...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
          </select>
          <input type="number" placeholder="Quantity" value={quantity || ''} onChange={e => setQuantity(+e.target.value)} min={1} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40" />
          <input placeholder="Reference / PO#" value={reference} onChange={e => setReference(e.target.value)} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40" />
          <button type="submit" className="px-4 py-2 bg-success text-success-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            Add Stock
          </button>
        </form>
      </div>

      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Stock In History</h3>
        </div>
        {inMovements.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No stock-in records yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Qty</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inMovements.map(m => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(m.date).toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-medium text-foreground">{m.productName}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-success">+{m.quantity}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockIn;
