package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.model.Usuario.Unidade;
import com.example.gestao_natacao.services.UnidadeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades") // Rota base para a gestão de unidades
public class UnidadeController {

    private final UnidadeService unidadeService;

    public UnidadeController(UnidadeService unidadeService) {
        this.unidadeService = unidadeService;
    }

    // 1. CREATE
    // POST /api/unidades
    @PostMapping
    public ResponseEntity<Unidade> cadastrar(@RequestBody Unidade unidade) {
        try {
            Unidade novaUnidade = unidadeService.cadastrar(unidade);
            return new ResponseEntity<>(novaUnidade, HttpStatus.CREATED); // 201 Created
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 2. READ All
    // GET /api/unidades
    @GetMapping
    public ResponseEntity<List<Unidade>> listarTodos() {
        List<Unidade> unidades = unidadeService.listarTodos();
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }

    // 3. READ One
    // GET /api/unidades/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Unidade> buscarPorId(@PathVariable Integer id) {
        try {
            Unidade unidade = unidadeService.buscarPorId(id);
            return new ResponseEntity<>(unidade, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 4. UPDATE
    // PUT /api/unidades/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Unidade> editar(@PathVariable Integer id, @RequestBody Unidade unidadeAtualizada) {
        try {
            Unidade unidadeEditada = unidadeService.editar(id, unidadeAtualizada);
            return new ResponseEntity<>(unidadeEditada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE
    // DELETE /api/unidades/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluir(@PathVariable Integer id) {
        try {
            unidadeService.excluir(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}