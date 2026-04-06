import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedRecipesByUser, deleteSavedRecipe, getRecipeById } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { SavedRecipe, Recipe } from "../api/types";

interface SavedWithRecipe extends SavedRecipe {
  recipe?: Recipe;
}

export default function SavedRecipesPage() {
  const { userId } = useAuth();
  const [saved, setSaved] = useState<SavedWithRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getSavedRecipesByUser(userId)
      .then(async (res) => {
        const enriched = await Promise.all(
          res.data.map(async (sr) => {
            try {
              const recipeRes = await getRecipeById(sr.recipeId);
              return { ...sr, recipe: recipeRes.data };
            } catch {
              return sr;
            }
          }),
        );
        setSaved(enriched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (id: number) => {
    if (!confirm("Remove this saved recipe?")) return;
    try {
      await deleteSavedRecipe(id);
      setSaved((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to remove saved recipe");
    }
  };

  if (!userId || loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Saved Recipes</h1>
        <p className="text-slate-500 text-sm mt-1">Recipes you've bookmarked from other users</p>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No saved recipes yet.{" "}
          <Link to="/" className="text-emerald-600 hover:underline">Browse public recipes</Link> and save ones you like!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((sr) => (
            <div
              key={sr.id}
              className="bg-white shadow-md rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-4">
                <h2 className="font-bold text-lg text-slate-800">
                  <Link to={`/recipe/${sr.recipeId}`} className="hover:text-emerald-600 transition">
                    {sr.recipe?.title || `Recipe #${sr.recipeId}`}
                  </Link>
                </h2>
                {sr.recipe?.description && (
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{sr.recipe.description}</p>
                )}
                {sr.recipe && (
                  <div className="flex gap-2 mt-3 text-xs text-slate-500">
                    {sr.recipe.prepTime > 0 && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        Prep: {sr.recipe.prepTime}min
                      </span>
                    )}
                    {sr.recipe.cookTime > 0 && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        Cook: {sr.recipe.cookTime}min
                      </span>
                    )}
                    {sr.recipe.categoryTags && (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                        {sr.recipe.categoryTags}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    By Author #{sr.originalAuthorId}
                  </span>
                  <button
                    onClick={() => handleRemove(sr.id)}
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
