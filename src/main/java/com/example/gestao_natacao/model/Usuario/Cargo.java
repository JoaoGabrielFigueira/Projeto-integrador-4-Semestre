package com.example.gestao_natacao.model.Usuario;

import jakarta.persistence.*;

@Entity
@Table(name = "cargo")
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Usamos Integer porque o id no seu banco é INT

    @Column(name = "nome_cargo", nullable = false, length = 32)
    private String nomeCargo;

    // Construtor vazio (obrigatório para o JPA)
    public Cargo() {
    }

    // Construtor para facilitar a criação (Opcional)
    public Cargo(String nomeCargo) {
        this.nomeCargo = nomeCargo;
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeCargo() {
        return nomeCargo;
    }

    public void setNomeCargo(String nomeCargo) {
        this.nomeCargo = nomeCargo;
    }
}