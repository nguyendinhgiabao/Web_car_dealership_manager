import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
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

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockStaff: StaffMember[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nva@company.com', phone: '0901111111', role: 'sales', status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Trần Thị B', email: 'ttb@company.com', phone: '0902222222', role: 'sales', status: 'active', joinDate: '2024-02-01' },
  { id: '3', name: 'Lê Văn C', email: 'lvc@company.com', phone: '0903333333', role: 'warehouse', status: 'active', joinDate: '2024-01-20' },
  { id: '4', name: 'Phạm Thị D', email: 'ptd@company.com', phone: '0904444444', role: 'accountant', status: 'active', joinDate: '2024-03-10' },
  { id: '5', name: 'Hoàng Văn E', email: 'hve@company.com', phone: '0905555555', role: 'cskh', status: 'active', joinDate: '2024-04-05' },
];

interface StaffProps {
  userRole: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  manager: 'Quản lý',
  sales: 'Nhân viên bán hàng',
  warehouse: 'Nhân viên kho',
  accountant: 'Kế toán',
  cskh: 'CSKH',
};

export function Staff({ userRole }: StaffProps) {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales' as UserRole,
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleAddStaff = () => {
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setStaff([...staff, newStaff]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Đã thêm nhân viên mới');
  };

  const handleEditStaff = () => {
    if (!selectedStaff) return;
    setStaff(staff.map(s =>
      s.id === selectedStaff.id
        ? { ...s, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role }
        : s
    ));
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
    resetForm();
    toast.success('Đã cập nhật thông tin nhân viên');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      setStaff(staff.filter(s => s.id !== id));
      toast.success('Đã xóa nhân viên');
    }
  };

  const openEditDialog = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'sales',
    });
  };

  if (userRole !== 'manager') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl text-gray-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-500">Chỉ Quản lý mới có quyền xem trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Quản lý nhân viên</h1>
          <p className="text-gray-500">Danh sách nhân viên và phân quyền</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="text-gray-900">{member.name}</TableCell>
                <TableCell className="text-gray-600">{member.email}</TableCell>
                <TableCell className="text-gray-600">{member.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{roleLabels[member.role]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin nhân viên và phân quyền
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Họ tên</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                  <SelectItem value="warehouse">Nhân viên kho</SelectItem>
                  <SelectItem value="accountant">Kế toán</SelectItem>
                  <SelectItem value="cskh">CSKH</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddStaff}>Thêm nhân viên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và phân quyền
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Họ tên</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                  <SelectItem value="warehouse">Nhân viên kho</SelectItem>
                  <SelectItem value="accountant">Kế toán</SelectItem>
                  <SelectItem value="cskh">CSKH</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditStaff}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
