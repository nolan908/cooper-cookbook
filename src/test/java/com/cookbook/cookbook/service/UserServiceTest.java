package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.User;
import com.cookbook.cookbook.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Should find user by username")
    void testGetUserByUsername() {
        User user = new User();
        user.setUsername("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByUsername("testuser");

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    @DisplayName("Should generate reset token")
    void testGenerateResetToken() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        String token = userService.generateResetToken("test@example.com");

        assertNotNull(token);
        verify(userRepository, times(1)).updateResetToken(eq(1L), anyString(), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should reset password with valid token")
    void testResetPassword() {
        User user = new User();
        user.setId(1L);
        user.setResetToken("valid-token");
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        
        when(userRepository.findByResetToken("valid-token")).thenReturn(Optional.of(user));

        userService.resetPassword("valid-token", "new-password");

        verify(userRepository, times(1)).updateAccount(user);
        verify(userRepository, times(1)).clearResetToken(1L);
    }
}
