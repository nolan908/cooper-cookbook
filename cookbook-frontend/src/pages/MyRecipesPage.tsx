import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipesByAuthor, deleteRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import type { Recipe } from "../api/types";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  const fetchRecipes = () => {
    if (!userId) return;
    setLoading(true);
    getRecipesByAuthor(userId)
      .then((res) => setRecipes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchRecipes, [userId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete recipe");
    }
  };

  if (!userId || loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Recipes</h1>
          <p className="text-slate-500 text-sm mt-1">Recipes you've created</p>
        </div>
        <Link
          to="/create"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-medium transition text-sm"
        >
          + New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          You haven't created any recipes yet.{" "}
          <Link to="/create" className="text-emerald-600 hover:underline">Create your first recipe</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              actions={
                <div className="flex gap-2">
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
