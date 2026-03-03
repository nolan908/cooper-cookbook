package com.cookbook.cookbook.model;

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
}