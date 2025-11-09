package com.example.gestao_natacao.model.Usuario; // Ajuste o pacote se necessário

import jakarta.persistence.*;
import java.util.List; // Usaremos List para manter a ordem das atividades
import com.example.gestao_natacao.model.Usuario.Atividade;

@Entity
@Table(name = "fase")
public class Fase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_fase", nullable = false, length = 32)
    private String nomeFase;

    @Column(name = "min_idade", nullable = false)
    private Integer minIdade;

    @Column(name = "max_idade", nullable = false)
    private Integer maxIdade;

    // Relacionamento One-to-Many com Atividade
    // Uma Fase tem muitas Atividades
    @OneToMany(mappedBy = "fase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Atividade> atividades;

    // Construtor vazio (obrigatório para o JPA)
    public Fase() {
    }

    // Getters e Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public List<Atividade> getAtividades() {
        return atividades;
    }

    public void setAtividades(List<Atividade> atividades) {
        this.atividades = atividades;
    }
}