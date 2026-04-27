import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, username, profilePictureUrl, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  return (
    <nav className="bg-fw-teal text-white border-b-2 border-fw-navy sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="text-4xl font-black italic tracking-tighter hover:text-fw-yellow transition-all active:scale-95 shrink-0 whitespace-nowrap" style={{ fontFamily: 'var(--font-funky)' }}>
          Cooper <span className="not-italic text-fw-salmon">×</span> Cookbook
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-fw-yellow transition">Browse</Link>
            <Link to="/my-recipes" className="hover:text-fw-yellow transition">My Kitchen</Link>
            <Link to="/saved" className="hover:text-fw-yellow transition">Stash</Link>
            <Link to="/create" className="bg-fw-salmon border-2 border-fw-navy shadow-sm px-5 py-2 hover:bg-opacity-90 transition-all shrink-0">
              + CREATE RECIPE
            </Link>
            <div className="flex items-center gap-4 pl-4 border-l-2 border-fw-navy/20 shrink-0">
              <Link to="/profile" className="flex items-center gap-2 group transition-all active:scale-95">
                <div className="w-8 h-8 rounded-full border-2 border-fw-navy overflow-hidden bg-fw-navy">
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt={username || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white uppercase font-black">
                      {username?.substring(0, 1) || "U"}
                    </div>
                  )}
                </div>
                <span className="group-hover:text-fw-yellow transition-colors italic font-black text-xs">{username}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-white/40 hover:text-fw-navy hover:bg-fw-yellow px-3 py-1 border-2 border-transparent hover:border-fw-navy transition-all uppercase text-[9px] font-black tracking-widest active:translate-x-[1px] active:translate-y-[1px]"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
            <Link to="/login" className="hover:text-fw-yellow transition">Sign In</Link>
            <Link to="/register" className="bg-fw-yellow text-fw-navy border-2 border-fw-navy shadow-sm px-10 py-4 hover:bg-white transition-all active:scale-95">
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
