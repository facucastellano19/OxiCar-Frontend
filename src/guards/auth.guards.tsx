import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/user.store';
import { PublicRoutes } from '../models/routes';

export const AuthGuard = () => {
  const isLogged = useUserStore((state) => state.isLogged);

  return isLogged ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />;
};