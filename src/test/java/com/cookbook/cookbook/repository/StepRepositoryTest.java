package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Step;
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

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import({StepRepository.class, UserRepository.class, RecipeRepository.class})
public class StepRepositoryTest {

    @Autowired private StepRepository stepRepository;
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
        Step step = new Step();
        step.setRecipeId(recipeId);
        step.setInstruction("Boil");
        step.setStepNumber(1);
        
        stepRepository.save(step);
        
        List<Step> found = stepRepository.findByRecipeId(recipeId);
        assertFalse(found.isEmpty());
        assertEquals("Boil", found.get(0).getInstruction());
    }

    @Test
    public void testDeleteByRecipeId() {
        Step step = new Step();
        step.setRecipeId(recipeId);
        step.setInstruction("Boil");
        step.setStepNumber(1);
        stepRepository.save(step);
        
        stepRepository.deleteByRecipeId(recipeId);
        assertTrue(stepRepository.findByRecipeId(recipeId).isEmpty());
    }
}
