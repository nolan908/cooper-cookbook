package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Ingredient;
import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import({IngredientRepository.class, UserRepository.class, RecipeRepository.class})
public class IngredientRepositoryTest {

    @Autowired private IngredientRepository ingredientRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RecipeRepository recipeRepository;

    private Long recipeId;

    @BeforeEach
    public void setUp() {
        User u = new User(); u.setUsername("u"); u.setEmail("e"); u.setPasswordHash("h");
        userRepository.save(u);
        Long uid = userRepository.findByUsername("u").get().getId();
        Recipe r = new Recipe(); r.setTitle("R"); r.setAuthorId(uid);
        recipeId = recipeRepository.saveAndReturnId(r);
    }

    @Test
    public void testSaveAndFind() {
        Ingredient ing = new Ingredient();
        ing.setRecipeId(recipeId);
        ing.setName("Salt");
        
        ingredientRepository.save(ing);
        
        List<Ingredient> found = ingredientRepository.findByRecipeId(recipeId);
        assertFalse(found.isEmpty());
        assertEquals("Salt", found.get(0).getName());
    }

    @Test
    public void testDeleteByRecipeId() {
        Ingredient ing = new Ingredient();
        ing.setRecipeId(recipeId);
        ing.setName("Salt");
        ingredientRepository.save(ing);
        
        ingredientRepository.deleteByRecipeId(recipeId);
        assertTrue(ingredientRepository.findByRecipeId(recipeId).isEmpty());
    }
}
