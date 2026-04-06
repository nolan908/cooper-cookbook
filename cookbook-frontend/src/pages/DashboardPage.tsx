import { useEffect, useState } from "react";
import { getPublicRecipes, saveRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";
import type { Recipe } from "../api/types";

export default function DashboardPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { isLoggedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    getPublicRecipes()
      .then((res) => {
        setRecipes(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.categoryTags || "").toLowerCase().includes(q),
      ),
    );
  }, [search, recipes]);

  const handleSave = async (recipe: Recipe) => {
    if (!userId) return alert("User ID not loaded yet, try again");
    try {
      await saveRecipe({
        userId,
        recipeId: recipe.id,
        originalAuthorId: recipe.authorId,
      });
      setSavedMsg(recipe.id);
      setTimeout(() => setSavedMsg(null), 2000);
    } catch {
      alert("Failed to save recipe — you may have already saved it");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading recipes...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Public Recipes</h1>
          <p className="text-slate-500 text-sm mt-1">Browse recipes shared by the community</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, description, or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-slate-300 rounded px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          {search ? "No recipes match your search." : "No public recipes yet. Be the first to create one!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
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
                    onClick={() => handleSave(recipe)}
                    className="text-sm bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded transition"
                  >
                    {savedMsg === recipe.id ? "Saved!" : "Save to Cookbook"}
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
