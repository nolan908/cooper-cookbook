import { useEffect, useState } from "react";
import { getPublicRecipes, saveRecipe, getSavedRecipesByUser, deleteSavedRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../api/types";

export default function DashboardPage() {
 const [recipes, setRecipes] = useState<Recipe[]>([]);
 const [filtered, setFiltered] = useState<Recipe[]>([]);
 const [stashedIds, setStashedIds] = useState<Map<number, number>>(new Map());
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const { userId } = useAuth();

 useEffect(() => {
 const loadData = async () => {
 try {
 const [recRes, savedRes] = await Promise.all([
 getPublicRecipes(),
 userId ? getSavedRecipesByUser(userId) : Promise.resolve({ data: [] })
 ]);
 setRecipes(recRes.data);
 setFiltered(recRes.data);
 const mapped = new Map<number, number>();
 savedRes.data.forEach((sr: any) => {
 mapped.set(sr.recipeId, sr.id);
 });
 setStashedIds(mapped);
 } catch {
 // ignore
 } finally {
 setLoading(false);
 }
 };

 loadData();
 }, [userId]);

 useEffect(() => {
 const term = search.toLowerCase();
 setFiltered(
   recipes.filter(
     (r) =>
       r.title.toLowerCase().includes(term) ||
       (r.description || "").toLowerCase().includes(term) ||
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
 const savedRes = await getSavedRecipesByUser(userId);
 const mapped = new Map<number, number>();
 savedRes.data.forEach((sr: any) => {
 mapped.set(sr.recipeId, sr.id);
 });
 setStashedIds(mapped);
 } catch {
 alert("Failed to stash — item might already be in your bag.");
 }
 };

 const handleRemove = async (recipeId: number) => {
 const savedId = stashedIds.get(recipeId);
 if (!savedId) return;
 try {
 await deleteSavedRecipe(savedId);
 setStashedIds(prev => {
 const next = new Map(prev);
 next.delete(recipeId);
 return next;
 });
 } catch {
 alert("Failed to remove from stash.");
 }
 };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/584ac727c534a52d610a4a4a/1608157863098-SA0LPX2PUY93MSZWREAT/Pan-flip-colour.gif?format=1500w" 
          alt="Cooking..." 
          className="w-64 h-64 object-contain rounded-[3rem] shadow-xl"
        />
        <div className="text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>Cooking...</div>
      </div>
    );
  }

 return (
 <div className="max-w-[1600px] mx-auto px-6 py-12 text-left">
 {/* Refined Hero Section */}
 <div className="mb-20 bg-fw-salmon border-2 border-fw-navy shadow-sm p-12 text-white relative overflow-hidden rounded-[2rem]">
 {/* Silhouette background element - Tall Chef Hat */}
 <div className="absolute right-[-5%] bottom-[-10%] opacity-10 pointer-events-none rotate-[-12deg]">
 <img 
 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlwNmyJqapbAylLT0BOQoFROVT9j1ypHgExw&s" 
 alt="Silhouette" 
 className="w-[500px] h-[500px] object-contain invert brightness-0" 
 />
 </div>
 
 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
 <div className="space-y-6">
 <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none" style={{ fontFamily: 'var(--font-funky)' }}>
 The Recipe Exchange
 </h1>
 <p className="max-w-md text-sm font-bold text-fw-navy leading-snug tracking-tight opacity-80">
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
 <p className="text-fw-navy/20 font-black text-6xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>Empty Nets!</p>
 <button onClick={() => setSearch("")} className="mt-8 text-fw-salmon font-black tracking-[0.3em] text-sm hover:underline">Clear the Deck</button>
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
 {stashedIds.has(recipe.id) ? (
 <button
 onClick={() => handleRemove(recipe.id)}
 className="flex-1 text-[10px] font-black tracking-widest py-3 border-2 border-fw-navy shadow-sm transition-all active:scale-95 rounded-xl bg-fw-teal text-white border-fw-teal hover:bg-fw-salmon hover:border-fw-salmon"
 >
 Remove from stash
 </button>
 ) : (
 <button
 onClick={() => handleSave(recipe)}
 className="flex-1 text-[10px] font-black tracking-widest py-3 border-2 border-fw-navy shadow-sm transition-all active:scale-95 rounded-xl bg-fw-yellow text-fw-navy hover:bg-white"
 >
 Stash
 </button>
 )}
 </>
 }
 />
 ))}
 </div>
 )}

 {/* Simplified Footer */}
 <div className="mt-40 mb-20 py-12 border-t-2 border-fw-navy/10 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black tracking-[0.4em] text-fw-navy/20">
 <span>© 2026 COOPER COOKBOOK</span>
 </div>
 </div>
 );
}
