import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Ingredient, Step } from "../api/types";
import ImagePicker from "../components/ImagePicker";
import TagInput from "../components/TagInput";

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

  const [ingredients, setIngredients] = useState<Omit<Ingredient, "id" | "recipeId">[]>([]);
  const [steps, setSteps] = useState<Omit<Step, "id" | "recipeId">[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addIngredient = () =>
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "", orderIndex: ingredients.length }]);

  const updateIngredient = (index: number, field: string, value: string | number) => {
    const next = [...ingredients];
    if (field === "quantity") {
      const val = typeof value === "string" ? parseFloat(value) : value;
      (next[index] as any)[field] = isNaN(val) ? 0 : Math.max(0, val);
    } else {
      (next[index] as any)[field] = value;
    }
    setIngredients(next);
  };

  const removeIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const addStep = () =>
    setSteps([...steps, { instruction: "", stepNumber: steps.length + 1 }]);

  const updateStep = (index: number, value: string) => {
    const next = [...steps];
    next[index].instruction = value;
    setSteps(next);
  };

  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return setError("User not loaded yet, try again");
    setError("");
    setLoading(true);
    try {
      await createRecipe({
        ...form,
        authorId: userId,
        ingredients: ingredients as any,
        steps: steps as any,
      });
      navigate("/my-recipes");
    } catch {
      setError("Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">{error}</div>
        )}

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 break-words"
              required
              placeholder="e.g. World's Best Lasagna"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 break-words"
              placeholder="Tell us about your recipe..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (min)</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={form.prepTime}
                onChange={(e) => update("prepTime", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cook Time (min)</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={form.cookTime}
                onChange={(e) => update("cookTime", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={form.servings}
                onChange={(e) => update("servings", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-slate-700">Ingredients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Add Ingredient
            </button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Qty"
                  value={ing.quantity || ""}
                  onChange={(e) => updateIngredient(idx, "quantity", e.target.value)}
                  className="w-20 border border-slate-300 rounded px-2 py-1.5 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                  className="w-24 border border-slate-300 rounded px-2 py-1.5 text-sm break-words"
                  maxLength={25}
                />
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm break-words"
                  required
                  maxLength={70}
                />
                <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-600 p-1.5">✕</button>
              </div>
            ))}
            {ingredients.length === 0 && <p className="text-sm text-slate-400 italic">No ingredients added yet.</p>}
          </div>
        </section>

        {/* Steps */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-slate-700">Preparation Steps</h2>
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Add Step
            </button>
          </div>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1.5 shrink-0">
                  {idx + 1}
                </span>
                <textarea
                  placeholder="Instruction details..."
                  value={step.instruction}
                  onChange={(e) => updateStep(idx, e.target.value)}
                  rows={2}
                  className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 break-words"
                  required
                />
                <button type="button" onClick={() => removeStep(idx)} className="text-red-400 hover:text-red-600 p-1.5">✕</button>
              </div>
            ))}
            {steps.length === 0 && <p className="text-sm text-slate-400 italic">No steps added yet.</p>}
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <ImagePicker
              label="Visual Documentation"
              value={form.imageUrl}
              onChange={(val) => update("imageUrl", val)}
              type="recipe"
            />
            <TagInput
              label="Category Tags"
              value={form.categoryTags}
              onChange={(val) => update("categoryTags", val)}
              placeholder="e.g. Dinner, Pasta, Spicy..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => update("isPublic", e.target.checked)}
              className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
              id="isPublic"
            />
            <label htmlFor="isPublic" className="text-sm text-slate-700 cursor-pointer">Make this recipe public</label>
          </div>
        </section>

        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded font-bold shadow-sm transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-700 px-4 py-2.5 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
