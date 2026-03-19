import { useState } from 'react';
import { useEBM } from '@/contexts/EBMContext';

const TransactionHistory = () => {
  const { transactions } = useEBM();
  const [filter, setFilter] = useState('');

  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(filter.toLowerCase()) ||
    t.cashier.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
        <input
          placeholder="Search by ID or cashier..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-1.5 border border-input rounded-lg text-sm w-64 bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No transactions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Receipt #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cashier</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Items</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Subtotal</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">VAT</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-accent">{t.id}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-foreground">{t.cashier}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{t.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">{t.subtotal.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-success">{t.vat.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums font-semibold text-foreground">{t.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
