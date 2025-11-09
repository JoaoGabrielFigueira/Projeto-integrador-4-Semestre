package com.example.gestao_natacao.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalTime;

public class TurmaCadastroDto {

    private String nomeTurma;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horaAula;

    // Campo para receber o ID da Unidade (Foreign Key)
    private Integer idUnidade;

    // Campo para receber o ID do Professor (Foreign Key)
    private Integer idProfessorResponsavel;

    // Construtor vazio (necessário para serialização/deserialização)
    public TurmaCadastroDto() {
    }

    // Getters e Setters
    public String getNomeTurma() {
        return nomeTurma;
    }

    public void setNomeTurma(String nomeTurma) {
        this.nomeTurma = nomeTurma;
    }

    public LocalTime getHoraAula() {
        return horaAula;
    }

    public void setHoraAula(LocalTime horaAula) {
        this.horaAula = horaAula;
    }

    public Integer getIdUnidade() {
        return idUnidade;
    }

    public void setIdUnidade(Integer idUnidade) {
        this.idUnidade = idUnidade;
    }

    public Integer getIdProfessorResponsavel() {
        return idProfessorResponsavel;
    }

    public void setIdProfessorResponsavel(Integer idProfessorResponsavel) {
        this.idProfessorResponsavel = idProfessorResponsavel;
    }
}