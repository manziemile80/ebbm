import { EBMProvider, useEBM } from '@/contexts/EBMContext';
import LoginScreen from '@/components/ebm/LoginScreen';
import AppShell from '@/components/ebm/AppShell';

const AppContent = () => {
  const { user } = useEBM();
  return user ? <AppShell /> : <LoginScreen />;
};

const Index = () => (
  <EBMProvider>
    <AppContent />
  </EBMProvider>
);

export default Index;
