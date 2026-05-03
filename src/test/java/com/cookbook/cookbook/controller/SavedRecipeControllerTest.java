package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.SavedRecipe;
import com.cookbook.cookbook.service.SavedRecipeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SavedRecipeController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class SavedRecipeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SavedRecipeService savedRecipeService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    public void testGetSavedRecipesByUser() throws Exception {
        when(savedRecipeService.getSavedRecipesByUser(1L)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/saved-recipes/user/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser
    public void testSaveRecipe() throws Exception {
        SavedRecipe sr = new SavedRecipe();
        sr.setRecipeId(1L);
        sr.setUserId(1L);
        
        doNothing().when(savedRecipeService).saveRecipe(any(SavedRecipe.class));
        
        mockMvc.perform(post("/api/saved-recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sr)))
                .andExpect(status().isOk())
                .andExpect(content().string("Recipe saved successfully"));
    }

    @Test
    @WithMockUser
    public void testDeleteSavedRecipe() throws Exception {
        doNothing().when(savedRecipeService).deleteSavedRecipe(1L);
        mockMvc.perform(delete("/api/saved-recipes/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Saved recipe deleted successfully"));
    }
}
