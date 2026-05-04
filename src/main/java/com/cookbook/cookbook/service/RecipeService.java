package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.model.Ingredient;
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
        return recipeRepository.findById(id).map(recipe -> {
            recipe.setIngredients(ingredientRepository.findByRecipeId(id));
            recipe.setSteps(stepRepository.findByRecipeId(id));
            return recipe;
        });
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

    private void validateIngredients(List<Ingredient> ingredients) {
        if (ingredients == null) return;
        for (Ingredient ing : ingredients) {
            if (ing.getQuantity() != null) {
                if (ing.getQuantity() < 0) {
                    throw new RuntimeException("Ingredient quantity cannot be negative: " + ing.getName());
                }
            }
        }
    }

    public void createRecipe(Recipe recipe) {
        if (recipeRepository.existsByTitleAndAuthorId(recipe.getTitle(), recipe.getAuthorId())) {
            throw new RuntimeException("You already have a recipe with this title.");
        }

        validateIngredients(recipe.getIngredients());

        Long newId = recipeRepository.saveAndReturnId(recipe);
        if (recipe.getIngredients() != null) {
            recipe.getIngredients().forEach(i -> {
                i.setRecipeId(newId);
                ingredientRepository.save(i);
            });
        }
        if (recipe.getSteps() != null) {
            recipe.getSteps().forEach(s -> {
                s.setRecipeId(newId);
                stepRepository.save(s);
            });
        }
    }

    public void updateRecipe(Recipe recipe) {
        Optional<Recipe> existing = recipeRepository.findById(recipe.getId());
        if (existing.isPresent() && !existing.get().getTitle().equals(recipe.getTitle())) {
            if (recipeRepository.existsByTitleAndAuthorId(recipe.getTitle(), recipe.getAuthorId())) {
                throw new RuntimeException("You already have another recipe with this title.");
            }
        }

        validateIngredients(recipe.getIngredients());

        recipeRepository.update(recipe);

        ingredientRepository.deleteByRecipeId(recipe.getId());
        if (recipe.getIngredients() != null) {
            recipe.getIngredients().forEach(i -> {
                i.setRecipeId(recipe.getId());
                ingredientRepository.save(i);
            });
        }

        stepRepository.deleteByRecipeId(recipe.getId());
        if (recipe.getSteps() != null) {
            recipe.getSteps().forEach(s -> {
                s.setRecipeId(recipe.getId());
                stepRepository.save(s);
            });
        }
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}
