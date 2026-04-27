package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.repository.CollectionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollectionServiceTest {

    @Mock
    private CollectionRepository collectionRepository;

    @InjectMocks
    private CollectionService collectionService;

    @Test
    @DisplayName("Test Add Recipe to Collection")
    void testAddRecipeToCollection() {
        collectionService.addRecipeToCollection(1L, 10L);
        verify(collectionRepository, times(1)).addRecipeToCollection(1L, 10L);
    }

    @Test
    @DisplayName("Test Get Recipes in Collection")
    void testGetRecipesByCollectionId() {
        Recipe r1 = new Recipe(); r1.setId(10L);
        Recipe r2 = new Recipe(); r2.setId(20L);
        when(collectionRepository.findRecipesByCollectionId(1L)).thenReturn(Arrays.asList(r1, r2));

        List<Recipe> result = collectionService.getRecipesByCollectionId(1L);

        assertEquals(2, result.size());
        assertEquals(10L, result.get(0).getId());
    }

    @Test
    @DisplayName("Test Create Collection")
    void testCreateCollection() {
        Collection c = new Collection();
        c.setName("Favorites");
        collectionService.createCollection(c);
        verify(collectionRepository, times(1)).save(c);
    }
}
