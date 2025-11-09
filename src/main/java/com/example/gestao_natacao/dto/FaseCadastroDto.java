package com.example.gestao_natacao.dto; // Ajuste o pacote se necessário

import java.util.List;

public class FaseCadastroDto {

    private String nomeFase;
    private Integer minIdade;
    private Integer maxIdade;

    // Lista de descrições das atividades (strings simples)
    private List<String> atividades;

    // Construtor vazio (necessário para serialização/deserialização)
    public FaseCadastroDto() {
    }

    // Getters e Setters
    public String getNomeFase() {
        return nomeFase;
    }

    public void setNomeFase(String nomeFase) {
        this.nomeFase = nomeFase;
    }

    public Integer getMinIdade() {
        return minIdade;
    }

    public void setMinIdade(Integer minIdade) {
        this.minIdade = minIdade;
    }

    public Integer getMaxIdade() {
        return maxIdade;
    }

    public void setMaxIdade(Integer maxIdade) {
        this.maxIdade = maxIdade;
    }

    public List<String> getAtividades() {
        return atividades;
    }

    public void setAtividades(List<String> atividades) {
        this.atividades = atividades;
    }
}