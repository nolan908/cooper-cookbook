package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
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
        user.setProfilePictureUrl(rs.getString("profile_picture_url"));
        user.setRole(rs.getString("role"));
        user.setResetToken(rs.getString("reset_token"));
        Timestamp expiry = rs.getTimestamp("reset_token_expiry");
        if (expiry != null) {
            user.setResetTokenExpiry(expiry.toLocalDateTime());
        }
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

    public Optional<User> findByEmail(String email) {
        List<User> users = jdbcTemplate.query("SELECT * FROM users WHERE email = ?", userRowMapper, email);
        return users.stream().findFirst();
    }

    public Optional<User> findByResetToken(String token) {
        List<User> users = jdbcTemplate.query("SELECT * FROM users WHERE reset_token = ?", userRowMapper, token);
        return users.stream().findFirst();
    }

    public void updateResetToken(Long userId, String token, LocalDateTime expiry) {
        jdbcTemplate.update(
                "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
                token, Timestamp.valueOf(expiry), userId
        );
    }

    public void clearResetToken(Long userId) {
        jdbcTemplate.update(
                "UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
                userId
        );
    }

    public void save(User user) {
        jdbcTemplate.update(
                "INSERT INTO users (username, email, password_hash, display_name, bio, profile_picture_url, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
                user.getUsername(), user.getEmail(), user.getPasswordHash(),
                user.getDisplayName(), user.getBio(), user.getProfilePictureUrl(), user.getRole()
        );
    }

    public void updateProfile(User user) {
        jdbcTemplate.update(
                "UPDATE users SET display_name=?, bio=?, profile_picture_url=? WHERE id=?",
                user.getDisplayName(), user.getBio(), user.getProfilePictureUrl(), user.getId()
        );
    }

    public void updateAccount(User user) {
        jdbcTemplate.update(
                "UPDATE users SET username=?, password_hash=? WHERE id=?",
                user.getUsername(), user.getPasswordHash(), user.getId()
        );
    }

    public void update(User user) {
        jdbcTemplate.update(
                "UPDATE users SET username=?, email=?, display_name=?, bio=?, profile_picture_url=? WHERE id=?",
                user.getUsername(), user.getEmail(), user.getDisplayName(), user.getBio(), user.getProfilePictureUrl(), user.getId()
        );
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM users WHERE id = ?", id);
    }
}
