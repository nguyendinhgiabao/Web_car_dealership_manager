import { ReactNode } from 'react';
import { UserRole } from '../App';
import { Permission, hasPermission } from '../lib/permissions';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  userRole: UserRole;
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export function PermissionGuard({
  userRole,
  permission,
  children,
  fallback = null,
  showMessage = false,
}: PermissionGuardProps) {
  if (!hasPermission(userRole, permission)) {
    if (showMessage) {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">Không có quyền truy cập</h3>
            <p className="text-gray-500">Bạn không có quyền sử dụng chức năng này</p>
          </div>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Component wrapper cho button với permission check
interface PermissionButtonProps {
  userRole: UserRole;
  permission: Permission;
  children: ReactNode;
}

export function PermissionButton({ userRole, permission, children }: PermissionButtonProps) {
  if (!hasPermission(userRole, permission)) {
    return null;
  }
  return <>{children}</>;
}
