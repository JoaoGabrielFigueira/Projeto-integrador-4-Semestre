package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.model.Usuario.Usuario;
import com.example.gestao_natacao.services.UsuarioService;
import com.example.gestao_natacao.dto.UsuarioCadastroDto; // Importar o DTO
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // Rota base para todos os endpoints de Usuário
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // 1. Endpoint para Cadastrar Novo Usuário (CREATE)
    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody UsuarioCadastroDto dto) {
        try {
            // Verifica se o email já existe (opcional, mas recomendado)
            // Lógica de validação...

            Usuario novoUsuario = usuarioService.cadastrarUsuario(dto);
            return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED); // Retorna 201 Created com o objeto
        } catch (Exception e) {
            // Em caso de erro (ex: e-mail duplicado, ID de Cargo inválido)
            return new ResponseEntity<>("Erro ao cadastrar usuário: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // FUTUROS ENDPOINTS DO CRUD:

    // 2. Listar Todos (READ All) - GET /api/usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK); // Retorna 200 OK
    }

    // 3. Endpoint para Buscar por ID (READ One)
    // GET /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Integer id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Captura a exceção de "não encontrado" e retorna 404
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 4. Endpoint para Editar Usuário (UPDATE)
    // PUT /api/usuarios/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editar(@PathVariable Integer id, @RequestBody UsuarioCadastroDto dto) {
        try {
            Usuario usuarioEditado = usuarioService.editarUsuario(id, dto);
            return new ResponseEntity<>(usuarioEditado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 se o usuário não existir
        }
    }

    // 5. Endpoint para Excluir Usuário (DELETE)
    // DELETE /api/usuarios/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> excluir(@PathVariable Integer id) {
        try {
            usuarioService.excluirUsuario(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Retorna 204 No Content
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Retorna 404 se o usuário não existir
        }
    }

}