package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Recipe;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import({RecipeRepository.class, UserRepository.class})
public class RecipeRepositoryTest {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    private Long authorId;

    @BeforeEach
    public void setUp() {
        User user = new User();
        user.setUsername("author");
        user.setEmail("a@t.com");
        user.setPasswordHash("h");
        userRepository.save(user);
        authorId = userRepository.findByUsername("author").get().getId();
    }

    @Test
    public void testSaveAndFind() {
        Recipe r = new Recipe();
        r.setTitle("Test Recipe");
        r.setAuthorId(authorId);
        r.setIsPublic(true);
        
        Long id = recipeRepository.saveAndReturnId(r);
        assertNotNull(id);
        
        Optional<Recipe> found = recipeRepository.findById(id);
        assertTrue(found.isPresent());
        assertEquals("Test Recipe", found.get().getTitle());
    }

    @Test
    public void testFindPublicRecipes() {
        Recipe r1 = new Recipe();
        r1.setTitle("Public"); r1.setAuthorId(authorId); r1.setIsPublic(true);
        recipeRepository.save(r1);

        Recipe r2 = new Recipe();
        r2.setTitle("Private"); r2.setAuthorId(authorId); r2.setIsPublic(false);
        recipeRepository.save(r2);
        
        List<Recipe> publicRecipes = recipeRepository.findPublicRecipes();
        assertTrue(publicRecipes.stream().anyMatch(r -> r.getTitle().equals("Public")));
        assertFalse(publicRecipes.stream().anyMatch(r -> r.getTitle().equals("Private")));
    }

    @Test
    public void testUpdate() {
        Recipe r = new Recipe();
        r.setTitle("Old"); r.setAuthorId(authorId);
        Long id = recipeRepository.saveAndReturnId(r);
        
        Recipe saved = recipeRepository.findById(id).get();
        saved.setTitle("New");
        recipeRepository.update(saved);
        
        Recipe updated = recipeRepository.findById(id).get();
        assertEquals("New", updated.getTitle());
    }

    @Test
    public void testDelete() {
        Recipe r = new Recipe();
        r.setTitle("Del"); r.setAuthorId(authorId);
        Long id = recipeRepository.saveAndReturnId(r);
        
        recipeRepository.deleteById(id);
        assertFalse(recipeRepository.findById(id).isPresent());
    }
}
