package com.example.gestao_natacao.repository;

import com.example.gestao_natacao.model.Usuario.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CargoRepository extends JpaRepository<Cargo, Integer> {

    // Método para buscar um cargo pelo nome
    Optional<Cargo> findByNomeCargo(String nomeCargo);
}