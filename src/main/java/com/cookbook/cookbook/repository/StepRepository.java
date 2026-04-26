package com.cookbook.cookbook.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class StepRepository {

    private final JdbcTemplate jdbcTemplate;

    public StepRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void copySteps(Long originalRecipeId, Long newRecipeId) {
        jdbcTemplate.update(
                "INSERT INTO steps (recipe_id, instruction, step_number) " +
                        "SELECT ?, instruction, step_number " +
                        "FROM steps WHERE recipe_id = ?",
                newRecipeId,
                originalRecipeId
        );
    }
}