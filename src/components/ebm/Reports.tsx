import { useEBM } from '@/contexts/EBMContext';
import { BarChart3, TrendingUp, Package } from 'lucide-react';

const Reports = () => {
  const { transactions, products, stockMovements } = useEBM();

  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const totalVAT = transactions.reduce((s, t) => s + t.vat, 0);
  const totalSubtotal = transactions.reduce((s, t) => s + t.subtotal, 0);

  // Sales by product
  const salesByProduct = new Map<string, { name: string; qty: number; revenue: number }>();
  transactions.forEach(t => t.items.forEach(i => {
    const existing = salesByProduct.get(i.id) || { name: i.name, qty: 0, revenue: 0 };
    existing.qty += i.quantity;
    existing.revenue += i.price * i.quantity;
    salesByProduct.set(i.id, existing);
  }));
  const topProducts = [...salesByProduct.values()].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Sales (Excl. VAT)</span>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">RWF {totalSubtotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        </div>
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-success" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">VAT Collected (18%)</span>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-success">RWF {totalVAT.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        </div>
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gross Revenue</span>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">RWF {totalRevenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))]">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Sales by Product</h3>
        </div>
        {topProducts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No sales data yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {topProducts.map(p => (
              <div key={p.name} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                </div>
                <span className="font-mono font-semibold tabular-nums text-sm text-foreground">RWF {p.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Summary */}
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))]">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Package size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Current Stock Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Stock</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">{p.stock}</td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">{(p.stock * p.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/50">
              <td className="px-4 py-2.5 font-semibold text-foreground">Total</td>
              <td className="px-4 py-2.5 text-right font-mono tabular-nums font-semibold text-foreground">{products.reduce((s, p) => s + p.stock, 0)}</td>
              <td className="px-4 py-2.5 text-right font-mono tabular-nums font-semibold text-foreground">{products.reduce((s, p) => s + p.stock * p.price, 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Stock Movements */}
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))]">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Stock Movements</h3>
        </div>
        {stockMovements.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No stock movements yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {stockMovements.slice(0, 20).map(m => (
              <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{m.productName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(m.date).toLocaleString()} · {m.reference}</p>
                </div>
                <span className={`font-mono font-semibold tabular-nums text-sm ${m.type === 'in' ? 'text-success' : 'text-destructive'}`}>
                  {m.type === 'in' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
