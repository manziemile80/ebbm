import { useState } from 'react';
import { useEBM, UserRole } from '@/contexts/EBMContext';

const LoginScreen = () => {
  const { login } = useEBM();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) login(name.trim(), role);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-[0_0_0_1px_hsl(var(--border)),0_8px_30px_-12px_hsl(0_0%_0%/0.15)] w-full max-w-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold text-sm">E</div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">EdTech EBM Simulator</h1>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Training Center</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent/40"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['admin', 'student'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    role === r
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-background text-muted-foreground border-input hover:bg-muted'
                  }`}
                >
                  {r === 'admin' ? 'Admin' : 'Student'}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Enter Simulator
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
