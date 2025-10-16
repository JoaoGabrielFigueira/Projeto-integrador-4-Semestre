package com.example.gestao_natacao.services;

import com.example.gestao_natacao.model.Usuario.Usuario;
import com.example.gestao_natacao.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario cadastrarUsuario(Usuario usuario) {
        // Cryptographic a senha antes de salver
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode(usuario.getSenhaUsuario());
        usuario.setSenhaUsuario(senhaCriptografada);

        // Salvar o usuário no banco de dados
        return usuarioRepository.save(usuario);
    }

    public boolean autenticarUsuario(String email, String senha) {
        // 1. Buscar o usuário pelo email no banco de dados
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmailUsuario(email);

        // 2. Verificar se o usuário existe
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // 3. Comparar a senha fornecida com a senha criptografada do banco
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            return encoder.matches(senha, usuario.getSenhaUsuario());
        }

        return false; // Usuário não encontrado
    }
}