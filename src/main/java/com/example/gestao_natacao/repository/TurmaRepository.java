package com.example.gestao_natacao.repository;

import com.example.gestao_natacao.model.Usuario.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurmaRepository extends JpaRepository<Turma, Integer> {
    // Integer porque o ID da Turma é do tipo Integer
}