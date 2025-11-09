package com.example.gestao_natacao.repository; // Ajuste o pacote se necessário

import com.example.gestao_natacao.model.Usuario.Fase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaseRepository extends JpaRepository<Fase, Integer> {
    // Integer porque o ID da Fase é do tipo Integer
}