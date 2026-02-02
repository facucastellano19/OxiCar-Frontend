import { Navigate, Route, Routes } from "react-router-dom"
import { PrivateRoutes, PublicRoutes } from "../models"
import { AuthGuard } from "../guards/auth.guards"
import { Home } from "../pages/Home/Home"
import { Login } from "../pages/Login/Login"

export const AppRouter = () => {
    return (
        <Routes>
            {/* Agregamos el "/" antes de las constantes para forzar rutas absolutas al navegar */}
            <Route path="/" element={<Navigate to={`/${PrivateRoutes.HOME}`} />} />
            
            <Route path={PublicRoutes.LOGIN} element={<Login />} />

            <Route element={<AuthGuard />}>
                <Route path={PrivateRoutes.HOME} element={<Home />} />
            </Route>

            {/* Si se pierde, lo mandamos al login de forma absoluta */}
            <Route path="*" element={<Navigate to={`/${PublicRoutes.LOGIN}`} />} />      
        </Routes>
    )
}