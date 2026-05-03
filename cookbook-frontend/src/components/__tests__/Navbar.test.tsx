import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar', () => {
  it('renders nothing when not logged in', () => {
    (useAuth as any).mockReturnValue({ isLoggedIn: false });
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders brand name and links when logged in', () => {
    (useAuth as any).mockReturnValue({ 
      isLoggedIn: true, 
      username: 'testuser',
      profilePictureUrl: null,
      logOut: vi.fn()
    });
    
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Cooper Cookbook')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('My Kitchen')).toBeInTheDocument();
  });
});
