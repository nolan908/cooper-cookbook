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
  profilePictureUrl: string | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthState>({
  token: null,
  username: null,
  userId: null,
  profilePictureUrl: null,
  isLoggedIn: false,
  setToken: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const username = token ? jwtDecode(token) : null;
  const isLoggedIn = !!token;

  const setToken = (t: string | null) => {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
      setUserId(null);
      setProfilePictureUrl(null);
    }
    setTokenState(t);
  };

  const logOut = () => setToken(null);

  // Resolve username → userId & profile info on login
  useEffect(() => {
    if (!token || !username) {
      setUserId(null);
      setProfilePictureUrl(null);
      return;
    }
    axios
      .get("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const me = res.data.find(
          (u: { username: string }) => u.username === username,
        );
        if (me) {
          setUserId(me.id);
          setProfilePictureUrl(me.profilePictureUrl);
        }
      })
      .catch(() => {});
  }, [token, username]);

  return (
    <AuthContext.Provider
      value={{ token, username, userId, profilePictureUrl, isLoggedIn, setToken, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
