import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Printer, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { UserRole } from '../App';

interface Promotion {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
  minOrderValue: number;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Tặng mũ bảo hiểm fullface',
    description: 'Áp dụng cho đơn hàng từ 20 triệu đồng',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    status: 'active',
    minOrderValue: 20000000,
  },
  {
    id: '2',
    name: 'Áo mưa cao cấp',
    description: 'Áp dụng cho đơn hàng từ 10 triệu đồng',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    status: 'active',
    minOrderValue: 10000000,
  },
  {
    id: '3',
    name: 'Bộ dụng cụ sửa chữa',
    description: 'Áp dụng cho đơn hàng từ 30 triệu đồng',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    status: 'expired',
    minOrderValue: 30000000,
  },
];

interface PromotionsProps {
  userRole: UserRole;
}

export function Promotions({ userRole }: PromotionsProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    minOrderValue: '',
  });

  const activePromotions = promotions.filter(p => p.status === 'active');
  const expiredPromotions = promotions.filter(p => p.status === 'expired');

  const handleAddPromotion = () => {
    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'active',
      minOrderValue: parseFloat(formData.minOrderValue),
    };
    setPromotions([...promotions, newPromotion]);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      minOrderValue: '',
    });
    toast.success('Đã thêm chương trình khuyến mãi');
  };

  const endPromotion = (id: string) => {
    if (confirm('Bạn có chắc muốn kết thúc chương trình này?')) {
      setPromotions(promotions.map(p =>
        p.id === id ? { ...p, status: 'expired' as const } : p
      ));
      toast.success('Đã kết thúc chương trình khuyến mãi');
    }
  };

  const printPromotions = () => {
    window.print();
    toast.success('Đang in danh sách khuyến mãi...');
  };

  const canManage = userRole === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý khuyến mãi</h1>
          <p className="text-gray-500">Quà tặng và chương trình ưu đãi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={printPromotions}>
            <Printer className="w-4 h-4 mr-2" />
            In danh sách
          </Button>
          {canManage && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm khuyến mãi
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-gray-900 mb-4">Đang hoạt động</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePromotions.map(promo => (
            <Card key={promo.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{promo.name}</CardTitle>
                  <Badge variant="default">Đang áp dụng</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{promo.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(promo.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Đơn hàng tối thiểu: </span>
                  <span className="text-blue-600">
                    {promo.minOrderValue.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => endPromotion(promo.id)}
                  >
                    Kết thúc chương trình
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {expiredPromotions.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Đã kết thúc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredPromotions.map(promo => (
              <Card key={promo.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{promo.name}</CardTitle>
                    <Badge variant="secondary">Đã kết thúc</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{promo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(promo.startDate).toLocaleDateString('vi-VN')} -{' '}
                      {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm chương trình khuyến mãi</DialogTitle>
            <DialogDescription>
              Nhập thông tin chương trình khuyến mãi mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promo-name">Tên chương trình</Label>
              <Input
                id="promo-name"
                placeholder="Ví dụ: Tặng mũ bảo hiểm cao cấp"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-desc">Mô tả</Label>
              <Textarea
                id="promo-desc"
                placeholder="Mô tả chi tiết về chương trình"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Ngày bắt đầu</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Ngày kết thúc</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-value">Giá trị đơn hàng tối thiểu (VNĐ)</Label>
              <Input
                id="min-value"
                type="number"
                placeholder="20000000"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddPromotion}>Thêm chương trình</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
