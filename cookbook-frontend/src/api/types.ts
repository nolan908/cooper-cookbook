export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  role: string;
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
  forkedFromRecipeId?: number;
  originalAuthorId?: number;
}

export interface Collection {
  id: number;
  userId: number;
  name: string;
  description: string;
  orderIndex: number;
}

export interface SavedRecipe {
  id: number;
  userId: number;
  recipeId: number;
  originalAuthorId: number;
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
}