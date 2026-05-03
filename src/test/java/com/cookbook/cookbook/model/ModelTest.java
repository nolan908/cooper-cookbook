package com.cookbook.cookbook.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ModelTest {

    @Test
    public void testIngredient() {
        Ingredient ing = new Ingredient();
        ing.setId(1L);
        ing.setRecipeId(2L);
        ing.setName("Salt");
        ing.setQuantity("1");
        ing.setUnit("tsp");
        ing.setOrderIndex(0);

        assertEquals(1L, ing.getId());
        assertEquals(2L, ing.getRecipeId());
        assertEquals("Salt", ing.getName());
        assertEquals("1", ing.getQuantity());
        assertEquals("tsp", ing.getUnit());
        assertEquals(0, ing.getOrderIndex());
    }

    @Test
    public void testStep() {
        Step step = new Step();
        step.setId(1L);
        step.setRecipeId(2L);
        step.setInstruction("Boil water");
        step.setStepNumber(1);

        assertEquals(1L, step.getId());
        assertEquals(2L, step.getRecipeId());
        assertEquals("Boil water", step.getInstruction());
        assertEquals(1, step.getStepNumber());
    }

    @Test
    public void testSavedRecipe() {
        SavedRecipe sr = new SavedRecipe();
        sr.setId(1L);
        sr.setUserId(2L);
        sr.setRecipeId(3L);
        sr.setOriginalAuthorId(4L);

        assertEquals(1L, sr.getId());
        assertEquals(2L, sr.getUserId());
        assertEquals(3L, sr.getRecipeId());
        assertEquals(4L, sr.getOriginalAuthorId());
    }

    @Test
    public void testCollection() {
        Collection c = new Collection();
        c.setId(1L);
        c.setUserId(2L);
        c.setName("C");

        assertEquals(1L, c.getId());
        assertEquals(2L, c.getUserId());
        assertEquals("C", c.getName());
    }
}
