import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
const { isLoggedIn, username, profilePictureUrl, logOut } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
logOut();
navigate("/");
};
if (!isLoggedIn) return null;

return (
<nav className="bg-fw-teal text-white border-b-2 border-fw-navy sticky top-0 z-50"> <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
 <Link to="/browse" className="flex items-center gap-3 shrink-0 whitespace-nowrap text-fw-yellow hover:opacity-80 transition-opacity active:scale-95" style={{ fontFamily: 'var(--font-logo)' }}>
 <div className="w-10 h-10 flex items-center justify-center">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
 <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
 <line x1="6" y1="17" x2="18" y2="17" />
 </svg>
 </div>
 <span className="text-3xl tracking-tight">Cooper Cookbook</span>
 </Link>

 {isLoggedIn ? (
 <div className="flex items-center gap-6 text-[11px] font-black tracking-[0.2em] whitespace-nowrap overflow-x-auto no-scrollbar uppercase">
 <Link to="/browse" className="hover:text-fw-yellow transition">Browse</Link>
 <Link to="/my-recipes" className="hover:text-fw-yellow transition">My Kitchen</Link>
 <Link to="/saved" className="hover:text-fw-yellow transition">Stash</Link>
 <Link to="/create" className="bg-fw-salmon border-2 border-fw-navy shadow-sm px-5 py-2 hover:bg-opacity-90 transition-all shrink-0">
 + Create Recipe
 </Link>
 <div className="flex items-center gap-4 pl-4 border-l-2 border-fw-navy/20 shrink-0">
 <Link to="/profile" className="flex items-center gap-2 group transition-all active:scale-95">
 <div className="w-8 h-8 rounded-full border-2 border-fw-navy overflow-hidden bg-white">
 {profilePictureUrl ? (
 <img src={profilePictureUrl} alt={username || "User"} className="w-full h-full object-cover"/>
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-fw-yellow/20 p-1 text-fw-navy/40">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 </div>
 )}
 </div>
 <span className="group-hover:text-fw-yellow transition-colors italic font-black text-xs line-clamp-1 max-w-[100px]">{username}</span>
 </Link>
 <button 
 onClick={handleLogout} 
 className="text-white/40 hover:text-fw-navy hover:bg-fw-yellow px-3 py-1 border-2 border-transparent hover:border-fw-navy transition-all text-[9px] font-black tracking-widest active:translate-x-[1px] active:translate-y-[1px]" >
 Log Out
 </button>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-8 text-[11px] font-black tracking-[0.3em] whitespace-nowrap uppercase">
 <Link to="/login" className="hover:text-fw-yellow transition">Log In</Link>
 <Link to="/register" className="bg-fw-yellow text-fw-navy border-2 border-fw-navy shadow-sm px-10 py-4 hover:bg-white transition-all active:scale-95">
 Sign Up
 </Link>
 </div>
 )}
 </div>
 </nav>
 );
}
