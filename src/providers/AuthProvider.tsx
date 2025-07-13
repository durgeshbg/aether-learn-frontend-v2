import { AuthContext } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/axiosInstance';
import { getMe, login, logout } from '@/services/users';
import { localStorageKeys } from '@/static-data/localStorage';
import { userKeys } from '@/tanstack/keys/userKeys';
import type { User, UserLogin } from '@/types/User';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
  );
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
  );

  const { mutate } = useMutation({
    mutationKey: userKeys.login(),
    mutationFn: async (data: UserLogin) => {
      return await login(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: 'Login successful!',
    },
    onSuccess: (data) => {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.token);
      setUser(null);
      setAccessToken(data.token);
    },
  });

  const { data, isFetching, isError } = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => getMe(axiosInstance),
    enabled: !!accessToken,
  });

  const logoutHandler = () => {
    logout();
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    if (isFetching) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (data) {
      setUser(data.user);
    } else if (isError) {
      setUser(null);
    }
  }, [data, isError, isFetching, accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: mutate,
        logout: logoutHandler,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
