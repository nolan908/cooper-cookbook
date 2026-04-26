package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.repository.RecipeRepository;
import com.cookbook.cookbook.repository.IngredientRepository;
import com.cookbook.cookbook.repository.StepRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final StepRepository stepRepository;

    public RecipeService(
            RecipeRepository recipeRepository,
            IngredientRepository ingredientRepository,
            StepRepository stepRepository
    ) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.stepRepository = stepRepository;
    }

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public List<Recipe> getPublicRecipes() {
        return recipeRepository.findPublicRecipes();
    }

    public List<Recipe> getRecipesByAuthor(Long authorId) {
        return recipeRepository.findByAuthorId(authorId);
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public Recipe forkRecipe(Long recipeId, Long newUserId) {
        Recipe original = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (!original.getIsPublic()) {
            throw new RuntimeException("Cannot fork private recipe");
        }

        Recipe fork = new Recipe();
        fork.setTitle(original.getTitle());
        fork.setDescription(original.getDescription());
        fork.setPrepTime(original.getPrepTime());
        fork.setCookTime(original.getCookTime());
        fork.setServings(original.getServings());
        fork.setImageUrl(original.getImageUrl());
        fork.setIsPublic(false);
        fork.setCategoryTags(original.getCategoryTags());
        fork.setAuthorId(newUserId);
        fork.setForkedFromRecipeId(original.getId());
        fork.setOriginalAuthorId(original.getAuthorId());

        Long newId = recipeRepository.saveAndReturnId(fork);

        ingredientRepository.copyIngredients(original.getId(), newId);
        stepRepository.copySteps(original.getId(), newId);

        return recipeRepository.findById(newId)
                .orElseThrow(() -> new RuntimeException("Forked recipe not found"));
    }

    public void createRecipe(Recipe recipe) {
        recipeRepository.save(recipe);
    }

    public void updateRecipe(Recipe recipe) {
        recipeRepository.update(recipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}