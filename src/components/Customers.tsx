import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Download, Eye, UserCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  orders: {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    items: string;
  }[];
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    totalSpent: 48500000,
    orderCount: 3,
    lastOrderDate: '2024-11-06',
    orders: [
      { id: '1', orderNumber: 'ORD-2024-001', date: '2024-11-06', total: 18500000, items: 'Honda Wave Alpha' },
      { id: '2', orderNumber: 'ORD-2024-015', date: '2024-10-15', total: 30000000, items: 'Honda Vision' },
    ],
  },
  {
    id: '2',
    name: 'Trần Thị B',
    phone: '0912345678',
    email: 'tranthib@email.com',
    totalSpent: 94000000,
    orderCount: 2,
    lastOrderDate: '2024-11-06',
    orders: [
      { id: '3', orderNumber: 'ORD-2024-002', date: '2024-11-06', total: 47000000, items: 'Yamaha Exciter 155' },
      { id: '4', orderNumber: 'ORD-2024-012', date: '2024-09-20', total: 47000000, items: 'Yamaha Exciter 155' },
    ],
  },
  {
    id: '3',
    name: 'Lê Văn C',
    phone: '0923456789',
    email: 'levanc@email.com',
    totalSpent: 15760000,
    orderCount: 5,
    lastOrderDate: '2024-11-05',
    orders: [
      { id: '5', orderNumber: 'ORD-2024-003', date: '2024-11-05', total: 1760000, items: 'Lốp Michelin, Nhớt Motul' },
      { id: '6', orderNumber: 'ORD-2024-020', date: '2024-10-28', total: 2000000, items: 'Phụ tùng đa dạng' },
    ],
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    phone: '0934567890',
    email: 'phamthid@email.com',
    totalSpent: 30000000,
    orderCount: 1,
    lastOrderDate: '2024-10-20',
    orders: [
      { id: '7', orderNumber: 'ORD-2024-018', date: '2024-10-20', total: 30000000, items: 'Honda Vision' },
    ],
  },
];

export function Customers() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewCustomerDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const exportToExcel = () => {
    toast.success('Đang xuất file Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý khách hàng</h1>
          <p className="text-gray-500">Danh sách và lịch sử mua hàng</p>
        </div>
        <Button variant="outline" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tổng chi tiêu</TableHead>
              <TableHead>Số đơn hàng</TableHead>
              <TableHead>Lần mua gần nhất</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-gray-900">{customer.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{customer.phone}</TableCell>
                <TableCell className="text-gray-600">{customer.email}</TableCell>
                <TableCell className="text-blue-600">
                  {customer.totalSpent.toLocaleString('vi-VN')} đ
                </TableCell>
                <TableCell className="text-gray-900">{customer.orderCount}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewCustomerDetail(customer)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>
              Thông tin và lịch sử mua hàng
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Tổng chi tiêu</div>
                  <div className="text-2xl text-blue-900">
                    {selectedCustomer.totalSpent.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Số đơn hàng</div>
                  <div className="text-2xl text-green-900">{selectedCustomer.orderCount}</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">Đơn trung bình</div>
                  <div className="text-2xl text-purple-900">
                    {(selectedCustomer.totalSpent / selectedCustomer.orderCount).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2">Thông tin liên hệ</div>
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="text-gray-900">{selectedCustomer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="text-gray-900">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{selectedCustomer.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3">Lịch sử mua hàng</div>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="text-blue-600 mb-1">{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">{order.items}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 mb-1">
                          {order.total.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
