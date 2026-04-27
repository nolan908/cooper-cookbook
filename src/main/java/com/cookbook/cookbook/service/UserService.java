package com.cookbook.cookbook.service;

import com.cookbook.cookbook.model.User;
import com.cookbook.cookbook.repository.UserRepository;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public String generateResetToken(String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    String token = UUID.randomUUID().toString();
                    userRepository.updateResetToken(user.getId(), token, LocalDateTime.now().plusHours(1));
                    return token;
                })
                .orElseThrow(() -> new RuntimeException("No user found with that email"));
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.updateAccount(user); // Reuse updateAccount which updates password
        userRepository.clearResetToken(user.getId());
    }

    public void createUser(User user) {
        user.setRole("USER");
        userRepository.save(user);
    }

    public void updateProfile(User user) {
        userRepository.updateProfile(user);
    }

    public void updateAccount(Long id, String oldPassword, String newUsername, String newPassword) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, existing.getPasswordHash())) {
            throw new RuntimeException("Incorrect current password");
        }

        if (newUsername != null && !newUsername.isEmpty()) {
            existing.setUsername(newUsername);
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            existing.setPasswordHash(passwordEncoder.encode(newPassword));
        }

        userRepository.updateAccount(existing);
    }

    public void updateUser(User user) {
        userRepository.update(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean verifyPassword(Long id, String password) {
        return userRepository.findById(id)
                .map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElse(false);
    }
}
