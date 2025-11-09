package com.example.gestao_natacao.services; // Ajuste o pacote se necessário

import com.example.gestao_natacao.dto.FaseCadastroDto;
import com.example.gestao_natacao.model.Usuario.Fase;
import com.example.gestao_natacao.model.Usuario.Atividade;
import com.example.gestao_natacao.repository.FaseRepository;
import com.example.gestao_natacao.repository.AtividadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FaseService {

    private final FaseRepository faseRepository;
    private final AtividadeRepository atividadeRepository;

    public FaseService(FaseRepository faseRepository, AtividadeRepository atividadeRepository) {
        this.faseRepository = faseRepository;
        this.atividadeRepository = atividadeRepository;
    }

    // --- Métodos de Leitura (READ) ---

    public List<Fase> listarTodas() {
        return faseRepository.findAll();
    }

    public Fase buscarPorId(Integer id) {
        return faseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fase não encontrada com ID: " + id));
    }

    // --- Método de Criação (CREATE) ---

    public Fase cadastrar(FaseCadastroDto dto) {
        // 1. Cria a entidade Fase
        Fase novaFase = new Fase();
        novaFase.setNomeFase(dto.getNomeFase());
        novaFase.setMinIdade(dto.getMinIdade());
        novaFase.setMaxIdade(dto.getMaxIdade());

        // 2. Converte a lista de Strings de Atividade em Entidades Atividade
        List<Atividade> atividades = dto.getAtividades().stream()
                .map(descricao -> {
                    Atividade atividade = new Atividade();
                    atividade.setDescricao(descricao);
                    atividade.setFase(novaFase); // Garante o vínculo Many-to-One
                    return atividade;
                })
                .collect(Collectors.toList());

        // 3. Vincula as Atividades à Fase (One-to-Many)
        novaFase.setAtividades(atividades);

        // 4. Salva a Fase (O CascadeType.ALL salvará as Atividades automaticamente)
        return faseRepository.save(novaFase);
    }

    // --- Método de Edição (UPDATE) ---

    public Fase editar(Integer id, FaseCadastroDto dto) {
        Fase faseExistente = buscarPorId(id);

        faseExistente.setNomeFase(dto.getNomeFase());
        faseExistente.setMinIdade(dto.getMinIdade());
        faseExistente.setMaxIdade(dto.getMaxIdade());

        // Lógica de Atualização de Atividades (Mais complexa: remove as antigas e adiciona as novas)

        // 1. Remove todas as atividades antigas (graças ao orphanRemoval=true no Fase.java)
        faseExistente.getAtividades().clear();

        // 2. Adiciona as novas atividades
        List<Atividade> novasAtividades = dto.getAtividades().stream()
                .map(descricao -> {
                    Atividade atividade = new Atividade();
                    atividade.setDescricao(descricao);
                    atividade.setFase(faseExistente); // Vincula à fase existente
                    return atividade;
                })
                .collect(Collectors.toList());

        faseExistente.getAtividades().addAll(novasAtividades);

        // 3. Salva (o JPA fará as operações de DELETE e INSERT necessárias)
        return faseRepository.save(faseExistente);
    }

    // --- Método de Exclusão (DELETE) ---

    public void excluir(Integer id) {
        buscarPorId(id); // Garante que a fase existe
        faseRepository.deleteById(id);
    }
}