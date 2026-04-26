import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    prepTime: 0,
    cookTime: 0,
    servings: 0,
    imageUrl: "",
    isPublic: false,
    categoryTags: "",
    authorId: 0,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getRecipeById(parseInt(id))
      .then((res) => {
        const recipe = res.data;

        if (userId && recipe.authorId !== userId) {
          setError("You can only edit your own recipes.");
          return;
        }

        setForm({
          title: recipe.title || "",
          description: recipe.description || "",
          prepTime: recipe.prepTime || 0,
          cookTime: recipe.cookTime || 0,
          servings: recipe.servings || 0,
          imageUrl: recipe.imageUrl || "",
          isPublic: recipe.isPublic || false,
          categoryTags: recipe.categoryTags || "",
          authorId: recipe.authorId,
        });
      })
      .catch(() => setError("Failed to load recipe"))
      .finally(() => setLoading(false));
  }, [id, userId]);

  const update = (field: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSaving(true);

    try {
      await updateRecipe(parseInt(id), {
        ...form,
        id: parseInt(id),
      });

      navigate(`/recipe/${id}`);
    } catch {
      setError("Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Edit Recipe</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">
            {error}
          </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time</label>
            <input
              type="number"
              value={form.prepTime}
              onChange={(e) => update("prepTime", parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cook Time</label>
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
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category Tags</label>
          <input
            type="text"
            value={form.categoryTags}
            onChange={(e) => update("categoryTags", e.target.value)}
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
            disabled={saving || !!error}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
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