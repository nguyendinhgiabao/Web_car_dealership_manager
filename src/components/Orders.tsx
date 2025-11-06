import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Eye, Edit, X, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { UserRole } from '../App';
import { hasPermission } from '../lib/permissions';
import { PermissionButton } from './PermissionGuard';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
  gift?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    items: [
      { name: 'Honda Wave Alpha', quantity: 1, price: 18500000 },
      { name: 'Mũ bảo hiểm', quantity: 1, price: 0 },
    ],
    total: 18500000,
    status: 'pending',
    createdAt: '2024-11-06 09:30',
    createdBy: 'Nhân viên A',
    gift: 'Mũ bảo hiểm fullface',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Trần Thị B',
    customerPhone: '0912345678',
    items: [
      { name: 'Yamaha Exciter 155', quantity: 1, price: 47000000 },
      { name: 'Bộ dụng cụ sửa chữa', quantity: 1, price: 0 },
    ],
    total: 47000000,
    status: 'confirmed',
    createdAt: '2024-11-06 10:15',
    createdBy: 'Nhân viên B',
    gift: 'Bộ dụng cụ sửa chữa',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Lê Văn C',
    customerPhone: '0923456789',
    items: [
      { name: 'Lốp Michelin', quantity: 4, price: 350000 },
      { name: 'Nhớt Motul', quantity: 2, price: 180000 },
    ],
    total: 1760000,
    status: 'completed',
    createdAt: '2024-11-05 14:20',
    createdBy: 'Nhân viên A',
  },
];

interface OrdersProps {
  userRole: UserRole;
}

export function Orders({ userRole }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm)
  );

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], { label: string; variant: any }> = {
      pending: { label: 'Chờ xác nhận', variant: 'default' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' },
      completed: { label: 'Hoàn thành', variant: 'default' },
      cancelled: { label: 'Đã hủy', variant: 'secondary' },
    };
    const { label, variant } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const cancelOrder = (orderId: string) => {
    if (!hasPermission(userRole, 'orders.cancel')) {
      toast.error('Bạn không có quyền hủy đơn hàng');
      return;
    }
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      ));
      toast.success('Đã hủy đơn hàng');
    }
  };

  const confirmPayment = (orderId: string) => {
    if (!hasPermission(userRole, 'orders.confirm_payment')) {
      toast.error('Bạn không có quyền xác nhận thanh toán');
      return;
    }
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: 'completed' as const } : o
    ));
    toast.success('Đã xác nhận thanh toán');
    setIsDetailDialogOpen(false);
  };

  const canEdit = userRole === 'manager' || userRole === 'sales';
  const canConfirm = userRole === 'manager' || userRole === 'accountant';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-500">Danh sách đơn hàng và hóa đơn</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="text-blue-600">{order.orderNumber}</TableCell>
                <TableCell className="text-gray-900">{order.customerName}</TableCell>
                <TableCell className="text-gray-600">{order.customerPhone}</TableCell>
                <TableCell className="text-gray-900">
                  {order.total.toLocaleString('vi-VN')} đ
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-gray-600">{order.createdAt}</TableCell>
                <TableCell className="text-gray-600">{order.createdBy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewOrderDetail(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {order.status === 'pending' && (
                      <PermissionButton userRole={userRole} permission="orders.cancel">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </PermissionButton>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            <DialogDescription>
              Mã đơn: {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Khách hàng</div>
                  <div className="text-gray-900">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
                  <div className="text-gray-900">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Ngày tạo</div>
                  <div className="text-gray-900">{selectedOrder.createdAt}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Nhân viên</div>
                  <div className="text-gray-900">{selectedOrder.createdBy}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-3">Sản phẩm</div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">Số lượng: {item.quantity}</div>
                      </div>
                      <div className="text-gray-900">
                        {item.price > 0 ? `${item.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.gift && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700 mb-1">Quà tặng</div>
                  <div className="text-green-900">{selectedOrder.gift}</div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-900">Tổng cộng:</span>
                  <span className="text-xl text-blue-600">
                    {selectedOrder.total.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">Trạng thái:</div>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
            <PermissionButton userRole={userRole} permission="orders.print_invoice">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                In hóa đơn
              </Button>
            </PermissionButton>
            {selectedOrder?.status === 'confirmed' && (
              <PermissionButton userRole={userRole} permission="orders.confirm_payment">
                <Button onClick={() => confirmPayment(selectedOrder.id)}>
                  Xác nhận thanh toán
                </Button>
              </PermissionButton>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}