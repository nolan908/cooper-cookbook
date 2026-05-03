package com.cookbook.cookbook.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtFilter jwtFilter;

    @Test
    public void testDoFilterWithValidToken() throws Exception {
        String token = "valid-token";
        String username = "testuser";
        
        when(request.getServletPath()).thenReturn("/api/recipes");
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtil.extractUsername(token)).thenReturn(username);
        when(jwtUtil.isTokenValid(token)).thenReturn(true);
        
        jwtFilter.doFilterInternal(request, response, filterChain);
        
        verify(filterChain).doFilter(request, response);
        assert(SecurityContextHolder.getContext().getAuthentication().getName().equals(username));
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testDoFilterWithoutToken() throws Exception {
        when(request.getServletPath()).thenReturn("/api/recipes");
        when(request.getHeader("Authorization")).thenReturn(null);
        
        jwtFilter.doFilterInternal(request, response, filterChain);
        
        verify(filterChain).doFilter(request, response);
        assert(SecurityContextHolder.getContext().getAuthentication() == null);
    }

    @Test
    public void testDoFilterWithInvalidToken() throws Exception {
        String token = "invalid-token";
        
        when(request.getServletPath()).thenReturn("/api/recipes");
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtil.isTokenValid(token)).thenReturn(false);
        
        jwtFilter.doFilterInternal(request, response, filterChain);
        
        verify(filterChain).doFilter(request, response);
        assert(SecurityContextHolder.getContext().getAuthentication() == null);
    }

    @Test
    public void testDoFilterWithAuthPath() throws Exception {
        when(request.getServletPath()).thenReturn("/api/auth/login");
        
        jwtFilter.doFilterInternal(request, response, filterChain);
        
        verify(filterChain).doFilter(request, response);
        verify(jwtUtil, never()).isTokenValid(anyString());
    }
}
