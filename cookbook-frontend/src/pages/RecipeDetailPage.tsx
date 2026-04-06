import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, saveRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Recipe } from "../api/types";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getRecipeById(parseInt(id))
      .then((res) => setRecipe(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!recipe || !userId) return;
    try {
      await saveRecipe({
        userId,
        recipeId: recipe.id,
        originalAuthorId: recipe.authorId,
      });
      setSaved(true);
    } catch {
      alert("Failed to save — you may have already saved this recipe");
    }
  };

  if (loading || !recipe) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-500 hover:text-slate-700 text-sm mb-4 transition"
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{recipe.title}</h1>
              {recipe.categoryTags && (
                <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded">
                  {recipe.categoryTags}
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saved}
              className={`text-sm px-4 py-2 rounded font-medium transition ${
                saved
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {saved ? "Saved!" : "Save to Cookbook"}
            </button>
          </div>

          <p className="text-slate-600 mt-4 leading-relaxed">
            {recipe.description || "No description provided."}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {recipe.prepTime || "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Prep (min)</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {recipe.cookTime || "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Cook (min)</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {recipe.servings || "—"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Servings</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-400 flex gap-4">
            <span>Recipe ID: {recipe.id}</span>
            <span>Author ID: {recipe.authorId}</span>
            <span>{recipe.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
