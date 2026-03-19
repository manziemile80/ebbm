import { useState } from 'react';
import { useEBM } from '@/contexts/EBMContext';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const emptyForm = { code: '', name: '', price: 0, stock: 0, category: '' };

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct, user } = useEBM();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const isAdmin = user?.role === 'admin';

  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editing) {
      updateProduct({ id: editing, ...form });
      setEditing(null);
    } else {
      addProduct(form);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (p: typeof products[0]) => {
    setForm({ code: p.code, name: p.name, price: p.price, stock: p.stock, category: p.category });
    setEditing(p.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
        {isAdmin && (
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            <Plus size={14} /> Add Product
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] p-4 animate-slide-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-foreground">{editing ? 'Edit' : 'New'} Product</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['code', 'name', 'category'] as const).map(f => (
              <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={(form as any)[f]} onChange={e => setForm(prev => ({ ...prev, [f]: e.target.value }))} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40" />
            ))}
            <input placeholder="Price" type="number" value={form.price || ''} onChange={e => setForm(prev => ({ ...prev, price: +e.target.value }))} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40" />
            <input placeholder="Initial Stock" type="number" value={form.stock || ''} onChange={e => setForm(prev => ({ ...prev, stock: +e.target.value }))} className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40" />
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 col-span-2">
              {editing ? 'Update' : 'Add'} Product
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border))] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
              {isAdmin && <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.code}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-2.5 text-right font-mono tabular-nums text-foreground">{p.price.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-mono tabular-nums text-xs px-1.5 py-0.5 rounded ${p.stock < 20 ? 'bg-destructive/10 text-destructive' : 'text-foreground'}`}>
                    {p.stock}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => startEdit(p)} className="p-1 text-muted-foreground hover:text-accent transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-1"><Trash2 size={14} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
