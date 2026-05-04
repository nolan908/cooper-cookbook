import { Link } from "react-router-dom";
import type { Recipe } from "../api/types";

interface Props {
 recipe: Recipe;
 actions?: React.ReactNode;
 onEdit?: (id: number) => void;
 hideAuthor?: boolean;
}

export default function RecipeCard({ recipe, actions, onEdit, hideAuthor }: Props) {
 return (
 <div className="fw-card group flex flex-col h-full bg-white text-left rounded-[2rem]">
 <div className=" relative border-b-2 border-fw-navy/5 overflow-hidden aspect-[4/3]">
 {recipe.imageUrl ? (
 <img
 src={recipe.imageUrl}
 alt={recipe.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
 ) : (
 <div className="w-full h-full bg-fw-yellow/10 flex items-center justify-center text-fw-navy/20">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
 <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
 <line x1="6" y1="17" x2="18" y2="17" />
 </svg>
 </div>
 )}
 {recipe.categoryTags && (
 <div className="absolute top-4 left-4 bg-fw-yellow text-fw-navy border-2 border-fw-navy/10 px-3 py-1 text-[10px] font-black tracking-widest rounded-lg z-10 shadow-sm uppercase">
 {recipe.categoryTags.split(',')[0]}
 </div>
 )}
 </div>

 <div className="p-6 flex-1 flex flex-col">
 <Link to={`/recipe/${recipe.id}`}>
 <h3 className="text-3xl font-black italic text-fw-navy leading-none mb-3 hover:text-fw-salmon transition-colors cursor-pointer tracking-tighter" style={{ fontFamily: 'var(--font-funky)' }}>
 {recipe.title}
 </h3>
 </Link>
 <p className="text-fw-navy/70 text-[14px] line-clamp-3 mb-8 font-bold tracking-tight leading-tight">
 {recipe.description || 'No information available'}
 </p>
 
 <div className="mt-auto flex flex-col gap-6">
 <div className="flex items-center justify-between border-t-2 border-fw-navy/5 pt-6">
 <div className="flex items-center gap-3">
 {recipe.forkedFromRecipeId ? (
 <>
 <div className="w-10 h-10 rounded-full border-2 border-fw-navy/10 overflow-hidden bg-fw-yellow shadow-sm flex items-center justify-center">
 <svg viewBox="0 0 24 24" className="w-6 h-6 text-fw-navy" fill="currentColor">
 <path d="M18 2h-1v7c0 .55-.45 1-1 1s-1-.45-1-1V2h-1v7c0 .55-.45 1-1 1s-1-.45-1-1V2h-1v7c0 .55-.45 1-1 1s-1-.45-1-1V2H7v7c0 2.45 1.76 4.47 4.08 4.91L10.42 22h3.16l-0.66-8.09c2.32-.44 4.08-2.46 4.08-4.91V2z" />
 </svg>
 </div>
 <div className="flex flex-col">
 <span className="text-[8px] font-black text-fw-navy/30 tracking-widest leading-none mb-0.5">Forked from</span>
 {recipe.forkedFromRecipeIsPublic !== false ? (
   <Link to={`/recipe/${recipe.forkedFromRecipeId}`} className="text-[10px] font-black tracking-widest text-fw-navy/60 italic leading-none hover:text-fw-teal">
     {recipe.originalAuthorDisplayName}
   </Link>
 ) : (
   <span className="text-[10px] font-black tracking-widest text-fw-navy/60 italic leading-none">
     {recipe.originalAuthorDisplayName} (Privated)
   </span>
 )}
 </div>
 </>
 ) : !hideAuthor && (
 <>
 <div className="w-10 h-10 rounded-full border-2 border-fw-navy/10 overflow-hidden bg-fw-yellow shadow-sm flex items-center justify-center">
 {recipe.authorProfilePictureUrl ? (
 <img src={recipe.authorProfilePictureUrl} alt="author" className="w-full h-full object-cover"/>
 ) : (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-fw-navy">
 <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
 <line x1="6" y1="17" x2="18" y2="17" />
 </svg>
 )}
 </div>
 <span className="text-[10px] font-black tracking-widest text-fw-navy/40 italic">
 By {recipe.authorDisplayName}
 </span>
 </>
 )}
 </div>
 
 <div className="text-[10px] font-black text-fw-navy/30 tracking-widest">
 {((recipe.prepTime || 0) + (recipe.cookTime || 0)) > 0 && (
   <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} MIN</span>
 )}
 </div>
 </div>

 <div className="flex flex-col gap-3">
 {onEdit && (
 <Link 
 to={`/recipes/${recipe.id}/edit`} 
 className="w-full text-center bg-fw-teal text-white text-[10px] font-black tracking-widest py-3 hover:bg-fw-navy transition-all border-2 border-fw-navy/10 shadow-sm rounded-xl" >
 Edit Recipe
 </Link>
 )}
 <div className="flex gap-3">
 {actions}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
