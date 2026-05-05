-- CLEAN SLATE
DROP TABLE IF EXISTS saved_recipes CASCADE;
DROP TABLE IF EXISTS collection_recipes CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS steps CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    role VARCHAR(10) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    profile_picture_url TEXT,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    prep_time INT,
    cook_time INT,
    servings INT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    category_tags VARCHAR(255),
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    forked_from_recipe_id INT REFERENCES recipes(id) ON DELETE SET NULL,
    original_author_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50),
    unit VARCHAR(50),
    order_index INT
);

CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    instruction TEXT NOT NULL,
    step_number INT NOT NULL
);

CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE collection_recipes (
    collection_id INT REFERENCES collections(id) ON DELETE CASCADE,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, recipe_id)
);

CREATE TABLE saved_recipes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    original_author_id INT REFERENCES users(id),
    saved_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- SEED DATA
-- Passwords are 'password123'
INSERT INTO users (username, email, password_hash, display_name, bio, role, profile_picture_url) VALUES 
('user1', 'user1@example.com', '$2a$10$BnuLUiy1w73sm6BmUzlGq.i..db4KIvpnKXylG/bZ1S3a/I.5ITua', 'Chef Nolan', 'Specializing in high-performance recipes.', 'USER', 'https://cdn-icons-png.flaticon.com/512/1154/1154444.png'),
('user2', 'user2@example.com', '$2a$10$P6GC6ycqzWAr9v6nmy7NaewiakET0qNG4dWutdTVFRj0KUeVJTX.a', 'Chef Alex', 'Traditional heritage cooking enthusiast.', 'USER', 'https://cdn-icons-png.flaticon.com/512/1154/1154460.png');

-- 4 Original Recipes
INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id) VALUES 
(1, 'Classic Lasagna', 'Layers of beef, cheese, and pasta.', 30, 60, 8, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', true, 'Dinner, Italian', 1),
(2, 'Midnight Ramen', 'Quick noodles for late night sessions.', 5, 10, 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', true, 'Fast, Asian', 2),
(3, 'Tinned Fish Toast', 'Artisanal sardines on sourdough.', 5, 5, 1, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800', true, 'Seafood, Lunch', 1),
(4, 'Greek Salad', 'Fresh cucumber, olives, and feta.', 15, 0, 2, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', true, 'Healthy, Salad', 2);

-- 1 Forked Recipe: User 2 forks Nolan's Lasagna and adds Spicy tags
INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id, forked_from_recipe_id, original_author_id) VALUES 
(5, 'Spicy Lasagna', 'Nolan''s classic Lasagna with a spicy chili kick.', 30, 65, 8, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', true, 'Dinner, Italian, Spicy', 2, 1, 1);

-- Reset sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));

-- Ingredients for Original 1
INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES 
(1, 'Beef', '1', 'lb', 0), (1, 'Pasta Sheets', '12', 'sheets', 1), (1, 'Mozzarella', '2', 'cups', 2);
-- Ingredients for Fork 5
INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES 
(5, 'Beef', '1', 'lb', 0), (5, 'Pasta Sheets', '12', 'sheets', 1), (5, 'Mozzarella', '2', 'cups', 2), (5, 'Red Chili Flakes', '3', 'tbsp', 3);

-- Steps
INSERT INTO steps (recipe_id, instruction, step_number) VALUES 
(1, 'Prepare the meat sauce.', 1), (1, 'Layer pasta and cheese.', 2), (1, 'Bake at 375F.', 3),
(5, 'Prepare the meat sauce with extra chili.', 1), (5, 'Layer pasta and cheese.', 2), (5, 'Bake at 375F for 5 mins longer.', 3);

-- Collections
INSERT INTO collections (id, user_id, name, description, order_index) VALUES 
(1, 1, 'Quick Bites', 'Recipes that take less than 15 minutes.', 0),
(2, 2, 'Weekend Dinner', 'Heavy meals for the family.', 0);

-- Recipes in Collections
-- Nolan's Quick Bites: Ramen(2), Fish Toast(3), Salad(4) (3 recipes)
INSERT INTO collection_recipes (collection_id, recipe_id) VALUES (1, 2), (1, 3), (1, 4);
-- Alex's Weekend Dinner: Classic Lasagna(1), Spicy Lasagna(5) (2 recipes)
INSERT INTO collection_recipes (collection_id, recipe_id) VALUES (2, 1), (2, 5);

-- Final Stash entries so they show up for the users
INSERT INTO saved_recipes (user_id, recipe_id, original_author_id) VALUES (1, 2, 2), (1, 3, 1), (1, 4, 2);
INSERT INTO saved_recipes (user_id, recipe_id, original_author_id) VALUES (2, 1, 1), (2, 5, 2);
