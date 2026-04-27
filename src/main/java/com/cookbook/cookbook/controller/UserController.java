package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.User;
import com.cookbook.cookbook.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create user
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.ok("User created successfully");
    }

    // PUT update user profile (bio, display name)
    @PutMapping("/{id}/profile")
    public ResponseEntity<String> updateProfile(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userService.updateProfile(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // PUT update account (username, password) with old password verification
    @PutMapping("/{id}/account")
    public ResponseEntity<String> updateAccount(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        String oldPassword = body.get("oldPassword");
        String newUsername = body.get("newUsername");
        String newPassword = body.get("newPassword");

        try {
            userService.updateAccount(id, oldPassword, newUsername, newPassword);
            return ResponseEntity.ok("Account updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // POST forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        logger.info("Forgot password request for email: {}", email);
        try {
            String token = userService.generateResetToken(email);
            // In a real app, this would trigger an email.
            // For this demo, we print the reset link to the console.
            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            logger.info("SIMULATION: Reset link for {}: {}", email, resetLink);
            return ResponseEntity.ok("Reset link sent to " + email);
        } catch (RuntimeException e) {
            logger.error("Error generating reset token for email {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST reset password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        try {
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST verify password
    @PostMapping("/{id}/verify-password")
    public ResponseEntity<Boolean> verifyPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String password = body.get("password");
        boolean isValid = userService.verifyPassword(id, password);
        System.out.println("DEBUG: verifyPassword for user " + id + ", result: " + isValid);
        return ResponseEntity.ok(isValid);
    }
}
