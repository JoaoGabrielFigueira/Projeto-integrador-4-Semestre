package com.example.gestao_natacao.services;

import com.example.gestao_natacao.model.Usuario.Cargo;
import com.example.gestao_natacao.repository.CargoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CargoService {

    private final CargoRepository cargoRepository;

    public CargoService(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    // Método 1: Listar todos os cargos
    public List<Cargo> listarTodos() {
        return cargoRepository.findAll();
    }

    // Método 2: Buscar cargo por ID
    public Cargo buscarPorId(Integer id) {
        return cargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado com ID: " + id));
    }

    // Método 3: Cadastrar novo cargo
    public Cargo cadastrar(Cargo cargo) {
        // Lógica de validação pode vir aqui (ex: verificar se o nome já existe)
        return cargoRepository.save(cargo);
    }

    // Método 4: Editar cargo
    public Cargo editar(Integer id, Cargo cargoAtualizado) {
        // Garante que o cargo a ser atualizado exista
        Cargo cargoExistente = buscarPorId(id);

        cargoExistente.setNomeCargo(cargoAtualizado.getNomeCargo());

        return cargoRepository.save(cargoExistente);
    }

    // Método 5: Excluir cargo
    public void excluir(Integer id) {
        // Garante que o cargo exista antes de tentar excluir
        buscarPorId(id);
        cargoRepository.deleteById(id);
    }
}