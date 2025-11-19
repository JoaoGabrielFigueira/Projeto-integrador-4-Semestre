// src/js/utils/api.js

const API_BASE_URL = 'http://localhost:8080/api';

async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('authToken'); 
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) 
    };

    const config = {
        method: method,
        headers: headers,
        body: (method === 'POST' || method === 'PUT') ? JSON.stringify(data || {}) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (response.status === 204) return { ok: true, data: null };
        
        const responseData = await response.json().catch(() => ({})); 

        if (!response.ok) {
            const errorMessage = responseData.message || `Erro do servidor: ${response.status}`;
            throw new Error(errorMessage);
        }
        return { ok: true, data: responseData };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

// Funções de API específicas para os módulos
const AuthAPI = {
    login: (email, senha) => apiRequest('/auth/login', 'POST', { email, senha }),
};

const CargoAPI = {
    getAll: () => apiRequest('/cargos'),
};

const UsuarioAPI = {
    getAll: () => apiRequest('/usuarios'),
    create: (userData) => apiRequest('/usuarios', 'POST', userData),
    update: (id, userData) => apiRequest(`/usuarios/${id}`, 'PUT', userData),
    remove: (id) => apiRequest(`/usuarios/${id}`, 'DELETE'),
};

const UnidadeAPI = {
    getAll: () => apiRequest('/unidades'),
    create: (unitData) => apiRequest('/unidades', 'POST', unitData),
    update: (id, unitData) => apiRequest(`/unidades/${id}`, 'PUT', unitData),
    remove: (id) => apiRequest(`/unidades/${id}`, 'DELETE'),
};

const TurmaAPI = {
    getAll: () => apiRequest('/turmas'),
    getById: (id) => apiRequest(`/turmas/${id}`),
    create: (turmaData) => apiRequest('/turmas', 'POST', turmaData),
    update: (id, turmaData) => apiRequest(`/turmas/${id}`, 'PUT', turmaData),
    remove: (id) => apiRequest(`/turmas/${id}`, 'DELETE'),
};

const FaseAPI = {
    getAll: () => apiRequest('/fases'),
    create: (faseData) => apiRequest('/fases', 'POST', faseData),
    update: (id, faseData) => apiRequest(`/fases/${id}`, 'PUT', faseData),
    remove: (id) => apiRequest(`/fases/${id}`, 'DELETE'),
};

export { AuthAPI, CargoAPI, UsuarioAPI, UnidadeAPI, TurmaAPI, FaseAPI };