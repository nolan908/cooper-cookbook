import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RecipeCard from '../RecipeCard';
import type { Recipe } from '../../api/types';

const mockRecipe: Recipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'Test Desc',
  authorId: 1,
  authorDisplayName: 'Test Author',
  isPublic: true,
  categoryTags: 'tag1, tag2',
  prepTime: 10,
  cookTime: 20,
  servings: 4,
  imageUrl: 'test.jpg'
};

describe('RecipeCard', () => {
  it('renders recipe basic info', () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={mockRecipe} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('By Test Author')).toBeInTheDocument();
  });

  it('renders only the first category tag', () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={mockRecipe} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.queryByText('tag2')).not.toBeInTheDocument();
  });
});
