package com.cookbook.cookbook;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        List<String> allowedOrigins = new java.util.ArrayList<>(List.of(
            "http://localhost:5173", 
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:80"
        ));

        addConfiguredOrigins(allowedOrigins, System.getenv("FRONTEND_URL"));
        addConfiguredOrigins(allowedOrigins, System.getenv("APP_FRONTEND_URL"));

        config.setAllowedOrigins(allowedOrigins);

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return new UrlBasedCorsConfigurationSource() {{
            registerCorsConfiguration("/**", config);
        }};
    }

    private void addConfiguredOrigins(List<String> allowedOrigins, String origins) {
        if (origins == null || origins.isBlank()) {
            return;
        }

        Arrays.stream(origins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .forEach(origin -> {
                allowedOrigins.add(origin);
                if (!origin.startsWith("http")) {
                    allowedOrigins.add("https://" + origin);
                    allowedOrigins.add("http://" + origin);
                }
            });
    }
}
