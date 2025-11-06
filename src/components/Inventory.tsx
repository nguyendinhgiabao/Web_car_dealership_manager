import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, AlertTriangle, Download } from 'lucide-react';
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
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import { UserRole } from '../App';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minThreshold: number;
  lastUpdated: string;
  category: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Honda Wave Alpha', sku: 'HW-ALPHA', currentStock: 12, minThreshold: 5, lastUpdated: '2024-11-06', category: 'Xe máy' },
  { id: '2', name: 'Yamaha Exciter 155', sku: 'YM-EX-155', currentStock: 8, minThreshold: 5, lastUpdated: '2024-11-06', category: 'Xe máy' },
  { id: '3', name: 'Lốp Michelin 80/90-17', sku: 'TIRE-MCH-01', currentStock: 5, minThreshold: 10, lastUpdated: '2024-11-05', category: 'Phụ tùng' },
  { id: '4', name: 'Nhớt Motul 7100 1L', sku: 'OIL-MTL-01', currentStock: 8, minThreshold: 15, lastUpdated: '2024-11-05', category: 'Phụ tùng' },
  { id: '5', name: 'Phanh ABS Honda', sku: 'BRAKE-HN-01', currentStock: 3, minThreshold: 8, lastUpdated: '2024-11-04', category: 'Phụ tùng' },
];

interface InventoryProps {
  userRole: UserRole;
}

export function Inventory({ userRole }: InventoryProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);
  const [isStockOutDialogOpen, setIsStockOutDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const lowStockItems = inventory.filter(item => item.currentStock < item.minThreshold);

  const handleStockIn = () => {
    const item = inventory.find(i => i.id === selectedItem);
    if (!item || !quantity) return;

    setInventory(inventory.map(i =>
      i.id === selectedItem
        ? { ...i, currentStock: i.currentStock + parseInt(quantity), lastUpdated: new Date().toISOString().split('T')[0] }
        : i
    ));
    setIsStockInDialogOpen(false);
    setSelectedItem('');
    setQuantity('');
    setNote('');
    toast.success('Đã ghi nhận nhập hàng');
  };

  const handleStockOut = () => {
    const item = inventory.find(i => i.id === selectedItem);
    if (!item || !quantity) return;

    const newStock = item.currentStock - parseInt(quantity);
    if (newStock < 0) {
      toast.error('Số lượng xuất vượt quá tồn kho');
      return;
    }

    setInventory(inventory.map(i =>
      i.id === selectedItem
        ? { ...i, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
        : i
    ));
    setIsStockOutDialogOpen(false);
    setSelectedItem('');
    setQuantity('');
    setNote('');
    toast.success('Đã ghi nhận xuất hàng');
  };

  const canManage = userRole === 'manager' || userRole === 'warehouse';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý tồn kho</h1>
          <p className="text-gray-500">Nhập xuất và cảnh báo tồn kho</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsStockOutDialogOpen(true)}>
              Xuất hàng
            </Button>
            <Button onClick={() => setIsStockInDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nhập hàng
            </Button>
          </div>
        )}
      </div>

      {lowStockItems.length > 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-orange-900">Cảnh báo: {lowStockItems.length} sản phẩm sắp hết hàng</span>
          </div>
          <div className="text-sm text-orange-700">
            {lowStockItems.map(item => item.name).join(', ')}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Mã SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Ngưỡng tối thiểu</TableHead>
              <TableHead>Cập nhật lần cuối</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.sku}</TableCell>
                <TableCell className="text-gray-600">{item.category}</TableCell>
                <TableCell>
                  <span className={item.currentStock < item.minThreshold ? 'text-orange-600' : 'text-gray-900'}>
                    {item.currentStock}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">{item.minThreshold}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(item.lastUpdated).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  {item.currentStock < item.minThreshold ? (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Cần nhập thêm
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      Đủ hàng
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stock In Dialog */}
      <Dialog open={isStockInDialogOpen} onOpenChange={setIsStockInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập hàng</DialogTitle>
            <DialogDescription>
              Ghi nhận hàng hóa nhập kho
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sản phẩm</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (Tồn: {item.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số lượng nhập</Label>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Nhà cung cấp, số phiếu nhập..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockInDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleStockIn}>Xác nhận nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Out Dialog */}
      <Dialog open={isStockOutDialogOpen} onOpenChange={setIsStockOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xuất hàng</DialogTitle>
            <DialogDescription>
              Ghi nhận hàng hóa xuất kho
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Sản phẩm</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (Tồn: {item.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số lượng xuất</Label>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Input
                placeholder="Lý do xuất, người nhận..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockOutDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleStockOut}>Xác nhận xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
