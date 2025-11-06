import { useState } from 'react';
import { Search, Filter, Printer, CheckCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface Invoice {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  items: string[];
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    orderNumber: 'HD-001',
    customerName: 'Nguyễn Văn A',
    date: '2024-11-06',
    total: 30000000,
    status: 'paid',
    items: ['Honda Wave Alpha'],
  },
  {
    id: '2',
    orderNumber: 'HD-002',
    customerName: 'Trần Thị B',
    date: '2024-11-06',
    total: 56000000,
    status: 'pending',
    items: ['Yamaha Exciter 155'],
  },
  {
    id: '3',
    orderNumber: 'HD-003',
    customerName: 'Lê Văn C',
    date: '2024-11-05',
    total: 35000000,
    status: 'paid',
    items: ['Honda Vision'],
  },
  {
    id: '4',
    orderNumber: 'HD-004',
    customerName: 'Phạm Thị D',
    date: '2024-11-05',
    total: 42000000,
    status: 'pending',
    items: ['Honda Air Blade'],
  },
];

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmPayment = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, status: 'paid' as const } : inv
    ));
    toast.success('Xác nhận thanh toán thành công');
  };

  const handlePrint = (invoice: Invoice) => {
    toast.success(`Đang in hóa đơn ${invoice.orderNumber}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Quản lý hóa đơn</h2>
          <p className="text-gray-500">Danh sách hóa đơn và thanh toán</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo mã hóa đơn hoặc tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Lọc theo ngày
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Lọc
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-500">Mã HĐ</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500">Khách hàng</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500">Ngày</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500">Sản phẩm</th>
                <th className="text-right py-3 px-4 text-sm text-gray-500">Tổng tiền</th>
                <th className="text-left py-3 px-4 text-sm text-gray-500">Trạng thái</th>
                <th className="text-right py-3 px-4 text-sm text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-blue-600">{invoice.orderNumber}</td>
                  <td className="py-4 px-4 text-gray-900">{invoice.customerName}</td>
                  <td className="py-4 px-4 text-gray-600">{invoice.date}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {invoice.items.map((item, i) => (
                      <div key={i} className="text-sm">{item}</div>
                    ))}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">{formatPrice(invoice.total)}</td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-green-600"
                          onClick={() => handleConfirmPayment(invoice.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Xác nhận TT
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => handlePrint(invoice)}
                      >
                        <Printer className="w-4 h-4" />
                        In
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
