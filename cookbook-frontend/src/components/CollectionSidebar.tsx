import { Link } from "react-router-dom";
import { useState } from "react";
import type { Recipe, Collection } from "../api/types";
import { 
  createCollection, 
  deleteCollection, 
  removeRecipeFromCollection 
} from "../api/client";

interface CollectionWithRecipes extends Collection {
  recipes: Recipe[];
  loadingRecipes: boolean;
}

interface Props {
  userId: number;
  collections: CollectionWithRecipes[];
  expandedCol: number | null;
  onToggleExpand: (id: number) => void;
  onRefresh: () => void;
}

export default function CollectionSidebar({ 
  userId, 
  collections, 
  expandedCol, 
  onToggleExpand, 
  onRefresh 
}: Props) {
  const [showColForm, setShowForm] = useState(false);
  const [colForm, setForm] = useState({ name: "", description: "" });

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCollection({ userId, name: colForm.name, description: colForm.description, orderIndex: collections.length });
      setForm({ name: "", description: "" });
      setShowForm(false);
      onRefresh();
    } catch { alert("Failed to create collection"); }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      onRefresh();
    } catch { alert("Failed to delete collection"); }
  };

  const handleRemoveRecipe = async (collectionId: number, recipeId: number) => {
    try {
      await removeRecipeFromCollection(collectionId, recipeId);
      onRefresh();
    } catch { alert("Failed to remove recipe"); }
  };

  return (
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
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-fw-yellow/30 transition-colors" onClick={() => onToggleExpand(col.id)}>
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
                          <div key={recipe.id} className="flex items-center gap-3 bg-fw-cream/20 p-2 rounded-lg border border-fw-navy/5 group/item">
                            <div className="w-10 h-10 rounded-md border border-fw-navy/10 bg-white overflow-hidden shrink-0">
                              <img src={recipe.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <Link to={`/recipe/${recipe.id}`} className="flex-1 text-[10px] font-black uppercase hover:text-fw-salmon leading-tight">
                              {recipe.title}
                            </Link>
                            <button 
                              onClick={() => handleRemoveRecipe(col.id, recipe.id)}
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
  );
}
