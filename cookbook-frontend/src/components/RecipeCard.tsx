import type { Recipe } from "../api/types";

interface Props {
  recipe: Recipe;
  actions?: React.ReactNode;
}

export default function RecipeCard({ recipe, actions }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800">{recipe.title}</h3>
        <p className="text-slate-500 text-sm mt-1 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-500">
          {recipe.prepTime > 0 && (
            <span className="bg-slate-100 px-2 py-1 rounded">
              Prep: {recipe.prepTime}min
            </span>
          )}
          {recipe.cookTime > 0 && (
            <span className="bg-slate-100 px-2 py-1 rounded">
              Cook: {recipe.cookTime}min
            </span>
          )}
          {recipe.servings > 0 && (
            <span className="bg-slate-100 px-2 py-1 rounded">
              Serves: {recipe.servings}
            </span>
          )}
          {recipe.categoryTags && (
            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
              {recipe.categoryTags}
            </span>
          )}
        </div>
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
