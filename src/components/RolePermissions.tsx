import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { UserRole } from '../App';
import { getRolePermissions, permissionDescriptions } from '../lib/permissions';
import { Shield, Check } from 'lucide-react';

interface RolePermissionsProps {
  userRole: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  manager: 'Quản lý',
  sales: 'Nhân viên bán hàng',
  warehouse: 'Nhân viên kho',
  accountant: 'Kế toán',
  cskh: 'CSKH',
};

const roleColors: Record<UserRole, string> = {
  manager: 'bg-purple-100 text-purple-700',
  sales: 'bg-blue-100 text-blue-700',
  warehouse: 'bg-green-100 text-green-700',
  accountant: 'bg-orange-100 text-orange-700',
  cskh: 'bg-pink-100 text-pink-700',
};

export function RolePermissions({ userRole }: RolePermissionsProps) {
  const permissions = getRolePermissions(userRole);

  // Group permissions by category
  const groupedPermissions: Record<string, typeof permissions> = {};
  permissions.forEach(permission => {
    const category = permission.split('.')[0];
    if (!groupedPermissions[category]) {
      groupedPermissions[category] = [];
    }
    groupedPermissions[category].push(permission);
  });

  const categoryLabels: Record<string, string> = {
    products: 'Sản phẩm',
    pos: 'POS/Bán hàng',
    orders: 'Đơn hàng',
    customers: 'Khách hàng',
    inventory: 'Tồn kho',
    promotions: 'Khuyến mãi',
    reports: 'Báo cáo',
    staff: 'Nhân viên',
    settings: 'Cài đặt',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Phân quyền hệ thống</h1>
          <p className="text-gray-500">Quyền hạn và chức năng theo vai trò</p>
        </div>
        <Badge className={roleColors[userRole]}>
          <Shield className="w-3 h-3 mr-1" />
          {roleLabels[userRole]}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quyền hạn của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-900 mb-3">{categoryLabels[category]}</div>
                <div className="space-y-2">
                  {perms.map(permission => (
                    <div key={permission} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{permissionDescriptions[permission]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả vai trò trong hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(roleLabels) as UserRole[]).map(role => {
              const rolePerms = getRolePermissions(role);
              return (
                <div key={role} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={roleColors[role]}>{roleLabels[role]}</Badge>
                    <span className="text-sm text-gray-500">{rolePerms.length} quyền</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(categoryLabels).map(([category, label]) => {
                      const categoryPerms = rolePerms.filter(p => p.startsWith(category));
                      if (categoryPerms.length === 0) return null;
                      return (
                        <div key={category} className="text-xs text-gray-600">
                          • {label}: {categoryPerms.length} quyền
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
