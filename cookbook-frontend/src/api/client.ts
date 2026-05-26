import axios from "axios";
import type {
  Recipe,
  Collection,
  SavedRecipe,
  LoginCredentials,
  RegisterData,
  User,
} from "./types";
import { API_BASE_URL, DEMO_MODE } from "./config";
import { mockApi } from "./mockClient";

const api = axios.create({
  baseURL: API_BASE_URL,
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
export const validateStep1 = (data: { username: string; email: string }) =>
  DEMO_MODE ? mockApi.validateStep1(data) : api.post<string>("/auth/validate-step1", data);

export const register = (data: RegisterData) =>
  DEMO_MODE ? mockApi.register(data) : api.post<string>("/auth/register", data);

export const login = async (creds: LoginCredentials) => {
  if (DEMO_MODE) return mockApi.login(creds);
  const res = await api.post<{ token: string }>("/auth/login", creds);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const logout = () => localStorage.removeItem("token");

export const getToken = () => localStorage.getItem("token");

export const getCurrentUser = () => DEMO_MODE ? mockApi.getCurrentUser() : api.get<User>("/auth/me");

// Users
export const getUsers = () => DEMO_MODE ? mockApi.getUsers() : api.get<User[]>("/users");
export const getUserById = (id: number) => DEMO_MODE ? mockApi.getUserById(id) : api.get<User>(`/users/${id}`);
export const updateProfile = (id: number, data: Partial<User>) =>
  DEMO_MODE ? mockApi.updateProfile(id, data) : api.put<string>(`/users/${id}/profile`, data);
export const updateAccount = (id: number, data: any) =>
  DEMO_MODE ? mockApi.updateAccount(id, data) : api.put<string>(`/users/${id}/account`, data);
export const deleteUser = (id: number) => DEMO_MODE ? mockApi.deleteUser(id) : api.delete<string>(`/users/${id}`);
export const forgotPassword = (email: string) => DEMO_MODE ? mockApi.forgotPassword(email) : api.post<string>("/users/forgot-password", { email });
export const resetPassword = (token: string, newPassword: string) => DEMO_MODE ? mockApi.resetPassword() : api.post<string>("/users/reset-password", { token, newPassword });
export const verifyPassword = (id: number, password: string) => DEMO_MODE ? mockApi.verifyPassword() : api.post<boolean>(`/users/${id}/verify-password`, { password });

// Recipes
export const getAllRecipes = () => DEMO_MODE ? mockApi.getAllRecipes() : api.get<Recipe[]>("/recipes");
export const getPublicRecipes = () => DEMO_MODE ? mockApi.getPublicRecipes() : api.get<Recipe[]>("/recipes/public");
export const getRecipesByAuthor = (authorId: number) =>
  DEMO_MODE ? mockApi.getRecipesByAuthor(authorId) : api.get<Recipe[]>(`/recipes/author/${authorId}`);
export const getRecipeById = (id: number) => DEMO_MODE ? mockApi.getRecipeById(id) : api.get<Recipe>(`/recipes/${id}`);
export const createRecipe = (recipe: Omit<Recipe, "id">) =>
  DEMO_MODE ? mockApi.createRecipe(recipe) : api.post<string>("/recipes", recipe);
export const updateRecipe = (id: number, recipe: Partial<Recipe>) =>
  DEMO_MODE ? mockApi.updateRecipe(id, recipe) : api.put<string>(`/recipes/${id}`, recipe);
export const deleteRecipe = (id: number) =>
  DEMO_MODE ? mockApi.deleteRecipe(id) : api.delete<string>(`/recipes/${id}`);
export const forkRecipe = (id: number, userId: number) =>
  DEMO_MODE ? mockApi.forkRecipe(id, userId) : api.post<Recipe>(`/recipes/${id}/fork?userId=${userId}`);

// Collections
export const getCollectionsByUser = (userId: number) =>
  DEMO_MODE ? mockApi.getCollectionsByUser(userId) : api.get<Collection[]>(`/collections/user/${userId}`);
export const getCollectionById = (id: number) =>
  DEMO_MODE ? mockApi.getCollectionById(id) : api.get<Collection>(`/collections/${id}`);
export const getRecipesInCollection = (id: number) =>
  DEMO_MODE ? mockApi.getRecipesInCollection(id) : api.get<Recipe[]>(`/collections/${id}/recipes`);
export const createCollection = (collection: Omit<Collection, "id">) =>
  DEMO_MODE ? mockApi.createCollection(collection) : api.post<string>("/collections", collection);
export const updateCollection = (
  id: number,
  collection: Partial<Collection>,
) => DEMO_MODE ? mockApi.updateCollection(id, collection) : api.put<string>(`/collections/${id}`, collection);
export const deleteCollection = (id: number) =>
  DEMO_MODE ? mockApi.deleteCollection(id) : api.delete<string>(`/collections/${id}`);
export const addRecipeToCollection = (
  collectionId: number,
  recipeId: number,
) => DEMO_MODE ? mockApi.addRecipeToCollection(collectionId, recipeId) : api.post<string>(`/collections/${collectionId}/recipes/${recipeId}`);
export const removeRecipeFromCollection = (
  collectionId: number,
  recipeId: number,
) => DEMO_MODE ? mockApi.removeRecipeFromCollection(collectionId, recipeId) : api.delete<string>(`/collections/${collectionId}/recipes/${recipeId}`);

// Saved Recipes
export const getSavedRecipesByUser = (userId: number) =>
  DEMO_MODE ? mockApi.getSavedRecipesByUser(userId) : api.get<SavedRecipe[]>(`/saved-recipes/user/${userId}`);
export const saveRecipe = (data: Omit<SavedRecipe, "id">) =>
  DEMO_MODE ? mockApi.saveRecipe(data) : api.post<string>("/saved-recipes", data);
export const deleteSavedRecipe = (id: number) =>
  DEMO_MODE ? mockApi.deleteSavedRecipe(id) : api.delete<string>(`/saved-recipes/${id}`);
