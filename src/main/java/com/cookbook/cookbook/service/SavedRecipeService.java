package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.SavedRecipe;
import com.cookbook.cookbook.repository.SavedRecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavedRecipeService {

    private final SavedRecipeRepository savedRecipeRepository;

    public SavedRecipeService(SavedRecipeRepository savedRecipeRepository) {
        this.savedRecipeRepository = savedRecipeRepository;
    }

    public List<SavedRecipe> getSavedRecipesByUser(Long userId) {
        return savedRecipeRepository.findByUserId(userId);
    }

    public Optional<SavedRecipe> getSavedRecipeById(Long id) {
        return savedRecipeRepository.findById(id);
    }

    public void saveRecipe(SavedRecipe savedRecipe) {
        savedRecipeRepository.save(savedRecipe);
    }

    public void deleteSavedRecipe(Long id) {
        savedRecipeRepository.deleteById(id);
    }
}
