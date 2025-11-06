package com.example.gestao_natacao.model.Usuario;

import jakarta.persistence.*;

@Entity
@Table(name = "professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    public Professor() {

    }
    // Professor está ligado à tabela Usuario (Many-to-One, se um usuário for apenas 1 professor)
    @OneToOne // Um Professor é um Usuário (One-to-One)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id")
    private Usuario usuario;

    public Professor(Integer id) {
        this.id = id;
    }



    // ... Getters e Setters ...
}