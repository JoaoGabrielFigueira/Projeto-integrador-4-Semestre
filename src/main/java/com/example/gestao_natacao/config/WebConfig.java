package com.example.gestao_natacao.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@org.jetbrains.annotations.NotNull CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a configuração a TODOS os endpoints (/api/auth/cadastrar, /api/auth/login, etc.)
                .allowedOrigins(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "http://localhost:8080" // Se você for testar a API diretamente
                ) // Adicione aqui a URL do seu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*"); // Permite todos os cabeçalhos (headers) na requisição
    }
}