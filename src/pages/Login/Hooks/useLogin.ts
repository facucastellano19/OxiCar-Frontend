import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useUserStore } from "../../../store";
import { useApi } from "../../../hooks";
import { loginCall } from "../../../services";
import { PrivateRoutes } from "../../../models";

export const useLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { error, loading, fetch, data } = useApi(loginCall);
  const isLogged = useUserStore((state) => state.isLogged);

useEffect(() => {
    if (isLogged) {
      navigate(`/${PrivateRoutes.HOME}`, { replace: true });
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    if (data && data.token) {
      setUserInfo(data);
      navigate(`/${PrivateRoutes.HOME}`, { replace: true });
    }
  }, [data, setUserInfo, navigate]);
   
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    fetch({ username, password });
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    loading,
    error
  };
}