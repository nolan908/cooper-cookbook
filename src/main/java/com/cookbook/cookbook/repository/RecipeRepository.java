package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Recipe;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RecipeRepository {

    private final JdbcTemplate jdbcTemplate;

    public RecipeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Recipe> recipeRowMapper = (rs, rowNum) -> {
        Recipe recipe = new Recipe();
        recipe.setId(rs.getLong("id"));
        recipe.setTitle(rs.getString("title"));
        recipe.setDescription(rs.getString("description"));
        recipe.setPrepTime(rs.getInt("prep_time"));
        recipe.setCookTime(rs.getInt("cook_time"));
        recipe.setServings(rs.getInt("servings"));
        recipe.setImageUrl(rs.getString("image_url"));
        recipe.setIsPublic(rs.getBoolean("is_public"));
        recipe.setCategoryTags(rs.getString("category_tags"));
        recipe.setAuthorId(rs.getLong("author_id"));
        
        long forkedId = rs.getLong("forked_from_recipe_id");
        recipe.setForkedFromRecipeId(rs.wasNull() ? null : forkedId);
        
        long originalAuthorId = rs.getLong("original_author_id");
        recipe.setOriginalAuthorId(rs.wasNull() ? null : originalAuthorId);
        
        return recipe;
    };

    public List<Recipe> findAll() {
        return jdbcTemplate.query("SELECT * FROM recipes", recipeRowMapper);
    }

    public List<Recipe> findByAuthorId(Long authorId) {
        return jdbcTemplate.query("SELECT * FROM recipes WHERE author_id = ?", recipeRowMapper, authorId);
    }

    public List<Recipe> findPublicRecipes() {
        return jdbcTemplate.query("SELECT * FROM recipes WHERE is_public = true", recipeRowMapper);
    }

    public Optional<Recipe> findById(Long id) {
        List<Recipe> recipes = jdbcTemplate.query("SELECT * FROM recipes WHERE id = ?", recipeRowMapper, id);
        return recipes.stream().findFirst();
    }

    public void save(Recipe recipe) {
        jdbcTemplate.update(
                "INSERT INTO recipes (title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                recipe.getTitle(), recipe.getDescription(), recipe.getPrepTime(),
                recipe.getCookTime(), recipe.getServings(), recipe.getImageUrl(),
                recipe.getIsPublic(), recipe.getCategoryTags(), recipe.getAuthorId()
        );
    }
    public Long saveAndReturnId(Recipe recipe) {
        return jdbcTemplate.queryForObject(
                "INSERT INTO recipes (title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id, forked_from_recipe_id, original_author_id) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
                Long.class,
                recipe.getTitle(),
                recipe.getDescription(),
                recipe.getPrepTime(),
                recipe.getCookTime(),
                recipe.getServings(),
                recipe.getImageUrl(),
                recipe.getIsPublic(),
                recipe.getCategoryTags(),
                recipe.getAuthorId(),
                recipe.getForkedFromRecipeId(),
                recipe.getOriginalAuthorId()
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

    public void copySteps(Long originalRecipeId, Long newRecipeId) {
        jdbcTemplate.update(
                "INSERT INTO steps (recipe_id, instruction, step_number) " +
                        "SELECT ?, instruction, step_number " +
                        "FROM steps WHERE recipe_id = ?",
                newRecipeId,
                originalRecipeId
        );
    }
    public void update(Recipe recipe) {
        jdbcTemplate.update(
                "UPDATE recipes SET title=?, description=?, prep_time=?, cook_time=?, servings=?, image_url=?, is_public=?, category_tags=? WHERE id=?",
                recipe.getTitle(), recipe.getDescription(), recipe.getPrepTime(),
                recipe.getCookTime(), recipe.getServings(), recipe.getImageUrl(),
                recipe.getIsPublic(), recipe.getCategoryTags(), recipe.getId()
        );
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM recipes WHERE id = ?", id);
    }
}
