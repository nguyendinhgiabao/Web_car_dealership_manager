import { Bell, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User as UserType } from '../App';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  manager: 'Quản lý',
  sales: 'Nhân viên bán hàng',
  warehouse: 'Nhân viên kho',
  accountant: 'Kế toán',
  cskh: 'CSKH',
};

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <span className="text-gray-500 text-sm">Xin chào, </span>
        <span className="text-gray-900">{user.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <Avatar>
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">{roleLabels[user.role]}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
