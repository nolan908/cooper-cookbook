import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function CreateRecipePage() {
  const { userId } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    imageUrl: "",
    isPublic: true,
    categoryTags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return setError("User not loaded yet, try again");
    setError("");
    setLoading(true);
    try {
      await createRecipe({ ...form, authorId: userId });
      navigate("/my-recipes");
    } catch {
      setError("Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (min)</label>
            <input
              type="number"
              value={form.prepTime}
              onChange={(e) => update("prepTime", parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cook Time (min)</label>
            <input
              type="number"
              value={form.cookTime}
              onChange={(e) => update("cookTime", parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => update("servings", parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category Tags</label>
          <input
            type="text"
            value={form.categoryTags}
            onChange={(e) => update("categoryTags", e.target.value)}
            placeholder="Italian, Pasta, Quick Meals"
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => update("isPublic", e.target.checked)}
            className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
          />
          <label className="text-sm text-slate-700">Make this recipe public</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-700 px-4 py-2 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
