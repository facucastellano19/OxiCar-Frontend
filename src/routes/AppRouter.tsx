import { Navigate, Route, Routes } from "react-router-dom"
import { PrivateRoutes, PublicRoutes } from "../models"
import { AuthGuard } from "../guards/auth.guards"
import { MainLayout } from "../components/"
import {Services, Home, Login, Clients, Products, Employees, Sales, Metrics} from "../pages/"


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
      <Route path={PrivateRoutes.EMPLOYEES} element={<Employees />} />   
      <Route path={PrivateRoutes.SALES} element={<Sales />} />    
      <Route path={PrivateRoutes.METRICS} element={<Metrics />} />
      
    </Route>
  </Route>

  <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    )
}