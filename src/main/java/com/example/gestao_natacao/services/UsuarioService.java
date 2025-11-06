package com.example.gestao_natacao.services;

import com.example.gestao_natacao.model.Usuario.Usuario;
import com.example.gestao_natacao.model.Usuario.Cargo;
import com.example.gestao_natacao.repository.UsuarioRepository;
import com.example.gestao_natacao.repository.CargoRepository;
import com.example.gestao_natacao.dto.UsuarioCadastroDto;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CargoRepository cargoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, CargoRepository cargoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.cargoRepository = cargoRepository;
    }

    // Método de Login (mantido)
    public boolean autenticarUsuario(String email, String senha) {
        // ... Lógica de login (que já está funcionando)
        return false;
    }

    // NOVO MÉTODO: Cadastrar Usuário usando DTO
    public Usuario cadastrarUsuario(UsuarioCadastroDto dto) {

        // 1. Criptografar a senha
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode(dto.getSenha());

        // 2. Buscar os objetos Cargo pelos IDs
        List<Cargo> cargosEncontrados = cargoRepository.findAllById(dto.getIdsCargos());

        // Opcional: Verificar se todos os IDs de cargo foram encontrados
        if (cargosEncontrados.size() != dto.getIdsCargos().size()) {
            // Lógica para lançar exceção se algum ID for inválido (melhoria futura)
        }

        // 3. Montar o objeto Usuario
        Usuario novoUsuario = new Usuario();

        // CORREÇÃO DE NOMENCLATURA AQUI:
        novoUsuario.setNomeUsuario(dto.getNome());      // Usa setNomeUsuario() da Entidade
        novoUsuario.setEmailUsuario(dto.getEmail());    // Usa setEmailUsuario() da Entidade
        novoUsuario.setSenhaUsuario(senhaCriptografada); // Usa setSenhaUsuario() da Entidade

        // Atribuir o Set de Cargos
        novoUsuario.setCargos(new HashSet<>(cargosEncontrados));

        // 4. Salvar o usuário no banco de dados
        return usuarioRepository.save(novoUsuario);
    }

    // NOVO MÉTODO: Listar todos os usuários (READ All)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // NOVO MÉTODO: Buscar usuário por ID (READ One)
    public Usuario buscarPorId(Integer id) {
        // Usa o orElseThrow para retornar o objeto ou lançar uma exceção de não encontrado
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    // NOVO MÉTODO: Editar Usuário (UPDATE)
    public Usuario editarUsuario(Integer id, UsuarioCadastroDto dto) {
        // 1. Garante que o usuário existe
        Usuario usuarioExistente = buscarPorId(id); // Reutiliza o método buscarPorId

        // 2. Busca os novos objetos Cargo pelos IDs do DTO
        List<Cargo> cargosEncontrados = cargoRepository.findAllById(dto.getIdsCargos());

        // 3. Verifica se a senha foi fornecida para criptografar
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            usuarioExistente.setSenhaUsuario(encoder.encode(dto.getSenha()));
        }

        // 4. Atualiza os campos
        usuarioExistente.setNomeUsuario(dto.getNome());
        usuarioExistente.setEmailUsuario(dto.getEmail());
        usuarioExistente.setCargos(new HashSet<>(cargosEncontrados));

        // 5. Salva (o JPA atualiza automaticamente)
        return usuarioRepository.save(usuarioExistente);
    }

    // NOVO MÉTODO: Excluir Usuário (DELETE)
    public void excluirUsuario(Integer id) {
        // Garante que o usuário exista (lança 404 se não existir)
        buscarPorId(id);

        usuarioRepository.deleteById(id);
    }

}