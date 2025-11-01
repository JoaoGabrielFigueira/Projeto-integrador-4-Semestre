package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.model.Usuario.Cargo;
import com.example.gestao_natacao.services.CargoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargos") // Rota base para todos os endpoints de Cargo
public class CargoController {

    private final CargoService cargoService;

    public CargoController(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    // 1. Endpoint para Listar Todos
    // GET /api/cargos
    @GetMapping
    public ResponseEntity<List<Cargo>> listarTodos() {
        List<Cargo> cargos = cargoService.listarTodos();
        return new ResponseEntity<>(cargos, HttpStatus.OK);
    }

    // 2. Endpoint para Buscar por ID
    // GET /api/cargos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Cargo> buscarPorId(@PathVariable Integer id) {
        try {
            Cargo cargo = cargoService.buscarPorId(id);
            return new ResponseEntity<>(cargo, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 se não encontrar
        }
    }

    // 3. Endpoint para Cadastrar Novo Cargo
    // POST /api/cargos
    @PostMapping
    public ResponseEntity<Cargo> cadastrar(@RequestBody Cargo cargo) {
        Cargo novoCargo = cargoService.cadastrar(cargo);
        return new ResponseEntity<>(novoCargo, HttpStatus.CREATED); // Retorna 201 Created
    }

    // 4. Endpoint para Editar Cargo
    // PUT /api/cargos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Cargo> editar(@PathVariable Integer id, @RequestBody Cargo cargoAtualizado) {
        try {
            Cargo cargoEditado = cargoService.editar(id, cargoAtualizado);
            return new ResponseEntity<>(cargoEditado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 se não encontrar
        }
    }

    // 5. Endpoint para Excluir Cargo
    // DELETE /api/cargos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluir(@PathVariable Integer id) {
        try {
            cargoService.excluir(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Retorna 204 No Content (sucesso sem corpo)
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 se não encontrar
        }
    }
}