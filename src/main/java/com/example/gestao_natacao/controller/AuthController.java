package com.example.gestao_natacao.controller;

import com.example.gestao_natacao.dto.UsuarioCadastroDto;
import com.example.gestao_natacao.model.Usuario.Usuario;
import com.example.gestao_natacao.services.UsuarioService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.gestao_natacao.dto.JwtResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<String> cadastrarUsuario(@RequestBody UsuarioCadastroDto dto) {
        try {
            usuarioService.cadastrarUsuario(dto);
            return new ResponseEntity<>("Usuário cadastrado com sucesso!", HttpStatus.CREATED);
        } catch (Exception e) {
            // Em caso de erro, por exemplo, email duplicado
            return new ResponseEntity<>("Erro ao cadastrar usuário: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean autenticado = usuarioService.autenticarUsuario(loginRequest.getEmail(), loginRequest.getSenha());

        if (autenticado) {
            String jwtToken = "ESTE_É_O_SEU_TOKEN";
            return new ResponseEntity<>(new JwtResponse(jwtToken), HttpStatus.OK);
        } else{
          return new ResponseEntity<>("{\"message\": \"Credenciais inválidas.\"}", HttpStatus.UNAUTHORIZED);
        }
    }
}

@Setter
@Getter
class LoginRequest {
    private String email;
    private String senha;

}