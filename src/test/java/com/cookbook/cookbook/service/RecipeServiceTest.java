package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.repository.IngredientRepository;
import com.cookbook.cookbook.repository.RecipeRepository;
import com.cookbook.cookbook.repository.StepRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private StepRepository stepRepository;

    @InjectMocks
    private RecipeService recipeService;

    @Test
    @DisplayName("Test Fork Recipe - Success Case")
    void testForkRecipeSuccess() {
        // Arrange
        Long originalId = 1L;
        Long newUserId = 2L;
        Long forkedId = 3L;

        Recipe original = new Recipe();
        original.setId(originalId);
        original.setTitle("Pasta Carbonara");
        original.setIsPublic(true);
        original.setAuthorId(10L);

        Recipe forked = new Recipe();
        forked.setId(forkedId);
        forked.setTitle("Pasta Carbonara");
        forked.setAuthorId(newUserId);
        forked.setForkedFromRecipeId(originalId);

        when(recipeRepository.findById(originalId)).thenReturn(Optional.of(original));
        when(recipeRepository.saveAndReturnId(any(Recipe.class))).thenReturn(forkedId);
        when(recipeRepository.findById(forkedId)).thenReturn(Optional.of(forked));

        // Act
        Recipe result = recipeService.forkRecipe(originalId, newUserId);

        // Assert
        assertNotNull(result);
        assertEquals(forkedId, result.getId());
        assertEquals(newUserId, result.getAuthorId());
        
        // Verify that the helper methods to copy ingredients and steps were called
        verify(ingredientRepository, times(1)).copyIngredients(originalId, forkedId);
        verify(stepRepository, times(1)).copySteps(originalId, forkedId);
        verify(recipeRepository, times(1)).saveAndReturnId(any(Recipe.class));
    }

    @Test
    @DisplayName("Test Fork Recipe - Fails when Recipe is Private")
    void testForkRecipePrivateFail() {
        // Arrange
        Long originalId = 1L;
        Recipe privateRecipe = new Recipe();
        privateRecipe.setId(originalId);
        privateRecipe.setIsPublic(false);

        when(recipeRepository.findById(originalId)).thenReturn(Optional.of(privateRecipe));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            recipeService.forkRecipe(originalId, 99L);
        });

        assertEquals("Cannot fork private recipe", exception.getMessage());
        verify(recipeRepository, never()).saveAndReturnId(any(Recipe.class));
    }

    @Test
    @DisplayName("Test Create Recipe")
    void testCreateRecipe() {
        // Arrange
        Recipe recipe = new Recipe();
        recipe.setTitle("New Recipe");

        // Act
        recipeService.createRecipe(recipe);

        // Assert
        verify(recipeRepository, times(1)).save(recipe);
    }
}
