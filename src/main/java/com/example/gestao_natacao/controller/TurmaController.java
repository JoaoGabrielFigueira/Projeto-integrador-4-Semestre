package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.dto.TurmaCadastroDto;
import com.example.gestao_natacao.model.Usuario.Turma;
import com.example.gestao_natacao.services.TurmaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas") // Rota base para a gestão de turmas
public class TurmaController {

    private final TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    // 1. CREATE (Cadastrar Nova Turma)
    // POST /api/turmas
    @PostMapping
    public ResponseEntity<Turma> cadastrar(@RequestBody TurmaCadastroDto dto) {
        try {
            Turma novaTurma = turmaService.cadastrar(dto);
            return new ResponseEntity<>(novaTurma, HttpStatus.CREATED); // 201 Created
        } catch (RuntimeException e) {
            // Retorna 404 se a Unidade ou Professor não for encontrado, ou 400 se for outro erro
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 2. READ All (Listar Todas as Turmas)
    // GET /api/turmas
    @GetMapping
    public ResponseEntity<List<Turma>> listarTodos() {
        List<Turma> turmas = turmaService.listarTodas();
        return new ResponseEntity<>(turmas, HttpStatus.OK); // 200 OK
    }

    // 3. READ One (Buscar Turma por ID)
    // GET /api/turmas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Turma> buscarPorId(@PathVariable Integer id) {
        try {
            Turma turma = turmaService.buscarPorId(id);
            return new ResponseEntity<>(turma, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // 4. UPDATE (Editar Turma Existente)
    // PUT /api/turmas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Turma> editar(@PathVariable Integer id, @RequestBody TurmaCadastroDto dto) {
        try {
            Turma turmaEditada = turmaService.editar(id, dto);
            return new ResponseEntity<>(turmaEditada, HttpStatus.OK); // 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // 5. DELETE (Excluir Turma)
    // DELETE /api/turmas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluir(@PathVariable Integer id) {
        try {
            turmaService.excluir(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }
}