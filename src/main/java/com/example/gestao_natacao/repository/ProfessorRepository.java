package com.example.gestao_natacao.repository;

import com.example.gestao_natacao.model.Usuario.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {
    // Integer porque o ID do Professor é do tipo Integer
}