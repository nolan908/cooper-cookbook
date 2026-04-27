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
      <div className="relative border-b-2 border-fw-navy/5 overflow-hidden aspect-[4/3]">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-fw-pink flex items-center justify-center text-fw-navy/10">
             <svg className="w-20 h-20 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-fw-yellow text-fw-navy border-2 border-fw-navy/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg z-10 shadow-sm">
          {recipe.categoryTags?.split(',')[0] || 'LIMITED'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <Link to={`/recipe/${recipe.id}`}>
          <h3 className="text-3xl font-black italic text-fw-navy leading-none mb-3 hover:text-fw-salmon transition-colors cursor-pointer tracking-tighter uppercase" style={{ fontFamily: 'var(--font-funky)' }}>
            {recipe.title}
          </h3>
        </Link>
        <p className="text-fw-navy/70 text-[14px] line-clamp-3 mb-8 font-bold uppercase tracking-tight leading-tight">
          {recipe.description}
        </p>
        
        <div className="mt-auto flex flex-col gap-6">
          <div className="flex items-center justify-between border-t-2 border-fw-navy/5 pt-6">
            <div className="flex items-center gap-3">
              {recipe.forkedFromRecipeId ? (
                <>
                   <div className="w-10 h-10 rounded-full border-2 border-fw-navy/10 overflow-hidden bg-fw-yellow shadow-sm">
                    <svg className="w-full h-full p-2 text-fw-navy" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-fw-navy/30 tracking-widest leading-none mb-0.5">Forked from</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-fw-navy/60 italic leading-none">
                      {recipe.originalAuthorDisplayName}
                    </span>
                  </div>
                </>
              ) : !hideAuthor && (
                <>
                  <div className="w-10 h-10 rounded-full border-2 border-fw-navy/10 overflow-hidden bg-fw-teal shadow-sm">
                    {recipe.authorProfilePictureUrl ? (
                      <img src={recipe.authorProfilePictureUrl} alt="author" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white uppercase">
                        {recipe.authorDisplayName?.substring(0,1)}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-fw-navy/40 italic">
                    By {recipe.authorDisplayName}
                  </span>
                </>
              )}
            </div>
            
            <div className="text-[10px] font-black uppercase text-fw-navy/30 tracking-widest">
              {recipe.prepTime && <span>{recipe.prepTime + (recipe.cookTime || 0)} MIN</span>}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {onEdit && (
               <Link 
                to={`/recipes/${recipe.id}/edit`} 
                className="w-full text-center bg-fw-teal text-white text-[10px] font-black uppercase tracking-widest py-3 hover:bg-fw-navy transition-all border-2 border-fw-navy/10 shadow-sm rounded-xl"
              >
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
