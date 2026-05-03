package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import(UserRepository.class)
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveAndFind() {
        User user = new User();
        user.setUsername("nolan");
        user.setEmail("nolan@test.com");
        user.setPasswordHash("hash");
        user.setDisplayName("Nolan");
        
        userRepository.save(user);
        
        Optional<User> found = userRepository.findByUsername("nolan");
        assertTrue(found.isPresent());
        assertEquals("nolan@test.com", found.get().getEmail());
    }

    @Test
    public void testFindById() {
        User user = new User();
        user.setUsername("idtest");
        user.setEmail("id@test.com");
        user.setPasswordHash("h");
        userRepository.save(user);
        
        User saved = userRepository.findByUsername("idtest").get();
        Optional<User> found = userRepository.findById(saved.getId());
        assertTrue(found.isPresent());
    }

    @Test
    public void testFindAll() {
        User u1 = new User();
        u1.setUsername("u1"); u1.setEmail("e1"); u1.setPasswordHash("p");
        userRepository.save(u1);
        
        List<User> all = userRepository.findAll();
        assertFalse(all.isEmpty());
    }

    @Test
    public void testUpdate() {
        User user = new User();
        user.setUsername("old"); user.setEmail("old@e.com"); user.setPasswordHash("p");
        userRepository.save(user);
        
        User saved = userRepository.findByUsername("old").get();
        saved.setDisplayName("Updated");
        userRepository.update(saved);
        
        User updated = userRepository.findById(saved.getId()).get();
        assertEquals("Updated", updated.getDisplayName());
    }

    @Test
    public void testDelete() {
        User user = new User();
        user.setUsername("del"); user.setEmail("del@e.com"); user.setPasswordHash("p");
        userRepository.save(user);
        
        User saved = userRepository.findByUsername("del").get();
        userRepository.deleteById(saved.getId());
        
        Optional<User> found = userRepository.findById(saved.getId());
        assertFalse(found.isPresent());
    }
    
    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setUsername("emailtest");
        user.setEmail("unique@test.com");
        user.setPasswordHash("hash");
        userRepository.save(user);
        
        Optional<User> found = userRepository.findByEmail("unique@test.com");
        assertTrue(found.isPresent());
        assertEquals("emailtest", found.get().getUsername());
    }
}
