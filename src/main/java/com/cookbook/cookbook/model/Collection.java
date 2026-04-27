package com.cookbook.cookbook.model;

public class Collection {
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private Integer orderIndex;
    private Integer recipeCount;

    public Collection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Integer getRecipeCount() { return recipeCount; }
    public void setRecipeCount(Integer recipeCount) { this.recipeCount = recipeCount; }
}
