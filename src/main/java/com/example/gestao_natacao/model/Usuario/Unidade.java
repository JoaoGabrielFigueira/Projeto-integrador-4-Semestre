package com.example.gestao_natacao.model.Usuario;

import jakarta.persistence.*;

@Entity
@Table(name = "unidade")
public class Unidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_unidade", nullable = false, length = 32)
    private String nomeUnidade;

    @Column(name = "cep_unidade", nullable = false, length = 9)
    private String cepUnidade;

    @Column(name = "numero_unidade", nullable = false, length = 5)
    private String numeroUnidade;

    @Column(name = "telefone_unidade", nullable = false, length = 12)
    private String telefoneUnidade;

    // Construtor vazio
    public Unidade() {
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomeUnidade() {
        return nomeUnidade;
    }

    public void setNomeUnidade(String nomeUnidade) {
        this.nomeUnidade = nomeUnidade;
    }

    public String getCepUnidade() {
        return cepUnidade;
    }

    public void setCepUnidade(String cepUnidade) {
        this.cepUnidade = cepUnidade;
    }

    public String getNumeroUnidade() {
        return numeroUnidade;
    }

    public void setNumeroUnidade(String numeroUnidade) {
        this.numeroUnidade = numeroUnidade;
    }

    public String getTelefoneUnidade() {
        return telefoneUnidade;
    }

    public void setTelefoneUnidade(String telefoneUnidade) {
        this.telefoneUnidade = telefoneUnidade;
    }
}