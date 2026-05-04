DROP ALL OBJECTS;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    role VARCHAR(10),
    profile_picture_url TEXT,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    prep_time INT,
    cook_time INT,
    servings INT,
    image_url TEXT,
    is_public BOOLEAN,
    category_tags VARCHAR(255),
    author_id BIGINT,
    forked_from_recipe_id BIGINT,
    original_author_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT,
    name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50),
    unit VARCHAR(50),
    order_index INT
);

CREATE TABLE steps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipe_id BIGINT,
    instruction TEXT NOT NULL,
    step_number INT NOT NULL
);

CREATE TABLE collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT,
    created_at TIMESTAMP
);

CREATE TABLE collection_recipes (
    collection_id BIGINT,
    recipe_id BIGINT,
    PRIMARY KEY (collection_id, recipe_id)
);

CREATE TABLE saved_recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    recipe_id BIGINT,
    original_author_id BIGINT,
    saved_at TIMESTAMP
);
