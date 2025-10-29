package com.example.gestao_natacao.dto;

import java.util.List;

public class UsuarioCadastroDto {

    private String nome; // Corresponde ao campo 'nome' na sua requisição JSON
    private String email;
    private String senha;
    private List<Integer> idsCargos; // Lista de IDs de Cargo

    // Construtor vazio (necessário para serialização)
    public UsuarioCadastroDto() {
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public List<Integer> getIdsCargos() {
        return idsCargos;
    }

    public void setIdsCargos(List<Integer> idsCargos) {
        this.idsCargos = idsCargos;
    }
}