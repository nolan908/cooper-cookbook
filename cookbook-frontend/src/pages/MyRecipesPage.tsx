import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipesByAuthor, deleteRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../api/types";

export default function MyRecipesPage() {
 const { userId } = useAuth();
 const [recipes, setRecipes] = useState<Recipe[]>([]);
 const [filtered, setFiltered] = useState<Recipe[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");

 const fetchRecipes = async () => {
 if (!userId) return;
 setLoading(true);
 try {
 const res = await getRecipesByAuthor(userId);
 setRecipes(res.data);
 setFiltered(res.data);
 } catch {
 // ignore
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchRecipes();
 }, [userId]);

 useEffect(() => {
 const term = search.toLowerCase();
 setFiltered(recipes.filter(r => 
 r.title.toLowerCase().includes(term) || 
 (r.categoryTags || "").toLowerCase().includes(term)
 ));
 }, [search, recipes]);

 const handleDelete = async (id: number) => {
 if (!confirm("Delete this recipe?")) return;
 try {
 await deleteRecipe(id);
 fetchRecipes();
 } catch {
 alert("Failed to delete recipe");
 }
 };

 if (loading) {
   return (
     <div className="flex flex-col items-center justify-center py-32 space-y-8">
       <img
         src="https://images.squarespace-cdn.com/content/v1/584ac727c534a52d610a4a4a/1608157863098-SA0LPX2PUY93MSZWREAT/Pan-flip-colour.gif?format=1500w"
         alt="Cooking..."
         className="w-64 h-64 object-contain rounded-[3rem] shadow-xl"
       />       <div className="text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>Cooking...</div>
     </div>
   );
 }

 return (
 <div className="max-w-6xl mx-auto px-6 py-12 text-left">
 <div className="flex items-end justify-between mb-16 pb-8 border-b-2 border-fw-navy/10">
 <div>
 <h1 className="text-6xl font-black italic text-fw-navy tracking-tighter" style={{ fontFamily: 'var(--font-funky)' }}>My Kitchen</h1>
 <p className="text-fw-navy/40 font-bold text-sm tracking-[0.2em] mt-4">
 Your personal collection of culinary creations
 </p>
 </div>
 <Link
 to="/create" className="bg-fw-salmon text-white border-4 border-fw-navy shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] px-8 py-4 font-black tracking-widest text-xs transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none" >
 + Create Recipe
 </Link>
 </div>

 <div className="mb-12">
 <input 
 type="text" placeholder="SEARCH YOUR CREATIONS..." value={search}
 onChange={e => setSearch(e.target.value)}
 className="w-full bg-white border-4 border-fw-navy p-6 text-sm font-black focus:bg-fw-yellow transition-all outline-none tracking-widest placeholder:text-fw-navy/10" />
 </div>

 {filtered.length === 0 ? (
 <div className="text-center py-32 border-2 border-dashed border-fw-navy/10 rounded-3xl">
 <p className="text-fw-navy/20 font-black text-4xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>KITCHEN IS EMPTY.</p>
 <Link to="/create" className="mt-8 inline-block text-fw-salmon font-black tracking-widest hover:underline font-black">Fire Up the Stove</Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
 {filtered.map((recipe) => (
 <RecipeCard
 key={recipe.id}
 recipe={recipe}
 onEdit={() => {}}
 hideAuthor={true}
 actions={
 <div className="flex gap-2">
 <button
 onClick={() => handleDelete(recipe.id)}
 className="text-xs text-white bg-fw-salmon border-2 border-fw-navy px-3 py-1.5 rounded-lg font-bold transition shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]" >
 Delete
 </button>
 </div>
 }
 />
 ))}
 </div>
 )}
 </div>
 );
}
