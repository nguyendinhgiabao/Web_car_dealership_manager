import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Filter, Download, Edit, Trash2 } from 'lucide-react';
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
import { hasPermission } from '../lib/permissions';
import { PermissionButton } from './PermissionGuard';

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Honda Wave Alpha 110cc',
    sku: 'HW-ALPHA-110',
    brand: 'Honda',
    price: 18500000,
    stock: 12,
    status: 'active',
    image: '/placeholder.jpg',
  },
  {
    id: '2',
    name: 'Yamaha Exciter 155',
    sku: 'YM-EX-155',
    brand: 'Yamaha',
    price: 47000000,
    stock: 8,
    status: 'active',
    image: '/placeholder.jpg',
  },
  {
    id: '3',
    name: 'Honda Vision 2024',
    sku: 'HV-2024',
    brand: 'Honda',
    price: 30000000,
    stock: 15,
    status: 'active',
    image: '/placeholder.jpg',
  },
  {
    id: '4',
    name: 'Yamaha Sirius',
    sku: 'YM-SIRIUS',
    brand: 'Yamaha',
    price: 18000000,
    stock: 10,
    status: 'active',
    image: '/placeholder.jpg',
  },
  {
    id: '5',
    name: 'Honda Air Blade 150',
    sku: 'HAB-150',
    brand: 'Honda',
    price: 42000000,
    stock: 6,
    status: 'active',
    image: '/placeholder.jpg',
  },
];

export function Products({ userRole }: { userRole: UserRole }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    price: '',
    stock: '',
    status: 'active' as 'active' | 'inactive',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!hasPermission(userRole, 'products.create')) {
      toast.error('Bạn không có quyền thêm sản phẩm');
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: formData.status,
      image: '/placeholder.jpg',
    };
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Đã thêm sản phẩm thành công');
  };

  const handleEditProduct = () => {
    if (!hasPermission(userRole, 'products.edit')) {
      toast.error('Bạn không có quyền chỉnh sửa sản phẩm');
      return;
    }
    if (!selectedProduct) return;
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? {
            ...p,
            name: formData.name,
            sku: formData.sku,
            brand: formData.brand,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            status: formData.status,
          }
        : p
    );
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    resetForm();
    toast.success('Đã cập nhật sản phẩm thành công');
  };

  const handleDelete = (id: string) => {
    if (!hasPermission(userRole, 'products.delete')) {
      toast.error('Bạn không có quyền xóa sản phẩm');
      return;
    }
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Đã xóa sản phẩm thành công');
    }
  };

  const openEditDialog = (product: Product) => {
    if (!hasPermission(userRole, 'products.edit')) {
      toast.error('Bạn không có quyền chỉnh sửa sản phẩm');
      return;
    }
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      brand: '',
      price: '',
      stock: '',
      status: 'active',
    });
  };

  const exportToExcel = () => {
    if (!hasPermission(userRole, 'products.export')) {
      toast.error('Bạn không có quyền xuất dữ liệu');
      return;
    }
    toast.success('Đang xuất file Excel...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý sản phẩm</h1>
          <p className="text-gray-500">Danh sách xe máy và phụ tùng</p>
        </div>
        <div className="flex gap-2">
          <PermissionButton userRole={userRole} permission="products.export">
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </PermissionButton>
          <PermissionButton userRole={userRole} permission="products.create">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </PermissionButton>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm, mã SKU, hãng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Mã SKU</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>Giá bán</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div>{product.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{product.sku}</TableCell>
                <TableCell className="text-gray-600">{product.brand}</TableCell>
                <TableCell className="text-gray-900">
                  {product.price.toLocaleString('vi-VN')} đ
                </TableCell>
                <TableCell>
                  <span className={product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <PermissionButton userRole={userRole} permission="products.edit">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </PermissionButton>
                    <PermissionButton userRole={userRole} permission="products.delete">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </PermissionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin sản phẩm bên dưới
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">Mã SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Hãng</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hãng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Yamaha">Yamaha</SelectItem>
                  <SelectItem value="Suzuki">Suzuki</SelectItem>
                  <SelectItem value="SYM">SYM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá bán (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin sản phẩm
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên sản phẩm</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sku">Mã SKU</Label>
              <Input
                id="edit-sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand">Hãng</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Yamaha">Yamaha</SelectItem>
                  <SelectItem value="Suzuki">Suzuki</SelectItem>
                  <SelectItem value="SYM">SYM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Giá bán (VNĐ)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Tồn kho</Label>
              <Input
                id="edit-stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditProduct}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}