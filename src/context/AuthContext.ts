import type { UserLoginType, UserWithDetails } from "@/types/User";
import { createContext } from "react";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  logout: () => void;
  login: (data: UserLoginType) => void;
  loading?: boolean;
  user: UserWithDetails | null;
}>({
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
  loading: false,
  user: null,
});
