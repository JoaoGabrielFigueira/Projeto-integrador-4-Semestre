package com.example.gestao_natacao.services;

import com.example.gestao_natacao.dto.TurmaCadastroDto;
import com.example.gestao_natacao.model.Usuario.Turma;
import com.example.gestao_natacao.model.Usuario.Unidade;
import com.example.gestao_natacao.model.Usuario.Professor;
import com.example.gestao_natacao.repository.TurmaRepository;
import com.example.gestao_natacao.repository.UnidadeRepository; // Repositório necessário
import com.example.gestao_natacao.repository.ProfessorRepository; // Repositório necessário

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final UnidadeRepository unidadeRepository;
    private final ProfessorRepository professorRepository;

    // Construtor para injeção de dependências
    public TurmaService(TurmaRepository turmaRepository, UnidadeRepository unidadeRepository, ProfessorRepository professorRepository) {
        this.turmaRepository = turmaRepository;
        this.unidadeRepository = unidadeRepository;
        this.professorRepository = professorRepository;
    }

    // --- Métodos de Leitura (READ) ---

    public List<Turma> listarTodas() {
        return turmaRepository.findAll();
    }

    public Turma buscarPorId(Integer id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + id));
    }

    // --- Método de Criação (CREATE) ---

    public Turma cadastrar(TurmaCadastroDto dto) {

        // 1. Converte IDs para Entidades (Validação de existência)
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada."));

        Professor professor = professorRepository.findById(dto.getIdProfessorResponsavel())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado."));

        // 2. Monta o objeto Turma
        Turma novaTurma = new Turma();
        novaTurma.setNomeTurma(dto.getNomeTurma());
        novaTurma.setHoraAula(dto.getHoraAula());

        // Atribui as entidades encontradas
        novaTurma.setUnidade(unidade);
        novaTurma.setProfessorResponsavel(professor);

        // 3. Salva no banco de dados
        return turmaRepository.save(novaTurma);
    }

    // --- Método de Edição (UPDATE) ---

    public Turma editar(Integer id, TurmaCadastroDto dto) {
        Turma turmaExistente = buscarPorId(id); // Garante que a turma existe

        // 1. Converte IDs para Entidades (Validação de existência)
        Unidade unidade = unidadeRepository.findById(dto.getIdUnidade())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada."));

        Professor professor = professorRepository.findById(dto.getIdProfessorResponsavel())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado."));

        // 2. Atualiza os campos
        turmaExistente.setNomeTurma(dto.getNomeTurma());
        turmaExistente.setHoraAula(dto.getHoraAula());
        turmaExistente.setUnidade(unidade);
        turmaExistente.setProfessorResponsavel(professor);

        // 3. Salva (o JPA faz o UPDATE)
        return turmaRepository.save(turmaExistente);
    }

    // --- Método de Exclusão (DELETE) ---

    public void excluir(Integer id) {
        buscarPorId(id); // Garante que a turma existe
        turmaRepository.deleteById(id);
    }
}