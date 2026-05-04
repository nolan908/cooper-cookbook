package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.Recipe;
import com.cookbook.cookbook.service.RecipeService;
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
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RecipeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RecipeService recipeService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void testGetAllRecipes() throws Exception {
        when(recipeService.getAllRecipes()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testGetPublicRecipes() throws Exception {
        when(recipeService.getPublicRecipes()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/recipes/public"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testGetRecipeById() throws Exception {
        Recipe recipe = new Recipe();
        recipe.setId(1L);
        recipe.setTitle("Test Recipe");
        
        when(recipeService.getRecipeById(1L)).thenReturn(Optional.of(recipe));
        
        mockMvc.perform(get("/api/recipes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Recipe"));
    }

    @Test
    @WithMockUser
    public void testGetRecipeByIdNotFound() throws Exception {
        when(recipeService.getRecipeById(1L)).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/recipes/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    public void testGetRecipesByAuthor() throws Exception {
        when(recipeService.getRecipesByAuthor(1L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/recipes/author/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testCreateRecipe() throws Exception {
        Recipe recipe = new Recipe();
        recipe.setTitle("New Recipe");
        
        doNothing().when(recipeService).createRecipe(any(Recipe.class));
        
        mockMvc.perform(post("/api/recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipe)))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe created successfully"));
    }

    @Test
    @WithMockUser
    public void testUpdateRecipe() throws Exception {
        Recipe recipe = new Recipe();
        recipe.setId(1L);
        recipe.setTitle("Updated Recipe");
        
        doNothing().when(recipeService).updateRecipe(any(Recipe.class));
        
        mockMvc.perform(put("/api/recipes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(recipe)))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe updated successfully"));
    }

    @Test
    @WithMockUser
    public void testDeleteRecipe() throws Exception {
        doNothing().when(recipeService).deleteRecipe(1L);
        mockMvc.perform(delete("/api/recipes/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe deleted successfully"));
    }

    @Test
    @WithMockUser
    public void testForkRecipe() throws Exception {
        Recipe fork = new Recipe();
        fork.setId(2L);
        
        when(recipeService.forkRecipe(1L, 1L)).thenReturn(fork);
        
        mockMvc.perform(post("/api/recipes/1/fork").param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }
}
