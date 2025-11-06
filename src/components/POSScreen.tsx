import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Minus, Trash2, User, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
}

const products: Product[] = [
  { id: '1', name: 'Honda Wave Alpha', price: 18500000, category: 'Xe máy' },
  { id: '2', name: 'Yamaha Exciter 155', price: 47000000, category: 'Xe máy' },
  { id: '3', name: 'Honda Vision', price: 30000000, category: 'Xe máy' },
  { id: '4', name: 'Lốp Michelin', price: 350000, category: 'Phụ tùng' },
  { id: '5', name: 'Nhớt Motul 7100', price: 180000, category: 'Phụ tùng' },
  { id: '6', name: 'Phanh ABS', price: 1200000, category: 'Phụ tùng' },
];

const mockCustomers: Customer[] = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0901234567', totalSpent: 25000000 },
  { id: '2', name: 'Trần Thị B', phone: '0912345678', totalSpent: 48000000 },
  { id: '3', name: 'Lê Văn C', phone: '0923456789', totalSpent: 15000000 },
];

const availableGifts = [
  { id: '1', name: 'Mũ bảo hiểm fullface', minOrderValue: 20000000 },
  { id: '2', name: 'Áo mưa cao cấp', minOrderValue: 10000000 },
  { id: '3', name: 'Bộ dụng cụ sửa chữa', minOrderValue: 30000000 },
];

export function POSScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const eligibleGifts = availableGifts.filter(gift => subtotal >= gift.minOrderValue);

  const searchCustomer = () => {
    const customer = mockCustomers.find(c => c.phone === customerPhone);
    if (customer) {
      setSelectedCustomer(customer);
      setIsCustomerDialogOpen(false);
      toast.success(`Đã chọn khách hàng: ${customer.name}`);
    } else {
      toast.error('Không tìm thấy khách hàng');
    }
  };

  const addNewCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      totalSpent: 0,
    };
    setSelectedCustomer(customer);
    setIsAddCustomerDialogOpen(false);
    setNewCustomer({ name: '', phone: '' });
    toast.success('Đã thêm khách hàng mới');
  };

  const createOrder = () => {
    if (cart.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    if (!selectedCustomer) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }
    toast.success('Đã tạo đơn hàng thành công');
    setCart([]);
    setSelectedCustomer(null);
    setSelectedGift(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel - Products */}
      <div className="col-span-5 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-gray-900 mb-4">Sản phẩm</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredProducts.map(product => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{product.name}</div>
                    <Badge variant="outline" className="mb-2">{product.category}</Badge>
                    <div className="text-blue-600">{product.price.toLocaleString('vi-VN')} đ</div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Middle Panel - Cart */}
      <div className="col-span-4 flex flex-col bg-white rounded-lg border border-gray-200 p-4">
        <div className="mb-4">
          <h2 className="text-gray-900">Giỏ hàng</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm mb-1">{item.name}</div>
                    <div className="text-gray-600 text-sm">
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <div className="ml-auto text-blue-600">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-900">Tổng cộng:</span>
            <span className="text-blue-600">{subtotal.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Customer & Payment */}
      <div className="col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedCustomer ? (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{selectedCustomer.name}</span>
                </div>
                <div className="text-sm text-gray-600">{selectedCustomer.phone}</div>
                <div className="text-sm text-gray-600">
                  Tổng chi tiêu: {selectedCustomer.totalSpent.toLocaleString('vi-VN')} đ
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Đổi khách hàng
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCustomerDialogOpen(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tìm khách hàng
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsAddCustomerDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm khách hàng mới
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quà tặng</CardTitle>
          </CardHeader>
          <CardContent>
            {eligibleGifts.length > 0 ? (
              <div className="space-y-2">
                {eligibleGifts.map(gift => (
                  <label
                    key={gift.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gift"
                      value={gift.id}
                      checked={selectedGift === gift.id}
                      onChange={() => setSelectedGift(gift.id)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{gift.name}</div>
                      <div className="text-xs text-gray-500">
                        Đơn từ {gift.minOrderValue.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Không có quà tặng khả dụng
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full"
          onClick={createOrder}
          disabled={cart.length === 0 || !selectedCustomer}
        >
          Tạo đơn hàng
        </Button>
      </div>

      {/* Customer Search Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tìm khách hàng</DialogTitle>
            <DialogDescription>
              Nhập số điện thoại để tìm kiếm
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                placeholder="0901234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={searchCustomer}>Tìm kiếm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm khách hàng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin khách hàng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên khách hàng</Label>
              <Input
                placeholder="Nguyễn Văn A"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                placeholder="0901234567"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={addNewCustomer}>Thêm khách hàng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
