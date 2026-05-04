import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeById, saveRecipe, getSavedRecipesByUser, deleteSavedRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Recipe, Ingredient, Step } from "../api/types";

export default function RecipeDetailPage() {
 const { id } = useParams<{ id: string }>();
 const [recipe, setRecipe] = useState<Recipe | null>(null);
 const [loading, setLoading] = useState(true);
 const [savedId, setSavedId] = useState<number | null>(null);
 const [forking, setForking] = useState(false);
 const [imgError, setImgError] = useState(false);
 const [authorImgError, setAuthorImgError] = useState(false);
 const { userId } = useAuth();
 const navigate = useNavigate();

 useEffect(() => {
 if (!id) return;
 
 const fetchData = async () => {
 try {
 const [recipeRes, savedRes] = await Promise.all([
 getRecipeById(parseInt(id)),
 userId ? getSavedRecipesByUser(userId) : Promise.resolve({ data: [] })
 ]);
 
 setRecipe(recipeRes.data);
 
 const stashEntry = savedRes.data.find(sr => sr.recipeId === parseInt(id));
 setSavedId(stashEntry ? stashEntry.id : null);
 } catch {
 navigate("/");
 } finally {
 setLoading(false);
 }
 };

 fetchData();
 }, [id, userId, navigate]);

 const handleToggleStash = async () => {
 if (!recipe || !userId) return;
 
 try {
 if (savedId) {
 await deleteSavedRecipe(savedId);
 setSavedId(null);
 } else {
 await saveRecipe({ userId, recipeId: recipe.id, originalAuthorId: recipe.authorId });
 // Re-fetch to get the new savedId
 const savedRes = await getSavedRecipesByUser(userId);
 const stashEntry = savedRes.data.find(sr => sr.recipeId === recipe.id);
 setSavedId(stashEntry ? stashEntry.id : null);
 }
 } catch { 
 alert(savedId ? "Failed to unstash" : "Already saved!"); 
 }
 };

 const handleForkRecipe = async () => {
 if (!recipe || !userId) return;
 try {
 setForking(true);
 const response = await fetch(`/api/recipes/${recipe.id}/fork?userId=${userId}`, { method:"POST"});
 const forkedRecipe = await response.json();
 navigate(`/recipes/${forkedRecipe.id}/edit`);
 } catch (error) { alert("Could not fork."); } finally { setForking(false); }
 };

  if (loading || !recipe) {
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
 <div className="max-w-[1600px] mx-auto px-4 py-12">
 <button onClick={() => navigate("/browse")} className="fw-btn-secondary mb-12 !py-2 !px-4">← Back to browse</button>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
 {/* Left: Image & Meta */}
 <div className="space-y-8">
 <div className="border-4 border-fw-navy shadow-fw overflow-hidden bg-white">
 {recipe.imageUrl && !imgError ? (
 <img 
   src={recipe.imageUrl} 
   alt={recipe.title} 
   className="w-full h-auto object-cover"
   onError={() => setImgError(true)}
 />
 ) : (
 <div className="w-full aspect-square bg-fw-yellow/10 flex items-center justify-center text-fw-navy/20">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32">
 <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
 <line x1="6" y1="17" x2="18" y2="17" />
 </svg>
 </div>
 )}
 </div>
 
 <div className="bg-fw-yellow border-4 border-fw-navy p-8 shadow-fw">
 <h3 className="text-2xl font-black mb-6 italic tracking-tighter">OVERVIEW</h3>
 <div className="grid grid-cols-2 gap-8">
 <div className="border-l-4 border-fw-navy pl-4 overflow-hidden">
 <p className="text-[10px] font-black text-fw-navy/40 mb-1">PREP TIME</p>
 <p className="text-3xl font-black text-fw-navy break-words">{recipe.prepTime || '—'} MIN</p>
 </div>
 <div className="border-l-4 border-fw-navy pl-4 overflow-hidden">
 <p className="text-[10px] font-black text-fw-navy/40 mb-1">COOK TIME</p>
 <p className="text-3xl font-black text-fw-navy break-words">{recipe.cookTime || '—'} MIN</p>
 </div>
 <div className="border-l-4 border-fw-navy pl-4 overflow-hidden">
 <p className="text-[10px] font-black text-fw-navy/40 mb-1">SERVINGS</p>
 <p className="text-3xl font-black text-fw-navy break-words">{recipe.servings || '—'} PPL</p>
 </div>
 <div className="border-l-4 border-fw-navy pl-4 overflow-hidden">
 <p className="text-[10px] font-black text-fw-navy/40 mb-1">ORIGIN</p>
 <p className="text-xl font-black text-fw-navy truncate hover:whitespace-normal break-words">{recipe.authorDisplayName}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right: Content */}
 <div className="flex flex-col">
 <div className="mb-8">
 <div className="flex flex-wrap gap-2 mb-4">
  {recipe.categoryTags && recipe.categoryTags.split(',').map((tag, index) => (
    <span key={index} className="bg-fw-teal text-white px-3 py-1 text-[10px] font-black tracking-widest border-2 border-fw-navy inline-block shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] uppercase">
      {tag.trim()}
    </span>
  ))}
 </div>
 <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-fw-navy mb-6 break-words">
 {recipe.title}
 </h1>
 <div className="flex items-center gap-4 py-4 border-y-2 border-fw-navy/10">
 <div className="w-12 h-12 rounded-full border-2 border-fw-navy overflow-hidden bg-fw-yellow flex items-center justify-center">
 {recipe.authorProfilePictureUrl && !authorImgError ? (
 <img 
   src={recipe.authorProfilePictureUrl} 
   className="w-full h-full object-cover"
   onError={() => setAuthorImgError(true)}
 />
 ) : (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-fw-navy">
 <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
 <line x1="6" y1="17" x2="18" y2="17" />
 </svg>
 )}
 </div>
 <p className="font-black text-xs tracking-widest text-fw-navy/60">Contributed by {recipe.authorDisplayName}</p>
 </div>
 </div>

 <p className="text-xl font-bold leading-snug mb-10 text-fw-navy/80 tracking-tight break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
 {recipe.description || 'No information available'}
 </p>

 <div className="flex gap-4 mb-16">
 <button onClick={handleToggleStash} className={`fw-btn-primary flex-1 !text-sm ${savedId ? "bg-fw-teal" : ""}`}>
 {savedId ? "UNSTASH" : "ADD TO STASH"}
 </button>
 {recipe.authorId !== userId && (
 <button 
 onClick={handleForkRecipe} 
 disabled={forking} 
 className="fw-btn-secondary flex-1 !text-sm text-center"
 >
 {forking ? "FORKING..." : "FORK"}
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
 <h2 className="text-2xl font-black italic mb-8 underline decoration-fw-salmon underline-offset-8">INGREDIENTS</h2>
 <ul className="space-y-4">
 {recipe.ingredients && recipe.ingredients.length > 0 ? (
   recipe.ingredients.map((ing: Ingredient, i: number) => (
     <li key={i} className="flex items-start gap-4 text-lg font-black border-b-2 border-fw-navy/5 pb-2">
       <span className="text-fw-salmon shrink-0 w-32 break-words [overflow-wrap:anywhere]">{ing.quantity} {ing.unit}</span>
       <span className="text-fw-navy break-words [overflow-wrap:anywhere] flex-1">{ing.name}</span>
     </li>
   ))
 ) : (
   <p className="text-fw-navy/30 font-bold italic">No information available</p>
 )}
 </ul>
 </section>

 <section>
 <h2 className="text-4xl font-black italic mb-8 underline decoration-fw-teal underline-offset-8">STEPS</h2>
 <ol className="space-y-10">
 {recipe.steps && recipe.steps.length > 0 ? (
   recipe.steps.map((step: Step, i: number) => (
     <li key={i} className="flex gap-6 group">
       <span className="text-5xl font-black text-fw-navy/10 group-hover:text-fw-salmon transition-colors italic shrink-0">{i+1}</span>
       <p className="text-xl font-bold tracking-tight leading-tight pt-2 break-all flex-1 whitespace-pre-wrap">{step.instruction}</p>
     </li>
   ))
 ) : (
   <p className="text-fw-navy/30 font-bold italic">No information available</p>
 )}
 </ol>
 </section>
 </div>

 {recipe.forkedFromRecipeId && (
 <div className="mt-20 p-6 bg-white border-2 border-fw-navy border-dashed text-[10px] font-black tracking-widest text-fw-navy/40">
   Lineage: Forked from {" "}
   {recipe.forkedFromRecipeTitle ? (
     recipe.forkedFromRecipeIsPublic !== false ? (
       <Link to={`/recipe/${recipe.forkedFromRecipeId}`} className="text-fw-teal hover:underline uppercase">
         {recipe.forkedFromRecipeTitle}
       </Link>
     ) : (
       <span className="italic">{recipe.forkedFromRecipeTitle} (Privated)</span>
     )
   ) : (
     <span className="italic text-fw-salmon uppercase">Recipe deleted by previous authors</span>
   )}
   {" "} by {recipe.originalAuthorDisplayName}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
