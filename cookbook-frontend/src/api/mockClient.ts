import type {
  Collection,
  LoginCredentials,
  Recipe,
  RegisterData,
  SavedRecipe,
  User,
} from "./types";

type ApiResponse<T> = Promise<{ data: T }>;

const users: User[] = [
  {
    id: 1,
    username: "user1",
    email: "user1@example.com",
    displayName: "Chef Nolan",
    bio: "Specializing in high-performance recipes.",
    role: "USER",
    profilePictureUrl: "https://cdn-icons-png.flaticon.com/512/1154/1154444.png",
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    displayName: "Chef Alex",
    bio: "Traditional heritage cooking enthusiast.",
    role: "USER",
    profilePictureUrl: "https://cdn-icons-png.flaticon.com/512/1154/1154460.png",
  },
];

let recipes: Recipe[] = [
  {
    id: 1,
    title: "Classic Lasagna",
    description: "Layers of beef, cheese, and pasta.",
    prepTime: 30,
    cookTime: 60,
    servings: 8,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
    isPublic: true,
    categoryTags: "Dinner, Italian",
    authorId: 1,
    ingredients: [
      { name: "Beef", quantity: "1", unit: "lb", orderIndex: 0 },
      { name: "Pasta Sheets", quantity: "12", unit: "sheets", orderIndex: 1 },
      { name: "Mozzarella", quantity: "2", unit: "cups", orderIndex: 2 },
    ],
    steps: [
      { instruction: "Prepare the meat sauce.", stepNumber: 1 },
      { instruction: "Layer pasta and cheese.", stepNumber: 2 },
      { instruction: "Bake at 375F.", stepNumber: 3 },
    ],
  },
  {
    id: 2,
    title: "Midnight Ramen",
    description: "Quick noodles for late night sessions.",
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    isPublic: true,
    categoryTags: "Fast, Asian",
    authorId: 2,
    ingredients: [],
    steps: [],
  },
  {
    id: 3,
    title: "Tinned Fish Toast",
    description: "Artisanal sardines on sourdough.",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800",
    isPublic: true,
    categoryTags: "Seafood, Lunch",
    authorId: 1,
    ingredients: [],
    steps: [],
  },
  {
    id: 4,
    title: "Greek Salad",
    description: "Fresh cucumber, olives, and feta.",
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    isPublic: true,
    categoryTags: "Healthy, Salad",
    authorId: 2,
    ingredients: [],
    steps: [],
  },
  {
    id: 5,
    title: "Spicy Lasagna",
    description: "Nolan's classic Lasagna with a spicy chili kick.",
    prepTime: 30,
    cookTime: 65,
    servings: 8,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
    isPublic: true,
    categoryTags: "Dinner, Italian, Spicy",
    authorId: 2,
    forkedFromRecipeId: 1,
    forkedFromRecipeTitle: "Classic Lasagna",
    forkedFromRecipeIsPublic: true,
    originalAuthorId: 1,
    originalAuthorDisplayName: "Chef Nolan",
    ingredients: [
      { name: "Beef", quantity: "1", unit: "lb", orderIndex: 0 },
      { name: "Pasta Sheets", quantity: "12", unit: "sheets", orderIndex: 1 },
      { name: "Mozzarella", quantity: "2", unit: "cups", orderIndex: 2 },
      { name: "Red Chili Flakes", quantity: "3", unit: "tbsp", orderIndex: 3 },
    ],
    steps: [
      { instruction: "Prepare the meat sauce with extra chili.", stepNumber: 1 },
      { instruction: "Layer pasta and cheese.", stepNumber: 2 },
      { instruction: "Bake at 375F for 5 mins longer.", stepNumber: 3 },
    ],
  },
];

let collections: Collection[] = [
  { id: 1, userId: 1, name: "Quick Bites", description: "Recipes that take less than 15 minutes.", orderIndex: 0 },
  { id: 2, userId: 2, name: "Weekend Dinner", description: "Heavy meals for the family.", orderIndex: 0 },
];

let collectionRecipes = [
  { collectionId: 1, recipeId: 2 },
  { collectionId: 1, recipeId: 3 },
  { collectionId: 1, recipeId: 4 },
  { collectionId: 2, recipeId: 1 },
  { collectionId: 2, recipeId: 5 },
];

let savedRecipes: SavedRecipe[] = [
  { id: 1, userId: 1, recipeId: 2, originalAuthorId: 2 },
  { id: 2, userId: 1, recipeId: 3, originalAuthorId: 1 },
  { id: 3, userId: 1, recipeId: 4, originalAuthorId: 2 },
  { id: 4, userId: 2, recipeId: 1, originalAuthorId: 1 },
  { id: 5, userId: 2, recipeId: 5, originalAuthorId: 2 },
];

function withAuthor(recipe: Recipe): Recipe {
  const author = users.find((user) => user.id === recipe.authorId);
  const forkedFrom = recipe.forkedFromRecipeId
    ? recipes.find((candidate) => candidate.id === recipe.forkedFromRecipeId)
    : undefined;
  const originalAuthor = recipe.originalAuthorId
    ? users.find((user) => user.id === recipe.originalAuthorId)
    : undefined;

  return {
    ...recipe,
    authorDisplayName: author?.displayName || author?.username,
    authorProfilePictureUrl: author?.profilePictureUrl,
    forkedFromRecipeTitle: forkedFrom?.title || recipe.forkedFromRecipeTitle,
    forkedFromRecipeIsPublic: forkedFrom?.isPublic ?? recipe.forkedFromRecipeIsPublic,
    originalAuthorDisplayName: originalAuthor?.displayName || recipe.originalAuthorDisplayName,
  };
}

function respond<T>(data: T): ApiResponse<T> {
  return Promise.resolve({ data });
}

function fail(message: string) {
  return Promise.reject({ response: { data: message } });
}

function tokenFor(username: string) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: username }));
  return `${header}.${payload}.demo`;
}

export const mockApi = {
  validateStep1: (data: { username: string; email: string }) => {
    if (users.some((user) => user.username === data.username)) return fail("Username already taken");
    if (users.some((user) => user.email === data.email)) return fail("Email already taken");
    return respond("Valid");
  },
  register: (data: RegisterData) => {
    const user: User = {
      id: Math.max(...users.map((item) => item.id)) + 1,
      username: data.username,
      email: data.email,
      displayName: data.displayName || data.username,
      bio: data.bio,
      role: "USER",
      profilePictureUrl: data.profilePictureUrl,
    };
    users.push(user);
    return respond("User registered successfully");
  },
  login: async (creds: LoginCredentials) => {
    const validPassword = creds.username === "user1" ? "password1" : creds.username === "user2" ? "password2" : undefined;
    const user = users.find((candidate) => candidate.username === creds.username);
    if (!user || (validPassword && creds.password !== validPassword)) return fail("Invalid username or password");
    const token = tokenFor(creds.username);
    localStorage.setItem("token", token);
    return { token };
  },
  getCurrentUser: () => {
    const username = localStorage.getItem("token")?.split(".")[1];
    const decoded = username ? JSON.parse(atob(username)).sub : "";
    const user = users.find((candidate) => candidate.username === decoded);
    return user ? respond(user) : fail("Unauthorized");
  },
  getUsers: () => respond(users),
  getUserById: (id: number) => respond(users.find((user) => user.id === id) as User),
  updateProfile: (id: number, data: Partial<User>) => {
    const user = users.find((candidate) => candidate.id === id);
    if (user) Object.assign(user, data);
    return respond("Profile updated");
  },
  updateAccount: (id: number, data: any) => {
    const user = users.find((candidate) => candidate.id === id);
    if (user) Object.assign(user, data);
    return respond("Account updated");
  },
  deleteUser: (id: number) => {
    const index = users.findIndex((user) => user.id === id);
    if (index >= 0) users.splice(index, 1);
    return respond("Deleted");
  },
  forgotPassword: (email: string) => respond(`Demo reset link sent to ${email}`),
  resetPassword: () => respond("Password reset"),
  verifyPassword: () => respond(true),
  getAllRecipes: () => respond(recipes.map(withAuthor)),
  getPublicRecipes: () => respond(recipes.filter((recipe) => recipe.isPublic).map(withAuthor).sort((a, b) => b.id - a.id)),
  getRecipesByAuthor: (authorId: number) => respond(recipes.filter((recipe) => recipe.authorId === authorId).map(withAuthor)),
  getRecipeById: (id: number) => respond(withAuthor(recipes.find((recipe) => recipe.id === id) as Recipe)),
  createRecipe: (recipe: Omit<Recipe, "id">) => {
    recipes.push(withAuthor({ ...recipe, id: Math.max(...recipes.map((item) => item.id)) + 1 }));
    return respond("Recipe created");
  },
  updateRecipe: (id: number, data: Partial<Recipe>) => {
    recipes = recipes.map((recipe) => (recipe.id === id ? withAuthor({ ...recipe, ...data, id }) : recipe));
    return respond("Recipe updated");
  },
  deleteRecipe: (id: number) => {
    recipes = recipes.filter((recipe) => recipe.id !== id);
    savedRecipes = savedRecipes.filter((item) => item.recipeId !== id);
    return respond("Recipe deleted");
  },
  forkRecipe: (id: number, userId: number) => {
    const source = recipes.find((recipe) => recipe.id === id);
    if (!source) return fail("Recipe not found");
    const forked = withAuthor({
      ...source,
      id: Math.max(...recipes.map((item) => item.id)) + 1,
      title: `${source.title} Fork`,
      authorId: userId,
      forkedFromRecipeId: source.id,
      originalAuthorId: source.originalAuthorId || source.authorId,
    });
    recipes.push(forked);
    return respond(forked);
  },
  getCollectionsByUser: (userId: number) =>
    respond(collections.filter((collection) => collection.userId === userId).map((collection) => ({
      ...collection,
      recipeCount: collectionRecipes.filter((item) => item.collectionId === collection.id).length,
    }))),
  getCollectionById: (id: number) => respond(collections.find((collection) => collection.id === id) as Collection),
  getRecipesInCollection: (id: number) =>
    respond(collectionRecipes.filter((item) => item.collectionId === id).map((item) => withAuthor(recipes.find((recipe) => recipe.id === item.recipeId) as Recipe))),
  createCollection: (collection: Omit<Collection, "id">) => {
    collections.push({ ...collection, id: Math.max(...collections.map((item) => item.id)) + 1 });
    return respond("Collection created");
  },
  updateCollection: (id: number, data: Partial<Collection>) => {
    collections = collections.map((collection) => (collection.id === id ? { ...collection, ...data } : collection));
    return respond("Collection updated");
  },
  deleteCollection: (id: number) => {
    collections = collections.filter((collection) => collection.id !== id);
    collectionRecipes = collectionRecipes.filter((item) => item.collectionId !== id);
    return respond("Collection deleted");
  },
  addRecipeToCollection: (collectionId: number, recipeId: number) => {
    if (!collectionRecipes.some((item) => item.collectionId === collectionId && item.recipeId === recipeId)) {
      collectionRecipes.push({ collectionId, recipeId });
    }
    return respond("Added");
  },
  removeRecipeFromCollection: (collectionId: number, recipeId: number) => {
    collectionRecipes = collectionRecipes.filter((item) => item.collectionId !== collectionId || item.recipeId !== recipeId);
    return respond("Removed");
  },
  getSavedRecipesByUser: (userId: number) => respond(savedRecipes.filter((item) => item.userId === userId)),
  saveRecipe: (data: Omit<SavedRecipe, "id">) => {
    if (!savedRecipes.some((item) => item.userId === data.userId && item.recipeId === data.recipeId)) {
      savedRecipes.push({ ...data, id: Math.max(...savedRecipes.map((item) => item.id)) + 1 });
    }
    return respond("Saved");
  },
  deleteSavedRecipe: (id: number) => {
    savedRecipes = savedRecipes.filter((item) => item.id !== id);
    return respond("Deleted");
  },
};
