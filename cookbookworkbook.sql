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
    image_url VARCHAR(500),
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

CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_recipes_public ON recipes(is_public);
CREATE INDEX idx_saved_recipes_user ON saved_recipes(user_id);

-- SEED DATA
INSERT INTO users (username, email, password_hash, display_name, bio, role, profile_picture_url) VALUES 
('user1', 'user1@example.com', '$2a$10$BnuLUiy1w73sm6BmUzlGq.i..db4KIvpnKXylG/bZ1S3a/I.5ITua', 'Chef One', 'Master of the high seas and tinned fish.', 'USER', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRecT6HAfwB-DWQ_3c1n4cLtBdNE0dzVqfiooFwq_0OCQ&s'),
('user2', 'user2@example.com', '$2a$10$P6GC6ycqzWAr9v6nmy7NaewiakET0qNG4dWutdTVFRj0KUeVJTX.a', 'Gourmet Gal', 'Looking for the perfect smoked trout.', 'USER', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400');

INSERT INTO recipes (title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id) VALUES 
('Smoked Trout Toast', 'Crispy sourdough topped with premium smoked trout, creme fraiche, and fresh dill.', 10, 5, 2, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800', true, 'Breakfast, Seafood', 1),
('Spicy Sardine Pasta', 'A quick pantry staple featuring olive oil sardines, red pepper flakes, and lemon.', 5, 12, 1, 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800', true, 'Lunch, Spicy', 1),
('Lemon Garlic Mackerel', 'Mediterranean style mackerel fillets served over a bed of seasonal greens.', 15, 0, 1, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', true, 'Healthy, Salad', 2);

INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES 
(1, 'Smoked Trout', '1', 'can', 0),
(1, 'Sourdough Bread', '2', 'slices', 1),
(1, 'Creme Fraiche', '2', 'tbsp', 2),
(2, 'Sardines in Oil', '1', 'can', 0),
(2, 'Spaghetti', '100', 'g', 1);

INSERT INTO steps (recipe_id, instruction, step_number) VALUES 
(1, 'Toast the sourdough until golden and crisp.', 1),
(1, 'Spread a thick layer of creme fraiche.', 2),
(1, 'Top with flaked trout and fresh dill.', 3),
(2, 'Boil pasta in salted water.', 1),
(2, 'Sauté sardines with garlic and chili flakes.', 2);

INSERT INTO collections (user_id, name, description, order_index) VALUES 
(1, 'Summer Pantry', 'Light and refreshing tinned fish favorites.', 0);
