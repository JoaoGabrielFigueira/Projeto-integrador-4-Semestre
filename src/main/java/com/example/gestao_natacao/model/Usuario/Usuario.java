package com.example.gestao_natacao.model.Usuario;

import jakarta.persistence.*;
import java.util.Set;


@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_usuario", nullable = false, length = 32)
    private String nomeUsuario;

    @Column(name = "email_usuario", nullable = false, unique = true, length = 32)
    private String emailUsuario;

    @Column(name = "senha_usuario", nullable = false, length = 255)
    private String senhaUsuario;

    @ManyToMany(fetch = FetchType.EAGER) // Eager: Carrega os cargos junto com o usuário
    @JoinTable(
            name = "usuario_cargo", // Nome da tabela intermediária
            joinColumns = @JoinColumn(name = "id_usuario"), // Chave de Usuario na tabela intermediária
            inverseJoinColumns = @JoinColumn(name = "id_cargo") // Chave de Cargo na tabela intermediária
    )
    private Set<Cargo> cargos;

    public Set<Cargo> getCargos() { return cargos; }

    public void setCargos(Set<Cargo> cargos) { this.cargos = cargos; }

    // Construtor vazio (obrigatório para o JPA)
    public Usuario() {
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

    public String getSenhaUsuario() {
        return senhaUsuario;
    }

    public void setSenhaUsuario(String senhaUsuario) {
        this.senhaUsuario = senhaUsuario;
    }


}
