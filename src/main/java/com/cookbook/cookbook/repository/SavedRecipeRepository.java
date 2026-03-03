package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.SavedRecipe;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SavedRecipeRepository {

    private final JdbcTemplate jdbcTemplate;

    public SavedRecipeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<SavedRecipe> savedRecipeRowMapper = (rs, rowNum) -> {
        SavedRecipe savedRecipe = new SavedRecipe();
        savedRecipe.setId(rs.getLong("id"));
        savedRecipe.setUserId(rs.getLong("user_id"));
        savedRecipe.setRecipeId(rs.getLong("recipe_id"));
        savedRecipe.setOriginalAuthorId(rs.getLong("original_author_id"));
        return savedRecipe;
    };

    public List<SavedRecipe> findByUserId(Long userId) {
        return jdbcTemplate.query("SELECT * FROM saved_recipes WHERE user_id = ?", savedRecipeRowMapper, userId);
    }

    public Optional<SavedRecipe> findById(Long id) {
        List<SavedRecipe> results = jdbcTemplate.query("SELECT * FROM saved_recipes WHERE id = ?", savedRecipeRowMapper, id);
        return results.stream().findFirst();
    }

    public void save(SavedRecipe savedRecipe) {
        jdbcTemplate.update(
                "INSERT INTO saved_recipes (user_id, recipe_id, original_author_id) VALUES (?, ?, ?)",
                savedRecipe.getUserId(), savedRecipe.getRecipeId(), savedRecipe.getOriginalAuthorId()
        );
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM saved_recipes WHERE id = ?", id);
    }
}