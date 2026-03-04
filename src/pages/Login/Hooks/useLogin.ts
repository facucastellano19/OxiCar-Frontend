import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store";
import { useApi } from "../../../hooks";
import { loginCall } from "../../../services";
import { LoginSchema, PrivateRoutes, type LoginForm } from "../../../models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export const useLogin = () => {
  const isLogged = useUserStore((state) => state.isLogged);
  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { error, loading, fetch, data } = useApi(loginCall);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLogged) {
      navigate(`/${PrivateRoutes.HOME}`, { replace: true });
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (data?.token) {
      try {
        const decoded: any = jwtDecode(data.token);

        setUserInfo({
          ...data,
          role_id: decoded.role_id,
          id: decoded.id,
          username: decoded.username,
        });

        navigate(`/${PrivateRoutes.HOME}`, { replace: true });
      } catch (err) {
        toast.error("Error al procesar la información del usuario");
      }
    }
  }, [data, setUserInfo, navigate]);

  const onSubmit = (formData: LoginForm) => {
    fetch(formData);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    loading,
    apiError: error,
  };
};
