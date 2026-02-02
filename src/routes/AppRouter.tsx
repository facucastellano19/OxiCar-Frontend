import { Navigate, Route, Routes } from "react-router-dom"
import { PrivateRoutes, PublicRoutes } from "../models"
import { AuthGuard } from "../guards/auth.guards"
import { Home } from "../pages/Home/Home"
import { Login } from "../pages/Login/Login"
import { MainLayout } from "../components/"

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={`/${PrivateRoutes.HOME}`} />} />
            <Route path={PublicRoutes.LOGIN} element={<Login />} />

  <Route element={<AuthGuard />}>
    <Route element={<MainLayout />}>
      <Route path={PrivateRoutes.HOME} element={<Home />} />
      
    </Route>
  </Route>

  <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    )
}