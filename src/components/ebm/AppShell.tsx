import { useState } from 'react';
import { useEBM } from '@/contexts/EBMContext';
import { LayoutDashboard, ShoppingCart, Package, History, BarChart3, UserCircle, LogOut, PackagePlus } from 'lucide-react';
import Dashboard from './Dashboard';
import SalesTerminal from './SalesTerminal';
import ProductManagement from './ProductManagement';
import StockIn from './StockIn';
import TransactionHistory from './TransactionHistory';
import Reports from './Reports';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'EBM Terminal', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'stockin', label: 'Stock In', icon: PackagePlus },
  { id: 'history', label: 'Transactions', icon: History },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const AppShell = () => {
  const { user, logout } = useEBM();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'sales': return <SalesTerminal />;
      case 'products': return <ProductManagement />;
      case 'stockin': return <StockIn />;
      case 'history': return <TransactionHistory />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold text-sm">E</div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">EdTech EBM</h1>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Simulator v1.0</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted mb-2">
            <UserCircle className="text-muted-foreground shrink-0" size={20} />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{user?.role} · Training</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h2 className="font-semibold text-sm text-muted-foreground capitalize">{activeTab === 'stockin' ? 'Stock In' : navItems.find(n => n.id === activeTab)?.label}</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Simulator Online
          </div>
        </header>
        <div className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
