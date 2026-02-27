package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private RowMapper<User> userRowMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPasswordHash(rs.getString("password_hash"));
        user.setDisplayName(rs.getString("display_name"));
        user.setBio(rs.getString("bio"));
        user.setRole(rs.getString("role"));
        return user;
    };

    public List<User> findAll() {
        return jdbcTemplate.query("SELECT * FROM users", userRowMapper);
    }

    public Optional<User> findById(Long id) {
        List<User> users = jdbcTemplate.query("SELECT * FROM users WHERE id = ?", userRowMapper, id);
        return users.stream().findFirst();
    }

    public Optional<User> findByUsername(String username) {
        List<User> users = jdbcTemplate.query("SELECT * FROM users WHERE username = ?", userRowMapper, username);
        return users.stream().findFirst();
    }

    public void save(User user) {
        jdbcTemplate.update(
                "INSERT INTO users (username, email, password_hash, display_name, bio, role) VALUES (?, ?, ?, ?, ?, ?)",
                user.getUsername(), user.getEmail(), user.getPasswordHash(),
                user.getDisplayName(), user.getBio(), user.getRole()
        );
    }

    public void update(User user) {
        jdbcTemplate.update(
                "UPDATE users SET username=?, email=?, display_name=?, bio=? WHERE id=?",
                user.getUsername(), user.getEmail(), user.getDisplayName(), user.getBio(), user.getId()
        );
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM users WHERE id = ?", id);
    }
}