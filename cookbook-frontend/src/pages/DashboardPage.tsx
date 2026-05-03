import { useEffect, useState } from "react";
import { getPublicRecipes, saveRecipe, getSavedRecipesByUser } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../api/types";

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [stashedIds, setStashedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [_savedMsg, setSavedMsg] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { isLoggedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const loadData = async () => {
       try {
          const [recRes, savedRes] = await Promise.all([
             getPublicRecipes(),
             userId ? getSavedRecipesByUser(userId) : Promise.resolve({ data: [] })
          ]);
          setRecipes(recRes.data);
          setFiltered(recRes.data);
          setStashedIds(new Set(savedRes.data.map((sr: any) => sr.recipeId)));
       } catch {
          // ignore
       } finally {
          setLoading(false);
       }
    };

    loadData();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          (r.categoryTags || "").toLowerCase().includes(term) ||
          (r.authorDisplayName || "").toLowerCase().includes(term)
      ),
    );
  }, [search, recipes]);

  const handleSave = async (recipe: Recipe) => {
    if (!userId) return alert("User ID not loaded yet, try again");
    try {
      await saveRecipe({
        userId,
        recipeId: recipe.id,
        originalAuthorId: recipe.authorId,
      });
      setStashedIds(prev => new Set([...prev, recipe.id]));
      setSavedMsg(recipe.id);
      setTimeout(() => setSavedMsg(null), 2000);
    } catch {
      alert("Failed to stash — item might already be in your bag.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>FISHING...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      {/* Refined Hero Section */}
      <div className="mb-20 bg-fw-salmon border-2 border-fw-navy shadow-sm p-12 text-white relative overflow-hidden rounded-[2rem]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none mb-4" style={{ fontFamily: 'var(--font-funky)' }}>
              The Recipe Exchange
            </h1>
            <p className="max-w-md text-sm font-bold text-fw-navy leading-snug uppercase tracking-tight opacity-80">
               Artisanal community-led documentation of culinary heritage. Fresh from the source.
            </p>
          </div>
          
          <div className="max-w-md w-full relative group">
            <input
              type="text"
              placeholder="SEARCH THE CATALOG..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-fw-navy p-4 text-fw-navy font-black placeholder:text-fw-navy/30 focus:outline-none focus:bg-fw-yellow transition-all shadow-sm text-xs tracking-widest rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-fw-navy/10 rounded-[3rem]">
          <p className="text-fw-navy/20 font-black text-6xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>EMPTY NETS!</p>
          <button onClick={() => setSearch("")} className="mt-8 text-fw-salmon font-black uppercase tracking-[0.3em] text-sm hover:underline">Clear the Deck</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={recipe.authorId === userId ? () => {} : undefined}
              actions={
                <>
                  <button
                    onClick={() => handleSave(recipe)}
                    disabled={stashedIds.has(recipe.id)}
                    className={`flex-1 text-[10px] font-black uppercase tracking-widest py-3 border-2 border-fw-navy shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl ${
                      stashedIds.has(recipe.id) 
                        ? "bg-fw-teal text-white border-fw-teal shadow-none" 
                        : "bg-fw-yellow text-fw-navy hover:bg-white"
                    }`}
                  >
                    {stashedIds.has(recipe.id) ? "STASHED" : "STASH"}
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Simplified Footer */}
      <div className="mt-40 mb-20 py-12 border-t-2 border-fw-navy/10 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-fw-navy/20">
        <span>© 2026 COOPER COOKBOOK</span>
        <div className="flex gap-4">
           <div className="w-8 h-8 rounded-full border-2 border-fw-navy/10 flex items-center justify-center">IG</div>
           <div className="w-8 h-8 rounded-full border-2 border-fw-navy/10 flex items-center justify-center">TT</div>
        </div>
      </div>
    </div>
  );
}
