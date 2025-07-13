import type { User } from '@/types/User';
import { createContext } from 'react';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  logout: () => void;
  loading?: boolean;
  user: User | null;
}>({
  isAuthenticated: false,
  logout: () => {},
  loading: false,
  user: null,
});
