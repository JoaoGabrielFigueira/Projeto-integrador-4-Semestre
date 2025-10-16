package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.model.Usuario.Usuario;
import com.example.gestao_natacao.services.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            usuarioService.cadastrarUsuario(usuario);
            return new ResponseEntity<>("Usuário cadastrado com sucesso!", HttpStatus.CREATED);
        } catch (Exception e) {
            // Em caso de erro, por exemplo, email duplicado
            return new ResponseEntity<>("Erro ao cadastrar usuário: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        boolean autenticado = usuarioService.autenticarUsuario(loginRequest.getEmail(), loginRequest.getSenha());

        if (autenticado) {
            return new ResponseEntity<>("Autenticado com sucesso!", HttpStatus.OK);
        } else{
          return new ResponseEntity<>("Credenciais Invalidas!", HttpStatus.UNAUTHORIZED);
        }
    }
}

class LoginRequest {
    private String email;
    private String senha;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}