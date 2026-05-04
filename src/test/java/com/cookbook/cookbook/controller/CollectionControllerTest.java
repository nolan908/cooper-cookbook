package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.service.CollectionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CollectionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CollectionService collectionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void testGetCollectionsByUser() throws Exception {
        when(collectionService.getCollectionsByUser(1L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/collections/user/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testCreateCollection() throws Exception {
        Collection collection = new Collection();
        collection.setName("My Collection");
        collection.setUserId(1L);
        
        doNothing().when(collectionService).createCollection(any(Collection.class));
        
        mockMvc.perform(post("/api/collections")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(collection)))
                .andExpect(status().isOk())
                .andExpect(content().string("Collection created successfully"));
    }

    @Test
    @WithMockUser
    public void testAddRecipeToCollection() throws Exception {
        doNothing().when(collectionService).addRecipeToCollection(eq(1L), eq(1L));
        mockMvc.perform(post("/api/collections/1/recipes/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe added to collection successfully"));
    }

    @Test
    @WithMockUser
    public void testRemoveRecipeFromCollection() throws Exception {
        doNothing().when(collectionService).removeRecipeFromCollection(eq(1L), eq(1L));
        mockMvc.perform(delete("/api/collections/1/recipes/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe removed from collection successfully"));
    }

    @Test
    @WithMockUser
    public void testGetRecipesInCollection() throws Exception {
        when(collectionService.getRecipesByCollectionId(1L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/collections/1/recipes"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testDeleteCollection() throws Exception {
        doNothing().when(collectionService).deleteCollection(1L);
        mockMvc.perform(delete("/api/collections/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Collection deleted successfully"));
    }
}
