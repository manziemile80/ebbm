import { useEBM } from '@/contexts/EBMContext';
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { products, transactions } = useEBM();

  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const totalVAT = transactions.reduce((s, t) => s + t.vat, 0);
  const lowStock = products.filter(p => p.stock < 20);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-accent' },
    { label: 'Transactions', value: transactions.length, icon: ShoppingCart, color: 'text-success' },
    { label: 'Revenue (RWF)', value: totalRevenue.toLocaleString(), icon: TrendingUp, color: 'text-foreground' },
    { label: 'VAT Collected', value: totalVAT.toLocaleString(), icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))]">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <AlertTriangle size={16} className="text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">Low Stock Alerts</h3>
          </div>
          <div className="divide-y divide-border">
            {lowStock.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">{p.code}</span>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                </div>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))]">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
        </div>
        {transactions.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No transactions yet. Go to the EBM Terminal to make a sale.</p>
        ) : (
          <div className="divide-y divide-border">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                  <p className="text-sm text-foreground">{new Date(t.date).toLocaleString()}</p>
                </div>
                <span className="font-mono font-semibold text-sm tabular-nums text-foreground">RWF {t.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
