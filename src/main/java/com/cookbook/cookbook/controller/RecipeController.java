package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // GET all recipes
    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    // GET public recipes
    @GetMapping("/public")
    public List<Recipe> getPublicRecipes() {
        return recipeService.getPublicRecipes();
    }

    // GET recipes by author
    @GetMapping("/author/{authorId}")
    public List<Recipe> getRecipesByAuthor(@PathVariable Long authorId) {
        return recipeService.getRecipesByAuthor(authorId);
    }

    // GET recipe by id
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create recipe
    @PostMapping
    public ResponseEntity<String> createRecipe(@RequestBody Recipe recipe) {
        recipeService.createRecipe(recipe);
        return ResponseEntity.ok("Recipe created successfully");
    }

    @PostMapping("/{id}/fork")
    public ResponseEntity<Recipe> forkRecipe(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        Recipe forkedRecipe = recipeService.forkRecipe(id, userId);
        return ResponseEntity.ok(forkedRecipe);
    }

    // PUT update recipe
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        recipe.setId(id);
        recipeService.updateRecipe(recipe);
        return ResponseEntity.ok("Recipe updated successfully");
    }

    // DELETE recipe
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok("Recipe deleted successfully");
    }
}