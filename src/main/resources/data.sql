INSERT INTO users (id, username, email, password_hash, display_name, bio, role, profile_picture_url) VALUES
(1, 'user1', 'user1@example.com', '$2a$10$BnuLUiy1w73sm6BmUzlGq.i..db4KIvpnKXylG/bZ1S3a/I.5ITua', 'Chef Nolan', 'Specializing in high-performance recipes.', 'USER', 'https://cdn-icons-png.flaticon.com/512/1154/1154444.png'),
(2, 'user2', 'user2@example.com', '$2a$10$P6GC6ycqzWAr9v6nmy7NaewiakET0qNG4dWutdTVFRj0KUeVJTX.a', 'Chef Alex', 'Traditional heritage cooking enthusiast.', 'USER', 'https://cdn-icons-png.flaticon.com/512/1154/1154460.png')
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id) VALUES
(1, 'Classic Lasagna', 'Layers of beef, cheese, and pasta.', 30, 60, 8, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', true, 'Dinner, Italian', 1),
(2, 'Midnight Ramen', 'Quick noodles for late night sessions.', 5, 10, 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', true, 'Fast, Asian', 2),
(3, 'Tinned Fish Toast', 'Artisanal sardines on sourdough.', 5, 5, 1, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800', true, 'Seafood, Lunch', 1),
(4, 'Greek Salad', 'Fresh cucumber, olives, and feta.', 15, 0, 2, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', true, 'Healthy, Salad', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, image_url, is_public, category_tags, author_id, forked_from_recipe_id, original_author_id) VALUES
(5, 'Spicy Lasagna', 'Nolan''s classic Lasagna with a spicy chili kick.', 30, 65, 8, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', true, 'Dinner, Italian, Spicy', 2, 1, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity, unit, order_index) VALUES
(1, 'Beef', '1', 'lb', 0),
(1, 'Pasta Sheets', '12', 'sheets', 1),
(1, 'Mozzarella', '2', 'cups', 2),
(5, 'Beef', '1', 'lb', 0),
(5, 'Pasta Sheets', '12', 'sheets', 1),
(5, 'Mozzarella', '2', 'cups', 2),
(5, 'Red Chili Flakes', '3', 'tbsp', 3)
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, instruction, step_number) VALUES
(1, 'Prepare the meat sauce.', 1),
(1, 'Layer pasta and cheese.', 2),
(1, 'Bake at 375F.', 3),
(5, 'Prepare the meat sauce with extra chili.', 1),
(5, 'Layer pasta and cheese.', 2),
(5, 'Bake at 375F for 5 mins longer.', 3)
ON CONFLICT DO NOTHING;

INSERT INTO collections (id, user_id, name, description, order_index) VALUES
(1, 1, 'Quick Bites', 'Recipes that take less than 15 minutes.', 0),
(2, 2, 'Weekend Dinner', 'Heavy meals for the family.', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO collection_recipes (collection_id, recipe_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 5)
ON CONFLICT DO NOTHING;

INSERT INTO saved_recipes (user_id, recipe_id, original_author_id) VALUES
(1, 2, 2),
(1, 3, 1),
(1, 4, 2),
(2, 1, 1),
(2, 5, 2)
ON CONFLICT DO NOTHING;

SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM users), 1));
SELECT setval('recipes_id_seq', GREATEST((SELECT MAX(id) FROM recipes), 1));
