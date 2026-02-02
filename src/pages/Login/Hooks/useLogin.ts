import { useNavigate } from "react-router-dom"; 
import { useUserStore } from "../../../store";
import { useApi } from "../../../hooks";
import { loginCall } from "../../../services";
import { LoginSchema, PrivateRoutes, type LoginForm } from "../../../models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
    }, [isLogged, navigate])
    
  useEffect(() => {
    if (data?.token) {
      setUserInfo(data);
      navigate(`/${PrivateRoutes.HOME}`, { replace: true });
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
    apiError: error 
  };
};