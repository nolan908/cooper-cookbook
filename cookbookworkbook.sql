CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    role VARCHAR(10) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
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
    saved_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_recipes_public ON recipes(is_public);
CREATE INDEX idx_saved_recipes_user ON saved_recipes(user_id);
