package com.cookbook.cookbook;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            config.setAllowedOrigins(List.of(
                "http://localhost:5173", 
                "http://localhost:3000",
                frontendUrl,
                "https://" + frontendUrl
            ));
        } else {
            config.setAllowedOrigins(List.of(
                "http://localhost:5173", 
                "http://localhost:3000",
                "https://frontend-ui.ambitiousbay-6405551a.centralus.azurecontainerapps.io"
            ));
        }
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return new UrlBasedCorsConfigurationSource() {{
            registerCorsConfiguration("/**", config);
        }};
    }
}
