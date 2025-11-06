import { useState } from 'react';
import { Search, Plus, Minus, Trash2, User, Gift as GiftIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
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

interface Gift {
  id: string;
  name: string;
  active: boolean;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Honda Wave Alpha', price: 30000000, stock: 12 },
  { id: '2', name: 'Yamaha Exciter 155', price: 56000000, stock: 8 },
  { id: '3', name: 'Honda Vision', price: 35000000, stock: 15 },
  { id: '4', name: 'Honda Air Blade', price: 42000000, stock: 10 },
];

const mockGifts: Gift[] = [
  { id: '1', name: 'Mũ bảo hiểm cao cấp', active: true },
  { id: '2', name: 'Áo mưa Honda chính hãng', active: true },
  { id: '3', name: 'Bộ dụng cụ sửa chữa', active: true },
];

export function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        toast.error('Không đủ hàng trong kho');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return item;
        if (newQuantity > item.stock) {
          toast.error('Không đủ hàng trong kho');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const searchCustomer = () => {
    // Mock customer search
    if (customerPhone) {
      const mockCustomer: Customer = {
        id: '1',
        name: 'Nguyễn Văn B',
        phone: customerPhone,
        totalSpent: 85000000,
      };
      setSelectedCustomer(mockCustomer);
      toast.success('Tìm thấy khách hàng');
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
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '' });
    toast.success('Thêm khách hàng thành công');
  };

  const createOrder = () => {
    if (cart.length === 0) {
      toast.error('Vui lòng thêm sản phẩm vào giỏ hàng');
      return;
    }
    if (!selectedCustomer) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }
    toast.success('Tạo đơn hàng thành công');
    // Reset
    setCart([]);
    setSelectedCustomer(null);
    setSelectedGift(null);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>POS - Bán hàng</h2>
        <p className="text-gray-500">Tạo đơn hàng nhanh</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Product Selection */}
        <Card className="p-6 col-span-2">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">Tồn: {product.stock}</p>
                  </div>
                </div>
                <p className="text-blue-600">{formatPrice(product.price)}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Cart & Checkout */}
        <Card className="p-6">
          <h3 className="mb-4">Giỏ hàng</h3>

          {/* Customer Selection */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm">Khách hàng</Label>
            {selectedCustomer ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-gray-900">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                  Đổi
                </Button>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Số điện thoại"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  <Button onClick={searchCustomer} size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Thêm khách hàng mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm khách hàng mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Họ tên</Label>
                        <Input
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <Label>Số điện thoại</Label>
                        <Input
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          placeholder="0912345678"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
                        Hủy
                      </Button>
                      <Button onClick={addNewCustomer}>Thêm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Chưa có sản phẩm</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-900 flex-1">{item.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Gift Selection */}
          {cart.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <Label className="text-sm flex items-center gap-2">
                <GiftIcon className="w-4 h-4 text-green-600" />
                Quà tặng kèm theo
              </Label>
              <div className="mt-2 space-y-2">
                {mockGifts.filter(g => g.active).map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`w-full p-2 text-sm text-left rounded border transition-colors ${
                      selectedGift?.id === gift.id
                        ? 'bg-green-100 border-green-500'
                        : 'bg-white border-gray-200 hover:border-green-400'
                    }`}
                  >
                    {gift.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>

          <Button className="w-full mt-4" size="lg" onClick={createOrder}>
            Tạo đơn hàng
          </Button>
        </Card>
      </div>
    </div>
  );
}
