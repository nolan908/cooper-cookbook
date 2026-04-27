package com.cookbook.cookbook.model;

import java.util.ArrayList;
import java.util.List;

public class Recipe {
    private Long id;
    private String title;
    private String description;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;
    private String imageUrl;
    private Boolean isPublic;
    private String categoryTags;
    private Long authorId;
    private String authorDisplayName;
    private String authorProfilePictureUrl;
    private Long forkedFromRecipeId;
    private String forkedFromRecipeTitle;
    private Long originalAuthorId;
    private String originalAuthorDisplayName;
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Step> steps = new ArrayList<>();

    public Recipe() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getPrepTime() { return prepTime; }
    public void setPrepTime(Integer prepTime) { this.prepTime = prepTime; }

    public Integer getCookTime() { return cookTime; }
    public void setCookTime(Integer cookTime) { this.cookTime = cookTime; }

    public Integer getServings() { return servings; }
    public void setServings(Integer servings) { this.servings = servings; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public String getCategoryTags() { return categoryTags; }
    public void setCategoryTags(String categoryTags) { this.categoryTags = categoryTags; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public String getAuthorProfilePictureUrl() { return authorProfilePictureUrl; }
    public void setAuthorProfilePictureUrl(String authorProfilePictureUrl) { this.authorProfilePictureUrl = authorProfilePictureUrl; }

    public Long getForkedFromRecipeId() {
        return forkedFromRecipeId;
    }

    public void setForkedFromRecipeId(Long forkedFromRecipeId) {
        this.forkedFromRecipeId = forkedFromRecipeId;
    }

    public String getForkedFromRecipeTitle() {
        return forkedFromRecipeTitle;
    }

    public void setForkedFromRecipeTitle(String forkedFromRecipeTitle) {
        this.forkedFromRecipeTitle = forkedFromRecipeTitle;
    }

    public Long getOriginalAuthorId() {
        return originalAuthorId;
    }

    public void setOriginalAuthorId(Long originalAuthorId) {
        this.originalAuthorId = originalAuthorId;
    }

    public String getOriginalAuthorDisplayName() {
        return originalAuthorDisplayName;
    }

    public void setOriginalAuthorDisplayName(String originalAuthorDisplayName) {
        this.originalAuthorDisplayName = originalAuthorDisplayName;
    }

    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }

    public List<Step> getSteps() { return steps; }
    public void setSteps(List<Step> steps) { this.steps = steps; }
}
