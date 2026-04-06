import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, username, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-400 hover:text-emerald-300">
          Cooper Cookbook
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-emerald-400 transition">Browse</Link>
            <Link to="/my-recipes" className="hover:text-emerald-400 transition">My Recipes</Link>
            <Link to="/collections" className="hover:text-emerald-400 transition">Collections</Link>
            <Link to="/saved" className="hover:text-emerald-400 transition">Saved</Link>
            <Link to="/create" className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded transition">
              + New Recipe
            </Link>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">{username}</span>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition">
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm">
            <Link to="/login" className="hover:text-emerald-400 transition">Log in</Link>
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded transition">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
