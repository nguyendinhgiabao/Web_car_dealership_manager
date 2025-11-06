import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { UserRole } from '../App';

interface ReportsProps {
  userRole: UserRole;
}

const monthlyRevenueData = [
  { month: 'T1', revenue: 850000000, orders: 42 },
  { month: 'T2', revenue: 920000000, orders: 48 },
  { month: 'T3', revenue: 780000000, orders: 38 },
  { month: 'T4', revenue: 1050000000, orders: 52 },
  { month: 'T5', revenue: 980000000, orders: 45 },
  { month: 'T6', revenue: 1120000000, orders: 58 },
  { month: 'T7', revenue: 890000000, orders: 41 },
  { month: 'T8', revenue: 1200000000, orders: 62 },
  { month: 'T9', revenue: 1050000000, orders: 51 },
  { month: 'T10', revenue: 1180000000, orders: 59 },
  { month: 'T11', revenue: 980000000, orders: 48 },
];

const staffPerformanceData = [
  { name: 'Nhân viên A', revenue: 280000000, orders: 15 },
  { name: 'Nhân viên B', revenue: 320000000, orders: 18 },
  { name: 'Nhân viên C', revenue: 190000000, orders: 10 },
  { name: 'Nhân viên D', revenue: 250000000, orders: 13 },
  { name: 'Nhân viên E', revenue: 210000000, orders: 11 },
];

const topProducts = [
  { name: 'Honda Vision 2024', sold: 45, revenue: 1350000000 },
  { name: 'Yamaha Exciter 155', sold: 38, revenue: 1786000000 },
  { name: 'Honda Wave Alpha', sold: 52, revenue: 962000000 },
  { name: 'Yamaha Sirius', sold: 30, revenue: 540000000 },
  { name: 'Honda Air Blade', sold: 25, revenue: 1050000000 },
];

export function Reports({ userRole }: ReportsProps) {
  const [startDate, setStartDate] = useState('2024-11-01');
  const [endDate, setEndDate] = useState('2024-11-30');

  const exportReport = () => {
    toast.success('Đang xuất báo cáo Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Báo cáo & Phân tích</h1>
          <p className="text-gray-500">Thống kê doanh thu và hiệu suất</p>
        </div>
        <Button onClick={exportReport}>
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Khoảng thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Từ ngày</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Đến ngày</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Doanh thu tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">980M đ</div>
            <p className="text-xs text-green-600">+8.5% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Số đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">48</div>
            <p className="text-xs text-green-600">+12.3% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Giá trị đơn TB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-gray-900 mb-1">20.4M đ</div>
            <p className="text-xs text-blue-600">Ổn định</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} đ`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Doanh thu" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} đ`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-blue-600">#{idx + 1}</span>
                    </div>
                    <div>
                      <div className="text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Đã bán: {product.sold} xe
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600">
                      {product.revenue.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Số đơn hàng theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#10b981" name="Số đơn" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
