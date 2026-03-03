package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.SavedRecipe;
import com.cookbook.cookbook.service.SavedRecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-recipes")
public class SavedRecipeController {

    private final SavedRecipeService savedRecipeService;

    public SavedRecipeController(SavedRecipeService savedRecipeService) {
        this.savedRecipeService = savedRecipeService;
    }

    // GET saved recipes by user
    @GetMapping("/user/{userId}")
    public List<SavedRecipe> getSavedRecipesByUser(@PathVariable Long userId) {
        return savedRecipeService.getSavedRecipesByUser(userId);
    }

    // GET saved recipe by id
    @GetMapping("/{id}")
    public ResponseEntity<SavedRecipe> getSavedRecipeById(@PathVariable Long id) {
        return savedRecipeService.getSavedRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST save a recipe
    @PostMapping
    public ResponseEntity<String> saveRecipe(@RequestBody SavedRecipe savedRecipe) {
        savedRecipeService.saveRecipe(savedRecipe);
        return ResponseEntity.ok("Recipe saved successfully");
    }

    // DELETE remove saved recipe
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSavedRecipe(@PathVariable Long id) {
        savedRecipeService.deleteSavedRecipe(id);
        return ResponseEntity.ok("Saved recipe deleted successfully");
    }
}