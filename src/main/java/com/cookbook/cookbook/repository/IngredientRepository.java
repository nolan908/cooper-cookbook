package com.cookbook.cookbook.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class IngredientRepository {

    private final JdbcTemplate jdbcTemplate;

    public IngredientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
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