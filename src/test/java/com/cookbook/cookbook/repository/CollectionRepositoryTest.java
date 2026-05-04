package com.cookbook.cookbook.repository;

import com.cookbook.cookbook.model.Collection;
import com.cookbook.cookbook.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@JdbcTest
@Sql("/init.sql")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Import({CollectionRepository.class, UserRepository.class})
public class CollectionRepositoryTest {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private UserRepository userRepository;

    private Long userId;

    @BeforeEach
    public void setUp() {
        User user = new User();
        user.setUsername("collector");
        user.setEmail("c@t.com");
        user.setPasswordHash("h");
        userRepository.save(user);
        userId = userRepository.findByUsername("collector").get().getId();
    }

    @Test
    public void testSaveAndFind() {
        Collection c = new Collection();
        c.setName("Test Collection");
        c.setUserId(userId);
        
        collectionRepository.save(c);
        
        List<Collection> found = collectionRepository.findByUserId(userId);
        assertFalse(found.isEmpty());
        assertEquals("Test Collection", found.get(0).getName());
    }

    @Test
    public void testUpdate() {
        Collection c = new Collection();
        c.setName("Old"); c.setUserId(userId);
        collectionRepository.save(c);
        
        Collection saved = collectionRepository.findByUserId(userId).get(0);
        saved.setName("New");
        collectionRepository.update(saved);
        
        Collection updated = collectionRepository.findById(saved.getId()).get();
        assertEquals("New", updated.getName());
    }

    @Test
    public void testDelete() {
        Collection c = new Collection();
        c.setName("Del"); c.setUserId(userId);
        collectionRepository.save(c);
        
        Collection saved = collectionRepository.findByUserId(userId).get(0);
        collectionRepository.deleteById(saved.getId());
        
        assertFalse(collectionRepository.findById(saved.getId()).isPresent());
    }
}
