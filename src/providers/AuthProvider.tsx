import { AuthContext } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/axiosInstance';
import { getUserById, login, logout } from '@/services/user';
import { localStorageKeys } from '@/static-data/localStorage';
import { userKeys } from '@/tanstack/keys/userKeys';
import type { Role, User, UserLoginType } from '@/types/User';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as jwt from 'jwt-decode';

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface TokenPayLoad {
  id: string;
  email: string;
  role: Role;
  orgAdmin: string | null;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
  );
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(localStorageKeys.ACCESS_TOKEN)
  );

  const { mutate } = useMutation({
    mutationKey: userKeys.login(),
    mutationFn: async (data: UserLoginType) => {
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
  const tokenPayload = accessToken
    ? (jwt.jwtDecode(accessToken || '') as TokenPayLoad | null)
    : null;

  const { data, isFetching, isError } = useQuery({
    queryKey: userKeys.getById(tokenPayload?.id || ''),
    queryFn: async () =>
      getUserById(axiosInstance, { id: tokenPayload?.id || '' }),
    enabled: !!accessToken,
  });

  const logoutHandler = () => {
    logout();
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
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
