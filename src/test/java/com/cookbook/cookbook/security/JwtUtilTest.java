package com.cookbook.cookbook.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil("testSecretKey123456789012345678901234567890");
    }

    @Test
    public void testGenerateAndValidateToken() {
        String username = "testuser";
        String token = jwtUtil.generateToken(username);
        
        assertNotNull(token);
        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals(username, jwtUtil.extractUsername(token));
    }

    @Test
    public void testInvalidToken() {
        String token = "invalid.token.here";
        assertFalse(jwtUtil.isTokenValid(token));
    }
}
