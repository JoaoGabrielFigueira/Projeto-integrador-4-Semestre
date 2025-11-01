package com.example.gestao_natacao.services;

import com.example.gestao_natacao.model.Usuario.Unidade;
import com.example.gestao_natacao.repository.UnidadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnidadeService {

    private final UnidadeRepository unidadeRepository;

    public UnidadeService(UnidadeRepository unidadeRepository) {
        this.unidadeRepository = unidadeRepository;
    }

    // CREATE
    public Unidade cadastrar(Unidade unidade) {
        return unidadeRepository.save(unidade);
    }

    // READ All
    public List<Unidade> listarTodos() {
        return unidadeRepository.findAll();
    }

    // READ One
    public Unidade buscarPorId(Integer id) {
        return unidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada com ID: " + id));
    }

    // UPDATE
    public Unidade editar(Integer id, Unidade unidadeAtualizada) {
        Unidade unidadeExistente = buscarPorId(id);

        unidadeExistente.setNomeUnidade(unidadeAtualizada.getNomeUnidade());
        unidadeExistente.setCepUnidade(unidadeAtualizada.getCepUnidade());
        unidadeExistente.setNumeroUnidade(unidadeAtualizada.getNumeroUnidade());
        unidadeExistente.setTelefoneUnidade(unidadeAtualizada.getTelefoneUnidade());

        return unidadeRepository.save(unidadeExistente);
    }

    // DELETE
    public void excluir(Integer id) {
        buscarPorId(id); // Verifica se existe antes de excluir
        unidadeRepository.deleteById(id);
    }
}