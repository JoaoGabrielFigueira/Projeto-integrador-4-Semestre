package com.example.gestao_natacao.repository; // Ajuste o pacote se necessário

import com.example.gestao_natacao.model.Usuario.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtividadeRepository extends JpaRepository<Atividade, Integer> {
    // Não precisamos de métodos personalizados por enquanto
}