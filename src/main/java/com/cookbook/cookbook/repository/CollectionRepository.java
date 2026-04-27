package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.model.Recipe;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CollectionRepository {

    private final JdbcTemplate jdbcTemplate;

    public CollectionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<Collection> collectionRowMapper = (rs, rowNum) -> {
        Collection collection = new Collection();
        collection.setId(rs.getLong("id"));
        collection.setUserId(rs.getLong("user_id"));
        collection.setName(rs.getString("name"));
        collection.setDescription(rs.getString("description"));
        collection.setOrderIndex(rs.getInt("order_index"));
        
        // Try to get joined recipe count
        try {
            collection.setRecipeCount(rs.getInt("recipe_count"));
        } catch (Exception ignored) {
            collection.setRecipeCount(0);
        }
        
        return collection;
    };

    private final String BASE_SELECT = 
        "SELECT c.*, COUNT(cr.recipe_id) as recipe_count " +
        "FROM collections c " +
        "LEFT JOIN collection_recipes cr ON c.id = cr.collection_id " +
        "GROUP BY c.id";

    public List<Collection> findAll() {
        return jdbcTemplate.query(BASE_SELECT, collectionRowMapper);
    }

    public List<Collection> findByUserId(Long userId) {
        return jdbcTemplate.query(BASE_SELECT + " HAVING c.user_id = ?", collectionRowMapper, userId);
    }

    public Optional<Collection> findById(Long id) {
        List<Collection> collections = jdbcTemplate.query(BASE_SELECT + " HAVING c.id = ?", collectionRowMapper, id);
        return collections.stream().findFirst();
    }

    public void save(Collection collection) {
        jdbcTemplate.update(
                "INSERT INTO collections (user_id, name, description, order_index) VALUES (?, ?, ?, ?)",
                collection.getUserId(), collection.getName(), collection.getDescription(), collection.getOrderIndex()
        );
    }

    public void update(Collection collection) {
        jdbcTemplate.update(
                "UPDATE collections SET name=?, description=?, order_index=? WHERE id=?",
                collection.getName(), collection.getDescription(), collection.getOrderIndex(), collection.getId()
        );
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM collections WHERE id = ?", id);
    }

    public void addRecipeToCollection(Long collectionId, Long recipeId) {
        jdbcTemplate.update(
                "INSERT INTO collection_recipes (collection_id, recipe_id) VALUES (?, ?)",
                collectionId, recipeId
        );
    }

    public void removeRecipeFromCollection(Long collectionId, Long recipeId) {
        jdbcTemplate.update(
                "DELETE FROM collection_recipes WHERE collection_id = ? AND recipe_id = ?",
                collectionId, recipeId
        );
    }

    public List<Recipe> findRecipesByCollectionId(Long collectionId) {
        String sql = "SELECT r.*, u.display_name, u.profile_picture_url " +
                     "FROM recipes r " +
                     "JOIN users u ON r.author_id = u.id " +
                     "JOIN collection_recipes cr ON r.id = cr.recipe_id " +
                     "WHERE cr.collection_id = ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
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
            recipe.setAuthorDisplayName(rs.getString("display_name"));
            recipe.setAuthorProfilePictureUrl(rs.getString("profile_picture_url"));
            return recipe;
        }, collectionId);
    }
}
