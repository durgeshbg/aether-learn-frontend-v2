import type { User, UserLoginType } from "@/types/User";
import { createContext } from "react";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  logout: () => void;
  login: (data: UserLoginType) => void;
  loading?: boolean;
  user: User | null;
}>({
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
  loading: false,
  user: null,
});
