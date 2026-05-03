package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Recipe;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Map;
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
        
        // Joined user info
        try {
            recipe.setAuthorDisplayName(rs.getString("display_name"));
            recipe.setAuthorProfilePictureUrl(rs.getString("profile_picture_url"));
        } catch (Exception ignored) {}

        // Joined fork info
        try {
            recipe.setForkedFromRecipeTitle(rs.getString("forked_from_title"));
            recipe.setOriginalAuthorDisplayName(rs.getString("original_author_name"));
            
            boolean forkedPublic = rs.getBoolean("forked_from_is_public");
            recipe.setForkedFromRecipeIsPublic(rs.wasNull() ? null : forkedPublic);
        } catch (Exception ignored) {}

        long forkedId = rs.getLong("forked_from_recipe_id");
        recipe.setForkedFromRecipeId(rs.wasNull() ? null : forkedId);
        
        long originalAuthorId = rs.getLong("original_author_id");
        recipe.setOriginalAuthorId(rs.wasNull() ? null : originalAuthorId);
        
        return recipe;
    };

    private final String BASE_SELECT = 
        "SELECT r.*, u.display_name, u.profile_picture_url, " +
        "orig.title as forked_from_title, orig.is_public as forked_from_is_public, ou.display_name as original_author_name " +
        "FROM recipes r " +
        "LEFT JOIN users u ON r.author_id = u.id " +
        "LEFT JOIN recipes orig ON r.forked_from_recipe_id = orig.id " +
        "LEFT JOIN users ou ON r.original_author_id = ou.id";

    public List<Recipe> findAll() {
        return jdbcTemplate.query(BASE_SELECT, recipeRowMapper);
    }

    public List<Recipe> findByAuthorId(Long authorId) {
        return jdbcTemplate.query(BASE_SELECT + " WHERE r.author_id = ?", recipeRowMapper, authorId);
    }

    public List<Recipe> findPublicRecipes() {
        return jdbcTemplate.query(BASE_SELECT + " WHERE r.is_public = true", recipeRowMapper);
    }

    public Optional<Recipe> findById(Long id) {
        List<Recipe> recipes = jdbcTemplate.query(BASE_SELECT + " WHERE r.id = ?", recipeRowMapper, id);
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
        String sql = "INSERT INTO recipes (title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id, forked_from_recipe_id, original_author_id) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, recipe.getTitle());
            ps.setString(2, recipe.getDescription());
            ps.setObject(3, recipe.getPrepTime());
            ps.setObject(4, recipe.getCookTime());
            ps.setObject(5, recipe.getServings());
            ps.setString(6, recipe.getImageUrl());
            ps.setBoolean(7, recipe.getIsPublic() != null ? recipe.getIsPublic() : true);
            ps.setString(8, recipe.getCategoryTags());
            ps.setObject(9, recipe.getAuthorId());
            ps.setObject(10, recipe.getForkedFromRecipeId());
            ps.setObject(11, recipe.getOriginalAuthorId());
            return ps;
        }, keyHolder);
        
        Map<String, Object> keys = keyHolder.getKeys();
        if (keys == null || keys.isEmpty()) return null;
        
        // H2 might return uppercase ID
        Object id = keys.get("id");
        if (id == null) id = keys.get("ID");
        
        if (id instanceof Number) return ((Number) id).longValue();
        return null;
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
