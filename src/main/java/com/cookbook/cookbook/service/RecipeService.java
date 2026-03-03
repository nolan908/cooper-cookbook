package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
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