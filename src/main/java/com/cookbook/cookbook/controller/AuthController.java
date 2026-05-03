package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.User;
import com.cookbook.cookbook.repository.UserRepository;
import com.cookbook.cookbook.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/validate-step1")
    public ResponseEntity<String> validateStep1(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email = body.get("email");

        if (username != null && userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        if (email != null && userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already taken");
        }
        return ResponseEntity.ok("Valid");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> body) {
        logger.info("Registration attempt for username: {}", body.get("username"));
        try {
            String username = body.get("username");
            String email = body.get("email");
            String password = body.get("password");
            String displayName = body.get("displayName");
            String bio = body.get("bio");
            String profilePictureUrl = body.get("profilePictureUrl");

            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("Username, email, and password are required");
            }

            Optional<User> existing = userRepository.findByUsername(username);
            if (existing.isPresent()) {
                logger.warn("Username already taken: {}", username);
                return ResponseEntity.badRequest().body("Username already taken");
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setDisplayName(displayName);
            user.setBio(bio);
            user.setProfilePictureUrl(profilePictureUrl);
            user.setRole("USER");

            userRepository.save(user);
            logger.info("User registered successfully: {}", username);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            logger.error("Error during registration", e);
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        logger.info("Login attempt for user: {}, password: {}", username, password);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
