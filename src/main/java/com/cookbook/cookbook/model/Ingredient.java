package com.cookbook.cookbook.model;

public class Ingredient {
    private Long id;
    private Long recipeId;
    private String name;
    private String quantity;
    private String unit;
    private Integer orderIndex;

    public Ingredient() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
