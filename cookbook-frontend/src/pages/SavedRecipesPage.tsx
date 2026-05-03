import { useEffect, useState } from "react";
import { 
 getSavedRecipesByUser, 
 deleteSavedRecipe, 
 getRecipeById, 
 getCollectionsByUser,
 addRecipeToCollection,
 getRecipesInCollection
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import CollectionSidebar from "../components/CollectionSidebar";
import type { SavedRecipe, Recipe, Collection } from "../api/types";

interface SavedWithRecipe extends SavedRecipe {
 recipe?: Recipe;
}

interface CollectionWithRecipes extends Collection {
 recipes: Recipe[];
 loadingRecipes: boolean;
}

export default function SavedRecipesPage() {
 const { userId } = useAuth();
 const [saved, setSaved] = useState<SavedWithRecipe[]>([]);
 const [filteredSaved, setFilteredSaved] = useState<SavedWithRecipe[]>([]);
 const [collections, setCollections] = useState<CollectionWithRecipes[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedForCollection, setSelectedForCollection] = useState<number | null>(null);
 const [expandedCol, setExpandedCol] = useState<number | null>(null);
 const [stashSearch, setStashSearch] = useState("");

 const fetchAllData = async () => {
 if (!userId) return;
 setLoading(true);
 try {
 const [savedRes, colRes] = await Promise.all([
 getSavedRecipesByUser(userId),
 getCollectionsByUser(userId)
 ]);

 const stashedRecipeIds = new Set(savedRes.data.map(sr => sr.recipeId));

 const withRecipes = await Promise.all(
 savedRes.data.map(async (sr) => {
 try {
 const r = await getRecipeById(sr.recipeId);
 return { ...sr, recipe: r.data };
 } catch {
 return sr;
 }
 }),
 );
 setSaved(withRecipes);
 setFilteredSaved(withRecipes);
 
 const initialCols = await Promise.all(colRes.data.map(async (c: Collection) => {
 const recipesRes = await getRecipesInCollection(c.id);
 const validRecipes = recipesRes.data.filter(r => stashedRecipeIds.has(r.id));
 return { 
 ...c, 
 recipes: validRecipes, 
 loadingRecipes: false,
 recipeCount: validRecipes.length
 };
 }));
 
 setCollections(initialCols);
 } catch { /* ignore */ } finally { setLoading(false); }
 };

 useEffect(() => { fetchAllData(); }, [userId]);

 useEffect(() => {
 const term = stashSearch.toLowerCase();
 setFilteredSaved(saved.filter(s => 
 s.recipe?.title.toLowerCase().includes(term) || 
 (s.recipe?.categoryTags || "").toLowerCase().includes(term)
 ));
 }, [stashSearch, saved]);

 const handleRemoveFromStash = async (id: number) => {
 if (!confirm("Remove this from your stash?")) return;
 try {
 await deleteSavedRecipe(id);
 fetchAllData();
 } catch { alert("Failed to remove from stash"); }
 };

 const handleAddToCollection = async (collectionId: number, recipeId: number) => {
 try {
 await addRecipeToCollection(collectionId, recipeId);
 setSelectedForCollection(null);
 fetchAllData();
 } catch { alert("Already in that collection."); }
 };

 const toggleExpand = (colId: number) => {
 setExpandedCol(expandedCol === colId ? null : colId);
 };

  if (!userId || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/584ac727c534a52d610a4a4a/1608157863098-SA0LPX2PUY93MSZWREAT/Pan-flip-colour.gif?format=1500w" 
          alt="Cooking..." 
          className="w-64 h-64 object-contain rounded-[3rem] shadow-xl"
        />        <div className="text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>Cooking...</div>
      </div>
    );
  }

 return (
 <div className="max-w-[1700px] mx-auto px-6 py-12">
 <div className="flex items-end justify-between mb-16 pb-8 border-b-2 border-fw-navy/10">
 <div>
 <h1 className="text-6xl font-black italic text-fw-navy tracking-tighter" style={{ fontFamily: 'var(--font-funky)' }}>The Stash</h1>
 <p className="text-fw-navy/40 font-bold text-sm tracking-[0.2em] mt-4">
 Your personal inventory of curated culinary assets
 </p>
 </div>
 </div>

 <div className="flex flex-col lg:flex-row gap-12 items-start">
 <div className="flex-1 w-full">
 <div className="mb-8 text-left">
 <input
 type="text" placeholder="Search your stash..." value={stashSearch}
 onChange={e => setStashSearch(e.target.value)}
 className="w-full bg-white border-4 border-fw-navy p-4 text-sm font-black focus:bg-fw-yellow transition-all outline-none tracking-widest placeholder:text-fw-navy/10" />
 </div>

 {filteredSaved.length === 0 ? (
 <div className="text-center py-32 border-2 border-dashed border-fw-navy/10 rounded-3xl">
 <p className="text-fw-navy/20 font-black text-4xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>No Recipes</p> <button onClick={() => setStashSearch("")} className="mt-8 text-fw-salmon font-black tracking-widest hover:underline">Reset Filter</button>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
 {filteredSaved.map((sr) => (
 sr.recipe && (
 <div key={sr.id} className="flex flex-col relative">
 <RecipeCard
 recipe={sr.recipe}
 onEdit={sr.recipe.authorId === userId ? () => {} : undefined}
 actions={
 <div className="flex flex-col gap-3 w-full pt-4 mt-auto border-t border-fw-navy/5">
 <div className="flex items-center justify-end w-full">
 <button
 onClick={() => handleRemoveFromStash(sr.id)}
 className="text-[10px] font-black text-fw-salmon hover:underline underline-offset-4 tracking-widest" >
 Remove from Stash
 </button>
 </div>
 
 <button
 onClick={() => setSelectedForCollection(selectedForCollection === sr.id ? null : sr.id)}
 className={`text-[10px] font-black tracking-widest border-4 border-fw-navy py-3 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
 selectedForCollection === sr.id ?"bg-fw-navy text-white":"bg-fw-yellow text-fw-navy hover:bg-white" }`}
 >
 {selectedForCollection === sr.id ?"CANCEL":"+ Add to Collection"}
 </button>
 </div>
 }
 />

 {/* Pop-over selector to prevent layout shift */}
 {selectedForCollection === sr.id && (
 <div className="absolute inset-x-6 bottom-32 bg-white border-4 border-fw-navy p-4 z-20 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] animate-in fade-in slide-in-from-bottom-2 duration-200">
 <p className="text-[10px] font-black tracking-widest mb-4 text-fw-navy text-center border-b-2 border-fw-navy/10 pb-2">Save to Collection</p>
 <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
 {collections.map(col => (
 <button 
 key={col.id}
 onClick={() => handleAddToCollection(col.id, sr.recipeId)}
 className="text-left text-[10px] font-bold p-3 hover:bg-fw-yellow border-2 border-transparent rounded-lg transition-all" >
 {col.name}
 </button>
 ))}
 {collections.length === 0 && <p className="text-[9px] font-bold text-center text-fw-navy/30 py-4 italic">Create a collection first.</p>}
 <button onClick={() => setSelectedForCollection(null)} className="text-center text-[9px] font-black p-2 text-fw-navy/40 hover:text-fw-navy transition-colors mt-2">Close</button>
 </div>
 </div>
 )}
 </div>
 )
 ))}
 </div>
 )}
 </div>

 <CollectionSidebar 
 userId={userId} 
 collections={collections} 
 expandedCol={expandedCol} 
 onToggleExpand={toggleExpand} 
 onRefresh={fetchAllData} 
 />
 </div>
 </div>
 );
}
