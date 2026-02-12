import { Navigate, Route, Routes } from "react-router-dom"
import { PrivateRoutes, PublicRoutes } from "../models"
import { AuthGuard } from "../guards/auth.guards"
import { MainLayout } from "../components/"
import {Services, Home, Login, Clients} from "../pages/"
import { Products } from "../pages/Products/Products"


export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to={`/${PrivateRoutes.HOME}`} />} />
            <Route path={PublicRoutes.LOGIN} element={<Login />} />

  <Route element={<AuthGuard />}>
    <Route element={<MainLayout />}>
      <Route path={PrivateRoutes.HOME} element={<Home />} />
      <Route path={PrivateRoutes.CLIENTS} element={<Clients />} />   
      <Route path={PrivateRoutes.SERVICES} element={<Services />} />  
      <Route path={PrivateRoutes.PRODUCTS} element={<Products />} />  
      
    </Route>
  </Route>

  <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    )
}