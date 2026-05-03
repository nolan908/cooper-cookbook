package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.model.SavedRecipe;
import com.cookbook.cookbook.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import({SavedRecipeRepository.class, UserRepository.class, RecipeRepository.class})
public class SavedRecipeRepositoryTest {

    @Autowired
    private SavedRecipeRepository savedRecipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    private Long userId;
    private Long recipeId;

    @BeforeEach
    public void setUp() {
        User user = new User();
        user.setUsername("saver"); user.setEmail("s@t.com"); user.setPasswordHash("h");
        userRepository.save(user);
        userId = userRepository.findByUsername("saver").get().getId();

        Recipe r = new Recipe();
        r.setTitle("R"); r.setAuthorId(userId);
        recipeId = recipeRepository.saveAndReturnId(r);
    }

    @Test
    public void testSaveAndFind() {
        SavedRecipe sr = new SavedRecipe();
        sr.setUserId(userId);
        sr.setRecipeId(recipeId);
        
        savedRecipeRepository.save(sr);
        
        List<SavedRecipe> found = savedRecipeRepository.findByUserId(userId);
        assertFalse(found.isEmpty());
        assertEquals(recipeId, found.get(0).getRecipeId());
    }

    @Test
    public void testDelete() {
        SavedRecipe sr = new SavedRecipe();
        sr.setUserId(userId);
        sr.setRecipeId(recipeId);
        savedRecipeRepository.save(sr);
        
        Long id = savedRecipeRepository.findByUserId(userId).get(0).getId();
        savedRecipeRepository.deleteById(id);
        
        assertTrue(savedRecipeRepository.findByUserId(userId).isEmpty());
    }
}
