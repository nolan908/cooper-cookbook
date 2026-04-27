package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Step;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StepRepository {

    private final JdbcTemplate jdbcTemplate;

    public StepRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Step> stepRowMapper = (rs, rowNum) -> {
        Step step = new Step();
        step.setId(rs.getLong("id"));
        step.setRecipeId(rs.getLong("recipe_id"));
        step.setInstruction(rs.getString("instruction"));
        step.setStepNumber(rs.getInt("step_number"));
        return step;
    };

    public List<Step> findByRecipeId(Long recipeId) {
        return jdbcTemplate.query("SELECT * FROM steps WHERE recipe_id = ? ORDER BY step_number", stepRowMapper, recipeId);
    }

    public void deleteByRecipeId(Long recipeId) {
        jdbcTemplate.update("DELETE FROM steps WHERE recipe_id = ?", recipeId);
    }

    public void save(Step step) {
        jdbcTemplate.update(
                "INSERT INTO steps (recipe_id, instruction, step_number) VALUES (?, ?, ?)",
                step.getRecipeId(), step.getInstruction(), step.getStepNumber()
        );
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