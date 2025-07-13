import type { User, UserLogin } from '@/types/User';
import { createContext } from 'react';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  logout: () => void;
  login: (data: UserLogin) => void;
  loading?: boolean;
  user: User | null;
}>({
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
  loading: false,
  user: null,
});
