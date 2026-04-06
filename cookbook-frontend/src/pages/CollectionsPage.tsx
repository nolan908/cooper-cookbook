import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
  getAllRecipes,
} from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Collection, Recipe } from "../api/types";

// Standalone component so React doesn't recreate it on parent re-render
function RecipePicker({
  recipes,
  onConfirm,
  onCancel,
  confirmLabel,
}: {
  recipes: Recipe[];
  onConfirm: (recipeId: number) => void;
  onCancel: () => void;
  confirmLabel: string;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.categoryTags || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mt-3 bg-slate-50 rounded-lg p-3 space-y-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search recipes by name or tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        autoFocus
      />
      <select
        value={selected}
        onChange={(e) => setSelected(parseInt(e.target.value))}
        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        size={Math.min(filtered.length + 1, 6)}
      >
        <option value={0}>— Select a recipe —</option>
        {filtered.map((r) => (
          <option key={r.id} value={r.id}>
            {r.title}
            {r.categoryTags ? ` (${r.categoryTags})` : ""}
            {r.prepTime ? ` — ${r.prepTime + (r.cookTime || 0)}min total` : ""}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!selected) return alert("Select a recipe first");
            onConfirm(selected);
          }}
          className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded transition"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="text-sm text-slate-400 hover:text-slate-600 px-3 py-1.5 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Per-collection: track which recipes are inside
interface CollectionWithRecipes extends Collection {
  recipes: Recipe[];
  loadingRecipes: boolean;
}

export default function CollectionsPage() {
  const { userId } = useAuth();
  const [collections, setCollections] = useState<CollectionWithRecipes[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [expandedCol, setExpandedCol] = useState<number | null>(null);

  const fetchCollections = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [colRes, recRes] = await Promise.all([
        getCollectionsByUser(userId),
        getAllRecipes(),
      ]);
      // Only show public recipes + user's own recipes in the picker
      setAllRecipes(
        recRes.data.filter(
          (r: Recipe) => r.isPublic || r.authorId === userId,
        ),
      );
      // Initialize collections with empty recipe arrays
      setCollections(
        colRes.data.map((c: Collection) => ({
          ...c,
          recipes: [],
          loadingRecipes: false,
        })),
      );
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  // Load recipes for a collection when expanded
  // The backend doesn't have a "get recipes by collection" endpoint,
  // so we try adding each recipe and track which ones are already there.
  // Better approach: just track locally what we add/remove.
  const toggleExpand = (colId: number) => {
    setExpandedCol(expandedCol === colId ? null : colId);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await createCollection({
        userId,
        name: form.name,
        description: form.description,
        orderIndex: collections.length,
      });
      setForm({ name: "", description: "" });
      setShowForm(false);
      fetchCollections();
    } catch {
      alert("Failed to create collection");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete collection");
    }
  };

  const handleAddRecipe = async (collectionId: number, recipeId: number) => {
    try {
      await addRecipeToCollection(collectionId, recipeId);
      // Update local state: add the recipe to this collection
      const recipe = allRecipes.find((r) => r.id === recipeId);
      if (recipe) {
        setCollections((prev) =>
          prev.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  recipes: c.recipes.some((r) => r.id === recipeId)
                    ? c.recipes
                    : [...c.recipes, recipe],
                }
              : c,
          ),
        );
      }
      setAddingTo(null);
    } catch {
      alert("Failed — recipe may already be in this collection");
    }
  };

  const handleRemoveRecipe = async (collectionId: number, recipeId: number) => {
    try {
      await removeRecipeFromCollection(collectionId, recipeId);
      // Update local state: remove the recipe from this collection
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? { ...c, recipes: c.recipes.filter((r) => r.id !== recipeId) }
            : c,
        ),
      );
    } catch {
      alert("Failed to remove recipe");
    }
  };

  if (!userId || loading) {
    return <div className="text-center py-12 text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Collections</h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize your recipes into folders
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-medium transition text-sm"
        >
          + New Collection
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white shadow-md rounded-lg p-4 mb-6 flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Create
          </button>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No collections yet. Create one to organize your recipes!
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white shadow-md rounded-lg border border-slate-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between">
                <button
                  onClick={() => toggleExpand(col.id)}
                  className="text-left flex-1"
                >
                  <h2 className="font-bold text-lg text-slate-800">
                    {col.name}
                    <span className="text-sm font-normal text-slate-400 ml-2">
                      ({col.recipes.length} recipe
                      {col.recipes.length !== 1 ? "s" : ""})
                    </span>
                  </h2>
                  {col.description && (
                    <p className="text-slate-500 text-sm mt-1">
                      {col.description}
                    </p>
                  )}
                </button>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => toggleExpand(col.id)}
                    className="text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                  >
                    {expandedCol === col.id ? "Collapse" : "View Recipes"}
                  </button>
                  <button
                    onClick={() => {
                      setAddingTo(addingTo === col.id ? null : col.id);
                    }}
                    className="text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded transition"
                  >
                    + Add Recipe
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Add recipe picker */}
              {addingTo === col.id && (
                <div className="px-5 pb-4">
                  <RecipePicker
                    recipes={allRecipes}
                    onConfirm={(recipeId) => handleAddRecipe(col.id, recipeId)}
                    onCancel={() => setAddingTo(null)}
                    confirmLabel="Add to Collection"
                  />
                </div>
              )}

              {/* Expanded: show recipes in this collection */}
              {expandedCol === col.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-5">
                  {col.recipes.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No recipes in this collection yet. Click "+ Add Recipe"
                      above.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {col.recipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="bg-white rounded-lg p-3 flex items-center justify-between border border-slate-200"
                        >
                          <div className="flex-1">
                            <Link
                              to={`/recipe/${recipe.id}`}
                              className="font-medium text-slate-800 hover:text-emerald-600 transition"
                            >
                              {recipe.title}
                            </Link>
                            <div className="flex gap-2 mt-1 text-xs text-slate-500">
                              {recipe.prepTime > 0 && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  Prep: {recipe.prepTime}min
                                </span>
                              )}
                              {recipe.cookTime > 0 && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  Cook: {recipe.cookTime}min
                                </span>
                              )}
                              {recipe.categoryTags && (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                  {recipe.categoryTags}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveRecipe(col.id, recipe.id)
                            }
                            className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition shrink-0 ml-3"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
