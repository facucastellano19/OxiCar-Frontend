import React from 'react';
import { useUserStore } from '../../store/user.store';

interface Props {
  children: React.ReactNode;
  allowedRoles: number[]; 
}

export const PermissionGate = ({ children, allowedRoles }: Props) => {
    
  const userInfo = useUserStore((state) => state.userInfo);

  const hasPermission = userInfo?.role_id && allowedRoles.includes(userInfo.role_id);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};