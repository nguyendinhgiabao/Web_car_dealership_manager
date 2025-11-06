import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { POSScreen } from './components/POSScreen';
import { Promotions } from './components/Promotions';
import { Orders } from './components/Orders';
import { Customers } from './components/Customers';
import { Reports } from './components/Reports';
import { Inventory } from './components/Inventory';
import { Staff } from './components/Staff';
import { RolePermissions } from './components/RolePermissions';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toaster } from 'sonner@2.0.3';

export type UserRole = 'manager' | 'sales' | 'warehouse' | 'accountant' | 'cskh';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handleLogin = (email: string, password: string, role?: UserRole) => {
    // Mock authentication
    const mockUser: User = {
      id: '1',
      name: 'Nguyễn Văn A',
      email: email,
      role: role || 'manager',
    };
    setCurrentUser(mockUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userRole={currentUser.role} />;
      case 'products':
        return <Products userRole={currentUser.role} />;
      case 'pos':
        return <POSScreen />;
      case 'promotions':
        return <Promotions userRole={currentUser.role} />;
      case 'orders':
        return <Orders userRole={currentUser.role} />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports userRole={currentUser.role} />;
      case 'inventory':
        return <Inventory userRole={currentUser.role} />;
      case 'staff':
        return <Staff userRole={currentUser.role} />;
      case 'permissions':
        return <RolePermissions userRole={currentUser.role} />;
      default:
        return <Dashboard userRole={currentUser.role} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userRole={currentUser.role}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}