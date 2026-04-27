import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getSavedRecipesByUser, 
  deleteSavedRecipe, 
  getRecipeById, 
  forkRecipe, 
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  addRecipeToCollection,
  getRecipesInCollection,
  removeRecipeFromCollection
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
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
  const [showColForm, setShowForm] = useState(false);
  const [colForm, setForm] = useState({ name: "", description: "" });
  const [expandedCol, setExpandedCol] = useState<number | null>(null);
  const [stashSearch, setStashSearch] = useState("");
  const navigate = useNavigate();

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

  const handleFork = async (id: number) => {
    if (!userId) return;
    try {
      const res = await forkRecipe(id, userId);
      navigate(`/recipes/${res.data.id}/edit`);
    } catch { alert("Failed to fork recipe"); }
  };

  const handleAddToCollection = async (collectionId: number, recipeId: number) => {
    try {
      await addRecipeToCollection(collectionId, recipeId);
      setSelectedForCollection(null);
      fetchAllData();
    } catch { alert("Already in that collection."); }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await createCollection({ userId, name: colForm.name, description: colForm.description, orderIndex: collections.length });
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchAllData();
    } catch { alert("Failed to create collection"); }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      fetchAllData();
    } catch { alert("Failed to delete collection"); }
  };

  const handleRemoveRecipeFromCollection = async (collectionId: number, recipeId: number) => {
    try {
      await removeRecipeFromCollection(collectionId, recipeId);
      fetchAllData();
    } catch { alert("Failed to remove recipe"); }
  };

  const toggleExpand = (colId: number) => {
    setExpandedCol(expandedCol === colId ? null : colId);
  };

  if (!userId || loading) {
    return <div className="text-center py-20 text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>SCANNING THE STASH...</div>;
  }

  return (
    <div className="max-w-[1700px] mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-16 pb-8 border-b-2 border-fw-navy/10">
        <div>
          <h1 className="text-6xl font-black italic text-fw-navy tracking-tighter uppercase" style={{ fontFamily: 'var(--font-funky)' }}>The Stash</h1>
          <p className="text-fw-navy/40 font-bold uppercase text-sm tracking-[0.2em] mt-4">
             Your personal inventory of curated culinary assets
          </p>
        </div>
        <Link to="/" className="fw-btn-secondary !py-3 !px-8">
          Browse More
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <div className="mb-8">
             <input 
               type="text" 
               placeholder="SEARCH YOUR STASH..." 
               value={stashSearch}
               onChange={e => setStashSearch(e.target.value)}
               className="w-full bg-white border-4 border-fw-navy p-4 text-sm font-black focus:bg-fw-yellow transition-all outline-none uppercase tracking-widest placeholder:text-fw-navy/10"
             />
          </div>

          {saved.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-fw-navy/10 rounded-3xl">
              <p className="text-fw-navy/20 font-black text-4xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>NO RECIPES</p>
              <Link to="/" className="mt-8 inline-block text-fw-salmon font-black uppercase tracking-widest hover:underline">Go Hunting</Link>
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
                              className="text-[10px] font-black text-fw-salmon hover:underline underline-offset-4 uppercase tracking-widest"
                            >
                              Remove from Stash
                            </button>
                          </div>
                          
                          <button
                            onClick={() => setSelectedForCollection(selectedForCollection === sr.id ? null : sr.id)}
                            className={`text-[10px] font-black uppercase tracking-widest border-4 border-fw-navy py-3 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(14,27,43,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                               selectedForCollection === sr.id ? "bg-fw-navy text-white" : "bg-fw-yellow text-fw-navy hover:bg-white"
                            }`}
                          >
                            {selectedForCollection === sr.id ? "CANCEL" : "+ Add to Collection"}
                          </button>

                          {sr.recipe.authorId !== userId && (
                            <button
                              onClick={() => handleFork(sr.recipeId)}
                              className="text-[10px] font-black uppercase tracking-widest bg-fw-pink text-fw-navy border-4 border-fw-navy py-3 rounded-xl hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(14,27,43,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                              Clone & Revise
                            </button>
                          )}
                        </div>
                      }
                    />

                    {/* Pop-over selector to prevent layout shift */}
                    {selectedForCollection === sr.id && (
                       <div className="absolute inset-x-6 bottom-32 bg-white border-4 border-fw-navy p-4 z-20 shadow-[8px_8px_0px_0px_rgba(14,27,43,1)] animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-fw-navy text-center border-b-2 border-fw-navy/10 pb-2">Save to Collection</p>
                          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
                             {collections.map(col => (
                               <button 
                                 key={col.id}
                                 onClick={() => handleAddToCollection(col.id, sr.recipeId)}
                                 className="text-left text-[10px] font-bold uppercase p-3 hover:bg-fw-yellow border-2 border-transparent rounded-lg transition-all"
                               >
                                 {col.name}
                               </button>
                             ))}
                             {collections.length === 0 && <p className="text-[9px] font-bold text-center text-fw-navy/30 py-4 italic">Create a collection first.</p>}
                             <button onClick={() => setSelectedForCollection(null)} className="text-center text-[9px] font-black uppercase p-2 text-fw-navy/40 hover:text-fw-navy transition-colors mt-2">Close</button>
                          </div>
                       </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[440px] shrink-0 sticky top-32">
           <div className="bg-white border border-fw-navy/10 shadow-lg rounded-[2.5rem] p-10">
              <div className="flex items-center justify-between mb-8 border-b-4 border-fw-navy/5 pb-4">
                 <h2 className="text-3xl font-black italic tracking-tighter" style={{ fontFamily: 'var(--font-funky)' }}>Collections</h2>
                 <button 
                  onClick={() => setShowForm(!showColForm)}
                  className="bg-fw-teal text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-sm"
                 >
                   {showColForm ? "CLOSE" : "+ NEW"}
                 </button>
              </div>

              {showColForm && (
                <form onSubmit={handleCreateCollection} className="mb-10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="space-y-4">
                      <input
                        type="text"
                        value={colForm.name}
                        onChange={e => setForm({ ...colForm, name: e.target.value })}
                        placeholder="NAME..."
                        className="w-full border-4 border-fw-navy p-3 text-sm font-bold focus:outline-none focus:bg-fw-yellow transition-all uppercase"
                        required
                      />
                      <textarea
                        value={colForm.description}
                        onChange={e => setForm({ ...colForm, description: e.target.value })}
                        placeholder="DESCRIPTION / BIO..."
                        rows={2}
                        className="w-full border-4 border-fw-navy p-3 text-sm font-bold focus:outline-none focus:bg-fw-yellow transition-all uppercase"
                      />
                   </div>
                   <button type="submit" className="w-full bg-fw-salmon text-white rounded-xl py-4 font-black uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-all">
                     CREATE
                   </button>
                </form>
              )}

              {collections.length === 0 ? (
                <p className="text-center py-12 text-fw-navy/20 font-black text-xs uppercase italic tracking-widest">No Collections.</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                   {collections.map(col => (
                     <div key={col.id} className="border border-fw-navy/5 rounded-2xl overflow-hidden bg-fw-cream/10">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-fw-yellow/30 transition-colors" onClick={() => toggleExpand(col.id)}>
                           <div className="flex-1 min-w-0">
                              <h3 className="font-black text-sm uppercase tracking-tighter italic leading-none mb-1">{col.name}</h3>
                              <p className="text-[9px] font-bold text-fw-navy/40 uppercase tracking-widest">{col.recipeCount || 0} Items</p>
                           </div>
                           <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                              <button onClick={() => handleDeleteCollection(col.id)} className="text-fw-salmon opacity-20 hover:opacity-100 transition-opacity p-1">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 1 0 002 2h8a2 1 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              </button>
                           </div>
                        </div>
                        
                        {expandedCol === col.id && (
                           <div className="bg-white border-t border-fw-navy/5 p-4 space-y-4 animate-in fade-in duration-300">
                              {col.description && <p className="text-xs text-fw-navy/60 italic font-serif leading-relaxed border-l-4 border-fw-yellow pl-4 mb-4">{col.description}</p>}
                              {col.recipes.length === 0 ? (
                                <p className="text-[9px] font-black uppercase text-fw-navy/20 text-center py-4 italic">Empty Collection</p>
                              ) : (
                                <div className="space-y-2">
                                  {col.recipes.map(recipe => (
                                    <div key={recipe.id} className="flex items-center gap-4 bg-fw-cream/20 p-2 rounded-lg border border-fw-navy/5 group/item">
                                       <div className="w-10 h-10 rounded-md border border-fw-navy/10 bg-white overflow-hidden shrink-0">
                                          <img src={recipe.imageUrl} className="w-full h-full object-cover" />
                                       </div>
                                       <Link to={`/recipe/${recipe.id}`} className="flex-1 text-[10px] font-black uppercase hover:text-fw-salmon leading-tight">{recipe.title}</Link>
                                       <button 
                                          onClick={() => handleRemoveRecipeFromCollection(col.id, recipe.id)}
                                          className="opacity-0 group-hover/item:opacity-100 text-fw-salmon p-1 transition-all"
                                       >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                       </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                           </div>
                        )}
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
