// Função para validar o formato do email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para mostrar mensagens de feedback
function showFeedback(elementId, isValid, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = isValid ? 'feedback-success' : 'feedback-error';
    }
}

// Função para verificar as credenciais com o backend
async function checkCredentials(email, password) {
    const API_BASE_URL = 'http://localhost:8080/api/auth'; // <- ajuste para a URL do seu backend
    const url = `${API_BASE_URL}/login`; // ajuste o endpoint se necessário
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // se seu backend usar cookies de sessão, descomente a linha abaixo:
            // credentials: 'include',
            body: JSON.stringify({ email, senha: password })
        });

        // Tentar ler JSON mesmo em erros para mensagens do backend
        let data = null;
        try { data = await response.json(); } catch (_) { /* corpo não-JSON */ }

        if (!response.ok) {
            const message = (data && data.message) ? data.message : await response.text();
            return { success: false, error: message };
        }

        // Se o backend retornar um token, armazene para uso posterior
        if (data && data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return { success: true, data };
    } catch (error) {
        // Erro de rede / CORS / backend inacessível
        return {
            success: false,
            error: 'Erro de conexão com o backend. Verifique a URL e CORS.'
        };
    }
}

// Função principal de validação do formulário
async function validateForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validação básica do formato do email
    if (!validateEmail(email)) {
        showFeedback('email-feedback', false, 'Por favor, insira um email válido');
        return;
    }

    // Validação básica da senha (não vazia)
    if (!password) {
        showFeedback('password-feedback', false, 'Por favor, insira sua senha');
        return;
    }

    // Limpar feedbacks anteriores
    showFeedback('email-feedback', true, '');
    showFeedback('password-feedback', true, '');

    try {
        const button = document.querySelector('button[type="submit"]');
        button.disabled = true;
        button.textContent = 'Entrando...';

        const result = await checkCredentials(email, password);

        if (result.success) {
            // Login bem sucedido - redirecionar para a página principal
            // window.location.href = 'pagina-principal.html'; // Ajuste esta URL conforme necessário

            const passwordFeedback = document.getElementById('password-feedback');
            if (passwordFeedback) {
                passwordFeedback.textContent = 'Login bem sucedido! Redirecionando...';
                passwordFeedback.className = 'feedback-success';
            }
        } else {
            // Login falhou
            showFeedback('password-feedback', false, result.error);
        }
    } catch (error) {
        showFeedback('password-feedback', false, 'Erro ao fazer login. Tente novamente.');
    } finally {
        const button = document.querySelector('button[type="submit"]');
        button.disabled = false;
        button.textContent = 'ENTRAR';
    }
}

// Adicionar listener quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    // Limpar feedbacks quando o usuário começar a digitar
    const inputs = ['email', 'password'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                showFeedback(`${id}-feedback`, true, '');
            });
        }
    });
});