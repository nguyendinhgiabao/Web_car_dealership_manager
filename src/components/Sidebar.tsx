import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Gift, 
  FileText, 
  Users, 
  BarChart3,
  Warehouse,
  UserCog,
  Wrench,
  Bike,
  Shield
} from 'lucide-react';
import { UserRole } from '../App';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: UserRole;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['manager', 'sales', 'warehouse', 'accountant', 'cskh'],
  },
  {
    id: 'pos',
    label: 'Bán hàng (POS)',
    icon: <ShoppingCart className="w-5 h-5" />,
    roles: ['manager', 'sales'],
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    icon: <Package className="w-5 h-5" />,
    roles: ['manager', 'sales', 'warehouse'],
  },
  {
    id: 'inventory',
    label: 'Tồn kho',
    icon: <Warehouse className="w-5 h-5" />,
    roles: ['manager', 'warehouse', 'accountant'],
  },
  {
    id: 'promotions',
    label: 'Khuyến mãi',
    icon: <Gift className="w-5 h-5" />,
    roles: ['manager', 'sales'],
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: <FileText className="w-5 h-5" />,
    roles: ['manager', 'sales', 'accountant'],
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    icon: <Users className="w-5 h-5" />,
    roles: ['manager', 'sales', 'cskh'],
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['manager', 'accountant'],
  },
  {
    id: 'staff',
    label: 'Nhân viên',
    icon: <UserCog className="w-5 h-5" />,
    roles: ['manager'],
  },
  {
    id: 'permissions',
    label: 'Phân quyền',
    icon: <Shield className="w-5 h-5" />,
    roles: ['manager', 'sales', 'warehouse', 'accountant', 'cskh'],
  },
];

export function Sidebar({ currentPage, onNavigate, userRole }: SidebarProps) {
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-gray-900">POS System</div>
            <div className="text-xs text-gray-500">Quản lý xe máy</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              currentPage === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}