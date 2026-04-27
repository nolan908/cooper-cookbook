package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.repository.CollectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CollectionService {

    private final CollectionRepository collectionRepository;

    public CollectionService(CollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    public List<Collection> getCollectionsByUser(Long userId) {
        return collectionRepository.findByUserId(userId);
    }

    public Optional<Collection> getCollectionById(Long id) {
        return collectionRepository.findById(id);
    }

    public void createCollection(Collection collection) {
        collectionRepository.save(collection);
    }

    public void updateCollection(Collection collection) {
        collectionRepository.update(collection);
    }

    public void deleteCollection(Long id) {
        collectionRepository.deleteById(id);
    }

    public void addRecipeToCollection(Long collectionId, Long recipeId) {
        collectionRepository.addRecipeToCollection(collectionId, recipeId);
    }

    public void removeRecipeFromCollection(Long collectionId, Long recipeId) {
        collectionRepository.removeRecipeFromCollection(collectionId, recipeId);
    }

    public List<Recipe> getRecipesByCollectionId(Long collectionId) {
        return collectionRepository.findRecipesByCollectionId(collectionId);
    }
}
