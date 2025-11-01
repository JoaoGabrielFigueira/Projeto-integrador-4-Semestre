// JwtResponse.java
package com.example.gestao_natacao.dto;

import lombok.Getter;
import lombok.Setter;

public class JwtResponse {
    @Setter
    @Getter
    private String token;

    public JwtResponse(String token) {
        this.token = token;
    }

    public String getTipo() {
        // Padrão JWT
        String tipo = "Bearer";
        return tipo;
    }
}