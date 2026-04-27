import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeById, saveRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Recipe } from "../api/types";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [forking, setForking] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getRecipeById(parseInt(id))
      .then((res) => setRecipe(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    if (!recipe || !userId) return;
    try {
      await saveRecipe({ userId, recipeId: recipe.id, originalAuthorId: recipe.authorId });
      setSaved(true);
    } catch { alert("Already saved!"); }
  };

  const handleForkRecipe = async () => {
    if (!recipe || !userId) return;
    try {
      setForking(true);
      const response = await fetch(`http://localhost:8080/api/recipes/${recipe.id}/fork?userId=${userId}`, { method: "POST" });
      const forkedRecipe = await response.json();
      navigate(`/recipes/${forkedRecipe.id}/edit`);
    } catch (error) { alert("Could not fork."); } finally { setForking(false); }
  };

  if (loading || !recipe) {
    return <div className="text-center py-20 text-fw-teal font-black animate-bounce uppercase">Hooking your fish...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="fw-btn-secondary mb-12 !py-2 !px-4">← Back to Shop</button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image & Meta */}
        <div className="space-y-8">
           <div className="border-4 border-fw-navy shadow-fw overflow-hidden bg-white">
              {recipe.imageUrl ? (
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full aspect-square bg-fw-pink"></div>
              )}
           </div>
           
           <div className="bg-fw-yellow border-4 border-fw-navy p-8 shadow-fw">
              <h3 className="text-2xl font-black mb-6 italic tracking-tighter">SPECS.</h3>
              <div className="grid grid-cols-2 gap-8">
                 <div className="border-l-4 border-fw-navy pl-4">
                    <p className="text-[10px] font-black uppercase text-fw-navy/40 mb-1">PREP TIME</p>
                    <p className="text-3xl font-black text-fw-navy">{recipe.prepTime || '—'} MIN</p>
                 </div>
                 <div className="border-l-4 border-fw-navy pl-4">
                    <p className="text-[10px] font-black uppercase text-fw-navy/40 mb-1">COOK TIME</p>
                    <p className="text-3xl font-black text-fw-navy">{recipe.cookTime || '—'} MIN</p>
                 </div>
                 <div className="border-l-4 border-fw-navy pl-4">
                    <p className="text-[10px] font-black uppercase text-fw-navy/40 mb-1">SERVINGS</p>
                    <p className="text-3xl font-black text-fw-navy">{recipe.servings || '—'} PPL</p>
                 </div>
                 <div className="border-l-4 border-fw-navy pl-4">
                    <p className="text-[10px] font-black uppercase text-fw-navy/40 mb-1">ORIGIN</p>
                    <p className="text-xl font-black text-fw-navy truncate">{recipe.authorDisplayName}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
           <div className="mb-8">
              <span className="bg-fw-teal text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-fw-navy mb-4 inline-block shadow-[2px_2px_0px_0px_rgba(14,27,43,1)]">
                {recipe.categoryTags || 'CANNED GOOD'}
              </span>
              <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-fw-navy mb-6 uppercase">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-4 py-4 border-y-2 border-fw-navy/10">
                 <div className="w-12 h-12 rounded-full border-2 border-fw-navy overflow-hidden">
                    <img src={recipe.authorProfilePictureUrl} className="w-full h-full object-cover" />
                 </div>
                 <p className="font-black uppercase text-xs tracking-widest text-fw-navy/60">Contributed by {recipe.authorDisplayName}</p>
              </div>
           </div>

           <p className="text-xl font-bold leading-snug mb-10 text-fw-navy/80 uppercase tracking-tight">
             {recipe.description}
           </p>

           <div className="flex gap-4 mb-16">
              <button onClick={handleSave} disabled={saved} className="fw-btn-primary flex-1 !text-sm">
                {saved ? "STASHED" : "ADD TO STASH"}
              </button>
              {recipe.authorId !== userId && (
                 <button onClick={handleForkRecipe} disabled={forking} className="fw-btn-secondary flex-1 !text-sm">
                   {forking ? "FORKING..." : "FORK IT"}
                 </button>
              )}
              {recipe.authorId === userId && (
                 <Link to={`/recipes/${recipe.id}/edit`} className="fw-btn-secondary flex-1 !text-sm text-center">
                   EDIT
                 </Link>
              )}
           </div>

           <div className="space-y-12">
              <section>
                 <h2 className="text-4xl font-black italic mb-8 underline decoration-fw-salmon underline-offset-8">INGREDIENTS.</h2>
                 <ul className="space-y-4">
                    {recipe.ingredients?.map((ing, i) => (
                      <li key={i} className="flex items-center gap-4 text-lg font-black uppercase border-b-2 border-fw-navy/5 pb-2">
                         <span className="text-fw-salmon shrink-0 w-24">{ing.quantity} {ing.unit}</span>
                         <span className="text-fw-navy">{ing.name}</span>
                      </li>
                    ))}
                 </ul>
              </section>

              <section>
                 <h2 className="text-4xl font-black italic mb-8 underline decoration-fw-teal underline-offset-8">METHOD.</h2>
                 <ol className="space-y-10">
                    {recipe.steps?.map((step, i) => (
                      <li key={i} className="flex gap-6 group">
                         <span className="text-5xl font-black text-fw-navy/10 group-hover:text-fw-salmon transition-colors italic">{i+1}</span>
                         <p className="text-xl font-bold uppercase tracking-tight leading-tight pt-2">{step.instruction}</p>
                      </li>
                    ))}
                 </ol>
              </section>
           </div>

           {recipe.forkedFromRecipeId && (
              <div className="mt-20 p-6 bg-white border-2 border-fw-navy border-dashed text-[10px] font-black uppercase tracking-widest text-fw-navy/40">
                Lineage: Forked from {recipe.forkedFromRecipeTitle} by {recipe.originalAuthorDisplayName}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
