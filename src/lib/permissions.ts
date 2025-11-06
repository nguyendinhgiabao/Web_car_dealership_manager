import { UserRole } from '../App';

// Định nghĩa các quyền trong hệ thống
export type Permission =
  // Products
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'products.export'
  
  // POS/Sales
  | 'pos.access'
  | 'pos.create_order'
  | 'pos.edit_order'
  | 'pos.cancel_order'
  | 'pos.apply_discount'
  
  // Orders
  | 'orders.view'
  | 'orders.view_all'
  | 'orders.edit'
  | 'orders.cancel'
  | 'orders.confirm_payment'
  | 'orders.print_invoice'
  
  // Customers
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  | 'customers.export'
  | 'customers.view_history'
  
  // Inventory
  | 'inventory.view'
  | 'inventory.stock_in'
  | 'inventory.stock_out'
  | 'inventory.adjust'
  | 'inventory.export'
  
  // Promotions
  | 'promotions.view'
  | 'promotions.create'
  | 'promotions.edit'
  | 'promotions.end'
  | 'promotions.print'
  
  // Reports
  | 'reports.view'
  | 'reports.revenue'
  | 'reports.staff_performance'
  | 'reports.products'
  | 'reports.export'
  
  // Staff
  | 'staff.view'
  | 'staff.create'
  | 'staff.edit'
  | 'staff.delete'
  | 'staff.manage_roles'
  
  // Settings
  | 'settings.view'
  | 'settings.edit';

// Ma trận phân quyền cho từng role
const rolePermissions: Record<UserRole, Permission[]> = {
  manager: [
    // Full access - tất cả quyền
    'products.view', 'products.create', 'products.edit', 'products.delete', 'products.export',
    'pos.access', 'pos.create_order', 'pos.edit_order', 'pos.cancel_order', 'pos.apply_discount',
    'orders.view', 'orders.view_all', 'orders.edit', 'orders.cancel', 'orders.confirm_payment', 'orders.print_invoice',
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete', 'customers.export', 'customers.view_history',
    'inventory.view', 'inventory.stock_in', 'inventory.stock_out', 'inventory.adjust', 'inventory.export',
    'promotions.view', 'promotions.create', 'promotions.edit', 'promotions.end', 'promotions.print',
    'reports.view', 'reports.revenue', 'reports.staff_performance', 'reports.products', 'reports.export',
    'staff.view', 'staff.create', 'staff.edit', 'staff.delete', 'staff.manage_roles',
    'settings.view', 'settings.edit',
  ],
  
  sales: [
    // Nhân viên bán hàng
    'products.view', 'products.export',
    'pos.access', 'pos.create_order', 'pos.edit_order',
    'orders.view', 'orders.print_invoice',
    'customers.view', 'customers.create', 'customers.edit', 'customers.view_history',
    'promotions.view', 'promotions.print',
  ],
  
  warehouse: [
    // Nhân viên kho
    'products.view', 'products.create', 'products.edit', 'products.export',
    'inventory.view', 'inventory.stock_in', 'inventory.stock_out', 'inventory.adjust', 'inventory.export',
    'orders.view',
  ],
  
  accountant: [
    // Kế toán
    'products.view',
    'orders.view', 'orders.view_all', 'orders.confirm_payment', 'orders.print_invoice',
    'customers.view', 'customers.export', 'customers.view_history',
    'inventory.view', 'inventory.export',
    'reports.view', 'reports.revenue', 'reports.staff_performance', 'reports.products', 'reports.export',
  ],
  
  cskh: [
    // Chăm sóc khách hàng
    'customers.view', 'customers.create', 'customers.edit', 'customers.view_history',
    'orders.view', 'orders.print_invoice',
    'promotions.view',
  ],
};

// Kiểm tra quyền của user
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false;
}

// Kiểm tra nhiều quyền cùng lúc (AND - cần có tất cả)
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Kiểm tra nhiều quyền cùng lúc (OR - chỉ cần 1)
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Lấy tất cả quyền của một role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return rolePermissions[userRole] || [];
}

// Mô tả chi tiết các quyền (cho UI)
export const permissionDescriptions: Record<Permission, string> = {
  'products.view': 'Xem danh sách sản phẩm',
  'products.create': 'Thêm sản phẩm mới',
  'products.edit': 'Chỉnh sửa sản phẩm',
  'products.delete': 'Xóa sản phẩm',
  'products.export': 'Xuất danh sách sản phẩm',
  
  'pos.access': 'Truy cập màn hình POS',
  'pos.create_order': 'Tạo đơn hàng mới',
  'pos.edit_order': 'Chỉnh sửa đơn hàng',
  'pos.cancel_order': 'Hủy đơn hàng',
  'pos.apply_discount': 'Áp dụng giảm giá',
  
  'orders.view': 'Xem đơn hàng của mình',
  'orders.view_all': 'Xem tất cả đơn hàng',
  'orders.edit': 'Chỉnh sửa đơn hàng',
  'orders.cancel': 'Hủy đơn hàng',
  'orders.confirm_payment': 'Xác nhận thanh toán',
  'orders.print_invoice': 'In hóa đơn',
  
  'customers.view': 'Xem thông tin khách hàng',
  'customers.create': 'Thêm khách hàng mới',
  'customers.edit': 'Chỉnh sửa thông tin khách hàng',
  'customers.delete': 'Xóa khách hàng',
  'customers.export': 'Xuất danh sách khách hàng',
  'customers.view_history': 'Xem lịch sử mua hàng',
  
  'inventory.view': 'Xem tồn kho',
  'inventory.stock_in': 'Nhập hàng',
  'inventory.stock_out': 'Xuất hàng',
  'inventory.adjust': 'Điều chỉnh tồn kho',
  'inventory.export': 'Xuất báo cáo tồn kho',
  
  'promotions.view': 'Xem chương trình khuyến mãi',
  'promotions.create': 'Tạo chương trình khuyến mãi',
  'promotions.edit': 'Chỉnh sửa chương trình',
  'promotions.end': 'Kết thúc chương trình',
  'promotions.print': 'In danh sách khuyến mãi',
  
  'reports.view': 'Xem báo cáo',
  'reports.revenue': 'Xem báo cáo doanh thu',
  'reports.staff_performance': 'Xem hiệu suất nhân viên',
  'reports.products': 'Xem báo cáo sản phẩm',
  'reports.export': 'Xuất báo cáo',
  
  'staff.view': 'Xem danh sách nhân viên',
  'staff.create': 'Thêm nhân viên mới',
  'staff.edit': 'Chỉnh sửa thông tin nhân viên',
  'staff.delete': 'Xóa nhân viên',
  'staff.manage_roles': 'Quản lý phân quyền',
  
  'settings.view': 'Xem cài đặt hệ thống',
  'settings.edit': 'Chỉnh sửa cài đặt',
};
