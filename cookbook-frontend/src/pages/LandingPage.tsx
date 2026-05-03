import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-20 text-left">
      {/* Hero Section */}
      <div className="mb-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter leading-[0.85] text-fw-navy" style={{ fontFamily: 'var(--font-funky)' }}>
            The Digital <br />
            <span className="text-fw-salmon">Kitchen</span> Archive
          </h1>
          <p className="max-w-xl text-xl font-bold leading-tight text-fw-navy/70 tracking-tight">
            Cooper Cookbook is a community-led platform for documenting, 
            organizing, and evolving culinary heritage.
          </p>
          <div className="flex gap-4 pt-4">
            <Link to="/register" className="fw-btn-primary !text-lg !px-12">
              Join the Kitchen
            </Link>
            <Link to="/login" className="fw-btn-secondary !text-lg !px-12">
              Log In
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="aspect-square bg-fw-yellow border-4 border-fw-navy rounded-[4rem] shadow-fw flex items-center justify-center p-12 overflow-hidden group">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlwNmyJqapbAylLT0BOQoFROVT9j1ypHgExw&s" 
              alt="Logo" 
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
            />
          </div>
          {/* Decorative badge */}
          <div className="absolute -top-6 -right-6 bg-fw-teal text-white border-4 border-fw-navy px-6 py-6 rounded-full font-black text-xs tracking-[0.2em] shadow-fw -rotate-12 animate-bounce">
            EST. 2026
          </div>
        </div>
      </div>

      {/* Instructions / How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        <div className="bg-white border-4 border-fw-navy p-10 rounded-[2.5rem] shadow-fw group hover:bg-fw-cream transition-colors">
          <div className="w-16 h-16 bg-fw-pink border-4 border-fw-navy flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform">
             <span className="text-3xl font-black italic">1</span>
          </div>
          <h3 className="text-3xl font-black italic mb-4 tracking-tighter">DISCOVER</h3>
          <p className="font-bold text-fw-navy/60 leading-tight">
            Browse the public catalog for recipes contributed by chefs worldwide. 
            Use the global search to find exactly what you're craving.
          </p>
        </div>

        <div className="bg-white border-4 border-fw-navy p-10 rounded-[2.5rem] shadow-fw group hover:bg-fw-cream transition-colors">
          <div className="w-16 h-16 bg-fw-yellow border-4 border-fw-navy flex items-center justify-center mb-8 -rotate-6 group-hover:rotate-0 transition-transform">
             <span className="text-3xl font-black italic">2</span>
          </div>
          <h3 className="text-3xl font-black italic mb-4 tracking-tighter">STASH</h3>
          <p className="font-bold text-fw-navy/60 leading-tight">
            One-click "Stash" saves any recipe to your personal inventory. 
            Organize your saved recipes into custom collections.
          </p>
        </div>

        <div className="bg-white border-4 border-fw-navy p-10 rounded-[2.5rem] shadow-fw group hover:bg-fw-cream transition-colors">
          <div className="w-16 h-16 bg-fw-teal border-4 border-fw-navy flex items-center justify-center mb-8 rotate-12 group-hover:rotate-[30deg] transition-transform">
             <span className="text-3xl font-black italic text-white">3</span>
          </div>
          <h3 className="text-3xl font-black italic mb-4 tracking-tighter">EVOLVE</h3>
          <p className="font-bold text-fw-navy/60 leading-tight">
            Use the Fork button to create an editable copy of any recipe. 
            Modify ingredients or steps while keeping track of the original lineage.
          </p>
        </div>
      </div>

      {/* Attribution Footer */}
      <footer className="mt-40 pb-12 text-right space-y-1">
        <p className="text-[9px] font-black tracking-[0.2em] text-fw-navy/20 uppercase">
          Nolan Griffith & Alex Valsamis
        </p>
        <p className="text-[9px] font-bold tracking-widest text-fw-navy/15 uppercase">
          ECE-366 Software Engineering — Advised by Professor Christopher Hong
        </p>
        <p className="text-[9px] font-bold tracking-widest text-fw-navy/15 uppercase">
          The Cooper Union for the Advancement of Science and Art
        </p>
        <p className="text-[9px] font-black tracking-[0.2em] text-fw-navy/20 uppercase pt-2">
          Developed with Gemini CLI
        </p>
      </footer>
    </div>
  );
}
