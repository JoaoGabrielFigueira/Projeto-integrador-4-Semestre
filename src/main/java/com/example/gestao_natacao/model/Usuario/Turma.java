package com.example.gestao_natacao.model.Usuario;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime; // Para o tipo TIME no Java
import java.util.Set; // Para múltiplos professores

@Entity
@Table(name = "turma")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Setter
    @Column(name = "nome_turma", nullable = false, length = 32)
    private String nomeTurma;

    // Mapeamento para o campo TIME do SQL
    @Setter
    @Column(name = "hora_aula", nullable = false)
    private LocalTime horaAula;

    // Relacionamento 1. Unidade (Many-to-One)
    // Uma Turma pertence a uma Unidade
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_unidade", nullable = false)
    private Unidade unidade;

    // Relacionamento 2. Professor (ManyToMany - Ligado ao Usuário/Professor)
    // Uma Turma pode ter vários Professores. Usamos a tabela 'professor' do seu banco.
    // **Nota:** No seu esquema, a turma tem 'id_professor' (ManyToOne ou ManyToMany se for lista).
    // Vou mapear como ManyToMany para permitir vários professores por turma, usando a entidade Professor.

    /*
    @ManyToMany // Assumindo uma tabela de junção Turma_Professor
    @JoinTable(
        name = "turma_professor", // Tabela de junção hipotética
        joinColumns = @JoinColumn(name = "id_turma"),
        inverseJoinColumns = @JoinColumn(name = "id_professor")
    )
    private Set<Professor> professores;
    */

    // Simplificação: Se a sua tabela 'turma' original só tem UM id_professor, use ManyToOne:
    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "id_professor", nullable = false)
    private Professor professorResponsavel;

    // Construtor vazio, Getters e Setters
    public Turma() {}

    // ... (Defina Getters e Setters para todos os campos: id, nomeTurma, horaAula, unidade, professorResponsavel) ...
    // Vou omitir os Getters/Setters aqui para simplificar, mas você deve adicioná-los.
}