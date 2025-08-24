import { AuthContext } from "@/context/AuthContext";
import { axiosInstance } from "@/utils/axiosInstance";
import { getUserById, login, logout } from "@/services/user";
import { localStorageKeys } from "@/static-data/localStorage";
import { userKeys } from "@/tanstack/keys/userKeys";
import type { Role, User, UserLoginType } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import * as jwt from "jwt-decode";

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
  const queryClient = useQueryClient();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
    setAccessToken(token);
    setInitializing(false);
  }, []);

  const { mutate } = useMutation({
    mutationKey: userKeys.login(),
    mutationFn: async (data: UserLoginType) => {
      return await login(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: "Login successful!",
    },
    onSuccess: (data) => {
      localStorage.setItem(localStorageKeys.ACCESS_TOKEN, data.token);
      setUser(null); // Clear old user data
      setAccessToken(data.token);
    },
  });

  const tokenPayload = accessToken
    ? (jwt.jwtDecode(accessToken) as TokenPayLoad | null)
    : null;

  const { data, isFetching, isError, error } = useQuery({
    queryKey: userKeys.getById(tokenPayload?.id || ""),
    queryFn: async () =>
      getUserById(axiosInstance, { id: tokenPayload?.id || "" }),
    enabled: !!accessToken && !!tokenPayload?.id && !initializing,
    retry: 1, // Limit retries for faster error handling
  });

  const logoutHandler = useCallback(() => {
    logout();
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    setAccessToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // Handle user data updates
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else if (isError && accessToken) {
      logoutHandler();
    }
  }, [data, isError, error, accessToken, logoutHandler]);

  const isAuthenticated = !!accessToken;
  const isUserLoading = isAuthenticated && (isFetching || (!user && !isError));
  const loading = initializing || isUserLoading;

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
