package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Collection;
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
        return collection;
    };

    public List<Collection> findAll() {
        return jdbcTemplate.query("SELECT * FROM collections", collectionRowMapper);
    }

    public List<Collection> findByUserId(Long userId) {
        return jdbcTemplate.query("SELECT * FROM collections WHERE user_id = ?", collectionRowMapper, userId);
    }

    public Optional<Collection> findById(Long id) {
        List<Collection> collections = jdbcTemplate.query("SELECT * FROM collections WHERE id = ?", collectionRowMapper, id);
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
}