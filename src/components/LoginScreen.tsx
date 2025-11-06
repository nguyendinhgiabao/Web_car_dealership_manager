import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bike } from 'lucide-react';
import { UserRole } from '../App';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role?: UserRole) => void;
}

const quickLoginRoles: { role: UserRole; label: string; desc: string }[] = [
  { role: 'manager', label: 'Quản lý', desc: 'Toàn quyền truy cập' },
  { role: 'sales', label: 'Nhân viên bán hàng', desc: 'POS, đơn hàng, khách hàng' },
  { role: 'warehouse', label: 'Nhân viên kho', desc: 'Sản phẩm, tồn kho' },
  { role: 'accountant', label: 'Kế toán', desc: 'Đơn hàng, báo cáo, thanh toán' },
  { role: 'cskh', label: 'CSKH', desc: 'Khách hàng, đơn hàng' },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleQuickLogin = (role: UserRole) => {
    onLogin('demo@pos.com', 'demo', role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-center">POS - Quản lý cửa hàng xe máy</CardTitle>
            <CardDescription className="text-center">
              Đăng nhập vào hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email hoặc Số điện thoại</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <Button type="button" variant="ghost" className="w-full">
                Quên mật khẩu?
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Đăng nhập nhanh - Demo</CardTitle>
            <CardDescription>
              Chọn vai trò để xem quyền truy cập tương ứng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLoginRoles.map(({ role, label, desc }) => (
              <button
                key={role}
                onClick={() => handleQuickLogin(role)}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="text-gray-900 mb-1">{label}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}