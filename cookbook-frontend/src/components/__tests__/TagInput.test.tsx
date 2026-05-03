import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TagInput from '../TagInput';

describe('TagInput', () => {
  it('renders correctly with label', () => {
    render(<TagInput label="Tags" value="" onChange={() => {}} />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('displays existing tags', () => {
    render(<TagInput label="Tags" value="tag1, tag2" onChange={() => {}} />);
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });
});
