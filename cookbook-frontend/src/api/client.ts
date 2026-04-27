import axios from "axios";
import type {
  Recipe,
  Collection,
  SavedRecipe,
  LoginCredentials,
  RegisterData,
  User,
} from "./types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: RegisterData) =>
  api.post<string>("/auth/register", data);

export const login = async (creds: LoginCredentials) => {
  const res = await api.post<{ token: string }>("/auth/login", creds);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = () => localStorage.removeItem("token");

export const getToken = () => localStorage.getItem("token");

// Users
export const getUsers = () => api.get<User[]>("/users");
export const getUserById = (id: number) => api.get<User>(`/users/${id}`);
export const updateProfile = (id: number, data: Partial<User>) =>
  api.put<string>(`/users/${id}/profile`, data);
export const updateAccount = (id: number, data: any) =>
  api.put<string>(`/users/${id}/account`, data);
export const deleteUser = (id: number) => api.delete<string>(`/users/${id}`);
export const forgotPassword = (email: string) => api.post<string>("/users/forgot-password", { email });
export const resetPassword = (token: string, newPassword: string) => api.post<string>("/users/reset-password", { token, newPassword });
export const verifyPassword = (id: number, password: string) => api.post<boolean>(`/users/${id}/verify-password`, { password });

// Recipes
export const getAllRecipes = () => api.get<Recipe[]>("/recipes");
export const getPublicRecipes = () => api.get<Recipe[]>("/recipes/public");
export const getRecipesByAuthor = (authorId: number) =>
  api.get<Recipe[]>(`/recipes/author/${authorId}`);
export const getRecipeById = (id: number) => api.get<Recipe>(`/recipes/${id}`);
export const createRecipe = (recipe: Omit<Recipe, "id">) =>
  api.post<string>("/recipes", recipe);
export const updateRecipe = (id: number, recipe: Partial<Recipe>) =>
  api.put<string>(`/recipes/${id}`, recipe);
export const deleteRecipe = (id: number) =>
  api.delete<string>(`/recipes/${id}`);
export const forkRecipe = (id: number, userId: number) =>
  api.post<Recipe>(`/recipes/${id}/fork?userId=${userId}`);

// Collections
export const getCollectionsByUser = (userId: number) =>
  api.get<Collection[]>(`/collections/user/${userId}`);
export const getCollectionById = (id: number) =>
  api.get<Collection>(`/collections/${id}`);
export const getRecipesInCollection = (id: number) =>
  api.get<Recipe[]>(`/collections/${id}/recipes`);
export const createCollection = (collection: Omit<Collection, "id">) =>
  api.post<string>("/collections", collection);
export const updateCollection = (
  id: number,
  collection: Partial<Collection>,
) => api.put<string>(`/collections/${id}`, collection);
export const deleteCollection = (id: number) =>
  api.delete<string>(`/collections/${id}`);
export const addRecipeToCollection = (
  collectionId: number,
  recipeId: number,
) => api.post<string>(`/collections/${collectionId}/recipes/${recipeId}`);
export const removeRecipeFromCollection = (
  collectionId: number,
  recipeId: number,
) => api.delete<string>(`/collections/${collectionId}/recipes/${recipeId}`);

// Saved Recipes
export const getSavedRecipesByUser = (userId: number) =>
  api.get<SavedRecipe[]>(`/saved-recipes/user/${userId}`);
export const saveRecipe = (data: Omit<SavedRecipe, "id">) =>
  api.post<string>("/saved-recipes", data);
export const deleteSavedRecipe = (id: number) =>
  api.delete<string>(`/saved-recipes/${id}`);
