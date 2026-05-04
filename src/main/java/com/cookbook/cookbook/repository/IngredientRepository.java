package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Ingredient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class IngredientRepository {

    private final JdbcTemplate jdbcTemplate;

    public IngredientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Ingredient> ingredientRowMapper = (rs, rowNum) -> {
        Ingredient ingredient = new Ingredient();
        ingredient.setId(rs.getLong("id"));
        ingredient.setRecipeId(rs.getLong("recipe_id"));
        ingredient.setName(rs.getString("name"));
        ingredient.setQuantity(rs.getDouble("quantity"));
        if (rs.wasNull()) ingredient.setQuantity(null);
        ingredient.setUnit(rs.getString("unit"));
        ingredient.setOrderIndex(rs.getInt("order_index"));
        return ingredient;
    };

    public List<Ingredient> findByRecipeId(Long recipeId) {
        return jdbcTemplate.query("SELECT * FROM ingredients WHERE recipe_id = ? ORDER BY order_index", ingredientRowMapper, recipeId);
    }

    public void deleteByRecipeId(Long recipeId) {
        jdbcTemplate.update("DELETE FROM ingredients WHERE recipe_id = ?", recipeId);
    }

    public void save(Ingredient ingredient) {
        jdbcTemplate.update(
                "INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES (?, ?, ?, ?, ?)",
                ingredient.getRecipeId(), ingredient.getName(), ingredient.getQuantity(),
                ingredient.getUnit(), ingredient.getOrderIndex()
        );
    }

    public void copyIngredients(Long originalRecipeId, Long newRecipeId) {
        jdbcTemplate.update(
                "INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) " +
                        "SELECT ?, name, quantity, unit, order_index " +
                        "FROM ingredients WHERE recipe_id = ?",
                newRecipeId,
                originalRecipeId
        );
    }
}