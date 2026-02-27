package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.service.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    // GET all collections
    @GetMapping
    public List<Collection> getAllCollections() {
        return collectionService.getAllCollections();
    }

    // GET collections by user
    @GetMapping("/user/{userId}")
    public List<Collection> getCollectionsByUser(@PathVariable Long userId) {
        return collectionService.getCollectionsByUser(userId);
    }

    // GET collection by id
    @GetMapping("/{id}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable Long id) {
        return collectionService.getCollectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create collection
    @PostMapping
    public ResponseEntity<String> createCollection(@RequestBody Collection collection) {
        collectionService.createCollection(collection);
        return ResponseEntity.ok("Collection created successfully");
    }

    // PUT update collection
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCollection(@PathVariable Long id, @RequestBody Collection collection) {
        collection.setId(id);
        collectionService.updateCollection(collection);
        return ResponseEntity.ok("Collection updated successfully");
    }

    // DELETE collection
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.ok("Collection deleted successfully");
    }

    // POST add recipe to collection
    @PostMapping("/{collectionId}/recipes/{recipeId}")
    public ResponseEntity<String> addRecipeToCollection(@PathVariable Long collectionId, @PathVariable Long recipeId) {
        collectionService.addRecipeToCollection(collectionId, recipeId);
        return ResponseEntity.ok("Recipe added to collection successfully");
    }

    // DELETE remove recipe from collection
    @DeleteMapping("/{collectionId}/recipes/{recipeId}")
    public ResponseEntity<String> removeRecipeFromCollection(@PathVariable Long collectionId, @PathVariable Long recipeId) {
        collectionService.removeRecipeFromCollection(collectionId, recipeId);
        return ResponseEntity.ok("Recipe removed from collection successfully");
    }
}