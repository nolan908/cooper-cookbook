import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
  getSavedRecipesByUser,
  getRecipeById,
  getRecipesInCollection,
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Collection, Recipe } from "../api/types";

// Enhanced visual recipe picker
function RecipePicker({
  recipes,
  onConfirm,
  onCancel,
  confirmLabel,
}: {
  recipes: Recipe[];
  onConfirm: (recipeId: number) => void;
  onCancel: () => void;
  confirmLabel: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.categoryTags || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mt-3 bg-brand-eggshell rounded-2xl p-6 border-4 border-fw-navy shadow-inner">
      <div className="flex items-center justify-between mb-4 border-b-2 border-fw-navy/10 pb-4">
        <h3 className="font-black text-fw-navy text-xs uppercase tracking-[0.2em]">Choose from your Stash</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!selectedId) return alert("Select a recipe first");
              onConfirm(selectedId);
            }}
            className="text-[10px] font-black uppercase tracking-widest bg-fw-teal text-white border-2 border-fw-navy shadow-[2px_2px_0px_0px_rgba(14,27,43,1)] px-5 py-2 rounded transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="text-[10px] font-black uppercase tracking-widest bg-white text-fw-navy border-2 border-fw-navy px-5 py-2 rounded transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search your stashed goods..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border-4 border-fw-navy rounded-xl px-4 py-3 text-sm mb-6 focus:outline-none focus:bg-fw-yellow transition-all font-black uppercase tracking-tight text-fw-navy placeholder:text-fw-navy/20"
        autoFocus
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-1 custom-scrollbar">
        {filtered.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={`text-left rounded-2xl overflow-hidden border-2 transition-all relative group ${
              selectedId === r.id
                ? "border-brand-basil ring-4 ring-brand-basil/10 bg-white scale-[0.98]"
                : "border-transparent bg-white hover:border-brand-basil/20 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="aspect-square w-full bg-brand-eggshell overflow-hidden relative border-b-2 border-brand-basil/5">
              {r.imageUrl ? (
                <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-basil/10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              {selectedId === r.id && (
                <div className="absolute inset-0 bg-brand-basil/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="bg-white rounded-full p-1.5 shadow-xl">
                    <svg className="w-6 h-6 text-brand-basil" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-black text-brand-espresso line-clamp-1 leading-tight mb-1">{r.title}</p>
              <div className="h-1 w-4 bg-brand-terracotta/40 rounded-full"></div>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm font-bold text-brand-basil/40 italic">Nothing in your stash matches this search.</p>
        </div>
      )}
    </div>
  );
}

interface CollectionWithRecipes extends Collection {
  recipes: Recipe[];
  loadingRecipes: boolean;
}

export default function CollectionsPage() {
  const { userId } = useAuth();
  const [collections, setCollections] = useState<CollectionWithRecipes[]>([]);
  const [stashedRecipes, setStashedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [expandedCol, setExpandedCol] = useState<number | null>(null);

  const fetchCollectionsData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const colRes = await getCollectionsByUser(userId);
      const savedRes = await getSavedRecipesByUser(userId);
      const recipesInStash = await Promise.all(
        savedRes.data.map(async (sr) => {
          try {
            const r = await getRecipeById(sr.recipeId);
            return r.data;
          } catch {
            return null;
          }
        })
      );

      setStashedRecipes(recipesInStash.filter((r): r is Recipe => r !== null));
      setCollections(colRes.data.map((c: Collection) => ({ ...c, recipes: [], loadingRecipes: false })));
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCollectionsData(); }, [userId]);

  const toggleExpand = async (colId: number) => {
    const isExpanding = expandedCol !== colId;
    setExpandedCol(isExpanding ? colId : null);
    if (isExpanding) {
      setCollections(prev => prev.map(c => c.id === colId ? { ...c, loadingRecipes: true } : c));
      try {
        const res = await getRecipesInCollection(colId);
        setCollections(prev => prev.map(c => c.id === colId ? { ...c, recipes: res.data, loadingRecipes: false } : c));
      } catch {
        setCollections(prev => prev.map(c => c.id === colId ? { ...c, loadingRecipes: false } : c));
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await createCollection({ userId, name: form.name, description: form.description, orderIndex: collections.length });
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchCollectionsData();
    } catch { alert("Failed to create collection"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
    } catch { alert("Failed to delete collection"); }
  };

  const handleAddRecipe = async (collectionId: number, recipeId: number) => {
    try {
      await addRecipeToCollection(collectionId, recipeId);
      const recipe = stashedRecipes.find(r => r.id === recipeId);
      if (recipe) {
        setCollections(prev => prev.map(c => c.id === collectionId ? { ...c, recipes: c.recipes.some(r => r.id === recipeId) ? c.recipes : [...c.recipes, recipe] } : c));
      }
      setAddingTo(null);
    } catch { alert("Failed — recipe may already be in this collection"); }
  };

  const handleRemoveRecipe = async (collectionId: number, recipeId: number) => {
    try {
      await removeRecipeFromCollection(collectionId, recipeId);
      setCollections(prev => prev.map(c => c.id === collectionId ? { ...c, recipes: c.recipes.filter(r => r.id !== recipeId) } : c));
    } catch { alert("Failed to remove recipe"); }
  };

  if (!userId || loading) {
    return <div className="text-center py-20 text-fw-teal font-black animate-pulse tracking-widest text-4xl" style={{ fontFamily: 'var(--font-funky)' }}>FETCHING THE VAULT...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-16 pb-8 border-b-8 border-fw-navy">
        <div>
          <h1 className="text-6xl font-black italic text-fw-navy tracking-tighter uppercase" style={{ fontFamily: 'var(--font-funky)' }}>My Collections.</h1>
          <p className="text-fw-navy/40 font-bold text-sm mt-4">
             Curated sets for your stashed treasures.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-10 py-4 border-4 border-fw-navy shadow-[6px_6px_0px_0px_rgba(14,27,43,1)] font-black uppercase tracking-widest text-xs transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${
            showForm ? "bg-fw-cream text-fw-navy" : "bg-fw-salmon text-white"
          }`}
        >
          {showForm ? "CANCEL" : "+ NEW FOLDER"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border-8 border-fw-navy shadow-[10px_10px_0px_0px_rgba(14,27,43,1)] p-12 mb-20 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[11px] font-black text-fw-navy/40 uppercase tracking-widest mb-4">Collection Title</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="E.G. MIDNIGHT SNACKS"
                className="w-full border-4 border-fw-navy p-4 text-lg font-black focus:outline-none focus:bg-fw-yellow transition-all tracking-tight"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-fw-navy/40 uppercase tracking-widest mb-4">Brief Narrative</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="WHAT'S THE STORY?"
                className="w-full border-4 border-fw-navy p-4 text-lg font-black focus:outline-none focus:bg-fw-yellow transition-all tracking-tight"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-fw-yellow text-fw-navy border-4 border-fw-navy shadow-[6px_6px_0px_0px_rgba(14,27,43,1)] px-12 py-5 font-black uppercase text-sm tracking-widest transition-all hover:bg-white active:shadow-none active:translate-x-[6px] active:translate-y-[6px]">
              INITIALIZE COLLECTION
            </button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-32 border-8 border-dashed border-fw-navy/10 rounded-[3rem]">
           <p className="text-fw-navy/20 font-black text-4xl tracking-tighter italic" style={{ fontFamily: 'var(--font-funky)' }}>NO COLLECTIONS FOUND.</p>
           <button onClick={() => setShowForm(true)} className="mt-8 text-fw-salmon font-black uppercase tracking-widest hover:underline">Start Your First Set</button>
        </div>
      ) : (
        <div className="space-y-12">
          {collections.map(col => (
            <div key={col.id} className="fw-card overflow-hidden group">
              <div className="p-8 flex items-center justify-between bg-white hover:bg-fw-cream transition-colors cursor-pointer" onClick={() => toggleExpand(col.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 border-4 border-fw-navy flex items-center justify-center transition-all ${expandedCol === col.id ? 'bg-fw-navy text-white rotate-90' : 'bg-fw-yellow text-fw-navy group-hover:bg-fw-teal group-hover:text-white'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h2 className="font-black text-4xl text-fw-navy tracking-tighter uppercase leading-none italic" style={{ fontFamily: 'var(--font-funky)' }}>
                      {col.name}.
                    </h2>
                  </div>
                  {col.description && <p className="text-fw-navy/40 text-sm font-bold ml-16 tracking-tight">{col.description}</p>}
                </div>
                
                <div className="flex gap-4 shrink-0 ml-8" onClick={e => e.stopPropagation()}>
                   <div className="flex flex-col items-end pr-4 border-r-4 border-fw-navy/5">
                      <span className="text-[9px] font-black text-fw-navy/20 uppercase tracking-widest">STASH SIZE</span>
                      <span className="text-xl font-black text-fw-navy">
                        {col.loadingRecipes || col.recipes.length > 0 ? col.recipes.length : (col.recipeCount || 0)}
                      </span>
                   </div>
                  <button onClick={() => setAddingTo(addingTo === col.id ? null : col.id)} className="bg-fw-pink text-fw-navy border-2 border-fw-navy px-5 py-2 font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-[3px_3px_0px_0px_rgba(14,27,43,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                    + ADD FROM STASH
                  </button>
                  <button onClick={() => handleDelete(col.id)} className="text-[10px] font-black uppercase tracking-widest text-fw-navy/20 hover:text-fw-salmon transition-colors">
                    DELETE
                  </button>
                </div>
              </div>

              {addingTo === col.id && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                  <RecipePicker recipes={stashedRecipes} onConfirm={rid => handleAddRecipe(col.id, rid)} onCancel={() => setAddingTo(null)} confirmLabel="ADD TO FOLDER" />
                </div>
              )}

              {expandedCol === col.id && (
                <div className="border-t-4 border-fw-navy bg-fw-cream/30 p-8 animate-in fade-in duration-700">
                  {col.loadingRecipes ? (
                    <div className="flex justify-center py-16"><div className="w-16 h-16 border-8 border-fw-teal border-t-transparent rounded-full animate-spin"></div></div>
                  ) : col.recipes.length === 0 ? (
                    <div className="py-20 text-center">
                       <p className="text-fw-navy/20 font-black text-2xl tracking-tighter uppercase italic" style={{ fontFamily: 'var(--font-funky)' }}>This folder is empty.</p>
                       <button onClick={() => setAddingTo(col.id)} className="mt-6 text-xs font-black text-fw-teal uppercase tracking-widest hover:underline decoration-4">Add some of your stashed recipes!</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {col.recipes.map(recipe => (
                        <div key={recipe.id} className="bg-white border-4 border-fw-navy p-4 flex items-center gap-4 hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(14,27,43,1)] transition-all group/item relative overflow-hidden">
                          <div className="w-24 h-24 border-4 border-fw-navy bg-fw-pink overflow-hidden shrink-0 shadow-[2px_2px_0px_0px_rgba(14,27,43,1)] relative">
                            {recipe.imageUrl ? (
                              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-fw-navy/10 font-black text-4xl italic">?</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-8 text-left">
                            <Link to={`/recipe/${recipe.id}`} className="font-black text-xl text-fw-navy hover:text-fw-salmon transition-colors block truncate italic" style={{ fontFamily: 'var(--font-funky)' }}>
                              {recipe.title}
                            </Link>
                            <p className="text-[10px] font-black text-fw-navy/40 mt-1 uppercase tracking-widest">{recipe.categoryTags || "LIMITED"}</p>
                          </div>
                          <button
                            onClick={e => { e.stopPropagation(); handleRemoveRecipe(col.id, recipe.id); }}
                            className="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 text-fw-navy/20 hover:text-fw-salmon p-2 transition-all"
                            title="Remove"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
  );
}
