import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DollarSign, ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserRole } from '../App';

interface DashboardProps {
  userRole: UserRole;
}

const revenueData = [
  { date: '01/11', revenue: 85000000 },
  { date: '02/11', revenue: 95000000 },
  { date: '03/11', revenue: 78000000 },
  { date: '04/11', revenue: 120000000 },
  { date: '05/11', revenue: 105000000 },
  { date: '06/11', revenue: 130000000 },
  { date: '07/11', revenue: 98000000 },
];

const topProducts = [
  { name: 'Honda Wave Alpha', sold: 12, revenue: 180000000 },
  { name: 'Yamaha Exciter 155', sold: 8, revenue: 240000000 },
  { name: 'Honda Vision', sold: 15, revenue: 450000000 },
  { name: 'Yamaha Sirius', sold: 10, revenue: 180000000 },
];

export function Dashboard({ userRole }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Tổng quan hoạt động hôm nay</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Doanh thu hôm nay</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">130.5M đ</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% so với hôm qua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Số đơn hàng</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">24</div>
            <p className="text-xs text-gray-500">8 đơn chờ xác nhận</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Tồn kho</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">142</div>
            <p className="text-xs text-gray-500">Xe máy & phụ tùng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Cảnh báo</CardTitle>
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">5</div>
            <p className="text-xs text-orange-600">Sản phẩm sắp hết hàng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} đ`} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} đ`} />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo tồn kho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Lốp Michelin 80/90-17', current: 5, min: 10 },
              { name: 'Nhớt Motul 7100 1L', current: 8, min: 15 },
              { name: 'Phanh ABS Honda', current: 3, min: 8 },
              { name: 'Yên xe Yamaha Exciter', current: 4, min: 10 },
              { name: 'Gương chiếu hậu', current: 6, min: 12 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">Tồn kho: {item.current} / Tối thiểu: {item.min}</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
