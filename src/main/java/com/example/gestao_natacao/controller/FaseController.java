package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.dto.FaseCadastroDto;
import com.example.gestao_natacao.model.Usuario.Fase;
import com.example.gestao_natacao.services.FaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fases") // Rota base para a gestão de fases
public class FaseController {

    private final FaseService faseService;

    public FaseController(FaseService faseService) {
        this.faseService = faseService;
    }

    // 1. CREATE (Cadastrar Nova Fase)
    // POST /api/fases
    @PostMapping
    public ResponseEntity<Fase> cadastrar(@RequestBody FaseCadastroDto dto) {
        try {
            Fase novaFase = faseService.cadastrar(dto);
            return new ResponseEntity<>(novaFase, HttpStatus.CREATED); // 201 Created
        } catch (RuntimeException e) {
            // Captura exceções de validação, se houver
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400 Bad Request
        }
    }

    // 2. READ All (Listar Todas as Fases)
    // GET /api/fases
    @GetMapping
    public ResponseEntity<List<Fase>> listarTodas() {
        List<Fase> fases = faseService.listarTodas();
        return new ResponseEntity<>(fases, HttpStatus.OK); // 200 OK
    }

    // 3. READ One (Buscar Fase por ID)
    // GET /api/fases/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Fase> buscarPorId(@PathVariable Integer id) {
        try {
            Fase fase = faseService.buscarPorId(id);
            return new ResponseEntity<>(fase, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // 4. UPDATE (Editar Fase Existente)
    // PUT /api/fases/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Fase> editar(@PathVariable Integer id, @RequestBody FaseCadastroDto dto) {
        try {
            Fase faseEditada = faseService.editar(id, dto);
            return new ResponseEntity<>(faseEditada, HttpStatus.OK); // 200 OK
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // 5. DELETE (Excluir Fase)
    // DELETE /api/fases/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluir(@PathVariable Integer id) {
        try {
            faseService.excluir(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }
}