import { AuthContext } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/axiosInstance';
import { getMe, logout } from '@/services/users';
import { localStorageKeys } from '@/static-data/localStorage';
import { userKeys } from '@/tanstack/keys/userKeys';
import type { User } from '@/types/User';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { data, isFetching, isError } = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => getMe(axiosInstance),
  });

  useEffect(() => {
    if (isFetching) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (data) {
      setUser(data);
    } else if (isError) {
      setUser(null);
    }
  }, [data, isError, isFetching]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
