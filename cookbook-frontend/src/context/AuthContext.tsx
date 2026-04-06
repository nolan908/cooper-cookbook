import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { jwtDecode } from "./jwtDecode";
import axios from "axios";

interface AuthState {
  token: string | null;
  username: string | null;
  userId: number | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthState>({
  token: null,
  username: null,
  userId: null,
  isLoggedIn: false,
  setToken: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<number | null>(null);

  const username = token ? jwtDecode(token) : null;
  const isLoggedIn = !!token;

  const setToken = (t: string | null) => {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
      setUserId(null);
    }
    setTokenState(t);
  };

  const logOut = () => setToken(null);

  // Resolve username → userId on login
  useEffect(() => {
    if (!token || !username) {
      setUserId(null);
      return;
    }
    axios
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const me = res.data.find(
          (u: { username: string }) => u.username === username,
        );
        if (me) setUserId(me.id);
      })
      .catch(() => {});
  }, [token, username]);

  return (
    <AuthContext.Provider
      value={{ token, username, userId, isLoggedIn, setToken, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
