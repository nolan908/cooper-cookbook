package com.cookbook.cookbook.controller;

import com.cookbook.cookbook.model.User;
import com.cookbook.cookbook.repository.UserRepository;
import com.cookbook.cookbook.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    private AuthController authController;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        authController = new AuthController(userRepository, jwtUtil);
    }

    @Test
    @DisplayName("Registration - Success")
    void testRegisterSuccess() {
        Map<String, String> body = new HashMap<>();
        body.put("username", "nolan");
        body.put("email", "nolan@test.com");
        body.put("password", "password123");

        when(userRepository.findByUsername("nolan")).thenReturn(Optional.empty());

        ResponseEntity<String> response = authController.register(body);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("User registered successfully", response.getBody());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Registration - Fail when username exists")
    void testRegisterFailExists() {
        Map<String, String> body = new HashMap<>();
        body.put("username", "exists");
        body.put("email", "test@test.com");
        body.put("password", "pass");

        when(userRepository.findByUsername("exists")).thenReturn(Optional.of(new User()));

        ResponseEntity<String> response = authController.register(body);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Username already taken", response.getBody());
    }

    @Test
    @DisplayName("Login - Success")
    void testLoginSuccess() {
        User user = new User();
        user.setUsername("nolan");
        user.setPasswordHash(encoder.encode("secret"));

        Map<String, String> creds = new HashMap<>();
        creds.put("username", "nolan");
        creds.put("password", "secret");

        when(userRepository.findByUsername("nolan")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("nolan")).thenReturn("fake-token");

        ResponseEntity<?> response = authController.login(creds);

        assertEquals(200, response.getStatusCode().value());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("fake-token", responseBody.get("token"));
    }

    @Test
    @DisplayName("Login - Invalid Password")
    void testLoginInvalidPassword() {
        User user = new User();
        user.setUsername("nolan");
        user.setPasswordHash(encoder.encode("correct-pass"));

        Map<String, String> creds = new HashMap<>();
        creds.put("username", "nolan");
        creds.put("password", "wrong-pass");

        when(userRepository.findByUsername("nolan")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.login(creds);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Invalid password", response.getBody());
    }

    @Test
    @DisplayName("Validate Step 1 - Success")
    void testValidateStep1Success() {
        Map<String, String> body = Map.of("username", "new", "email", "new@test.com");
        when(userRepository.findByUsername("new")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());

        ResponseEntity<String> response = authController.validateStep1(body);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Valid", response.getBody());
    }

    @Test
    @DisplayName("Validate Step 1 - Username Taken")
    void testValidateStep1UsernameTaken() {
        Map<String, String> body = Map.of("username", "taken", "email", "new@test.com");
        when(userRepository.findByUsername("taken")).thenReturn(Optional.of(new User()));

        ResponseEntity<String> response = authController.validateStep1(body);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Username already taken", response.getBody());
    }

    @Test
    @DisplayName("Validate Step 1 - Email Taken")
    void testValidateStep1EmailTaken() {
        Map<String, String> body = Map.of("username", "new", "email", "taken@test.com");
        when(userRepository.findByUsername("new")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("taken@test.com")).thenReturn(Optional.of(new User()));

        ResponseEntity<String> response = authController.validateStep1(body);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Email already taken", response.getBody());
    }
}
