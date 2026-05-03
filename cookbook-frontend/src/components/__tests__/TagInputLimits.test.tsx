import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TagInput from '../TagInput';

describe('TagInput - Limit Testing', () => {
  it('handles extremely long tags', () => {
    const longTag = 'a'.repeat(1000);
    const onChange = vi.fn();
    render(<TagInput label="Tags" value="" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: longTag } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onChange).toHaveBeenCalledWith(longTag);
  });

  it('handles special characters in tags', () => {
    const specialTag = '!@#$%^&*()_+|}{":?><';
    const onChange = vi.fn();
    render(<TagInput label="Tags" value="" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: specialTag } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onChange).toHaveBeenCalledWith(specialTag);
  });

  it('handles duplicate tags by not adding them (logic is in component)', () => {
    const onChange = vi.fn();
    render(<TagInput label="Tags" value="existing" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'existing' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes tags on backspace when input is empty', () => {
    const onChange = vi.fn();
    render(<TagInput label="Tags" value="tag1, tag2" onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace', code: 'Backspace' });
    
    expect(onChange).toHaveBeenCalledWith('tag1');
  });
});
