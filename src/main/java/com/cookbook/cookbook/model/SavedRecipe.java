package com.cookbook.cookbook.model;

public class SavedRecipe {
    private Long id;
    private Long userId;
    private Long recipeId;
    private Long originalAuthorId;

    public SavedRecipe() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public Long getOriginalAuthorId() { return originalAuthorId; }
    public void setOriginalAuthorId(Long originalAuthorId) { this.originalAuthorId = originalAuthorId; }
}