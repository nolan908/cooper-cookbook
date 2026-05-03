export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profilePictureUrl?: string;
  role: string;
}

export interface Ingredient {
  id?: number;
  recipeId?: number;
  name: string;
  quantity: string;
  unit: string;
  orderIndex: number;
}

export interface Step {
  id?: number;
  recipeId?: number;
  instruction: string;
  stepNumber: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string;
  isPublic: boolean;
  categoryTags: string;
  authorId: number;
  authorDisplayName?: string;
  authorProfilePictureUrl?: string;
  forkedFromRecipeId?: number;
  forkedFromRecipeTitle?: string;
  forkedFromRecipeIsPublic?: boolean;
  originalAuthorId?: number;
  originalAuthorDisplayName?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
}

export interface Collection {
  id: number;
  userId: number;
  name: string;
  description: string;
  orderIndex: number;
  recipeCount?: number;
}

export interface SavedRecipe {
  id: number;
  userId: number;
  recipeId: number;
  originalAuthorId: number;
  savedAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string;
}

export interface AuthResponse {
  token: string;
}
