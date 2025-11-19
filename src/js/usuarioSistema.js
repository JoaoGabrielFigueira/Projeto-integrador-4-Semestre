import { UsuarioAPI, CargoAPI } from "./utils/api.js";

// Variáveis globais
let modal = document.getElementById('modalUsuario');
let modalTitulo = document.getElementById('modalTitulo');
let formUsuario = document.getElementById('formUsuario');
let isEditMode = false;
let currentUserId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');
const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

// Abrir modal para adicionar usuário
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Usuário';
    formUsuario.reset();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar usuário
function abrirModalEditar(userData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Usuário';

    // Preencher formulário com dados do usuário
    document.getElementById('nomeCompleto').value = userData.nome || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('nivelAcesso').value = userData.nivel || '';
    document.getElementById('senha').value = '';
    document.getElementById('confirmarSenha').value = '';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    
    // Adicionar classe de animação de fechamento
    modalContent.classList.add('close');
    
    // Aguardar a animação terminar (300ms) antes de esconder o modal
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        formUsuario.reset();
    }, 300);
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Carregar usuários iniciais com paginação
    try {
        const usuarios = await fetchUsuarios();
        renderUsuariosWithPagination(usuarios);
    } catch (err) {
        console.error('Erro ao carregar usuários iniciais:', err);
    }

    // Botão adicionar novo
    const addButton = document.getElementById('btnAdicionar');
    if (addButton) {
        addButton.addEventListener('click', abrirModalAdicionar);
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const userData = JSON.parse(this.getAttribute('data-user'));
            abrirModalEditar(userData);
        });
    });

        // Botões excluir
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            excluirUsuario();
        });
    });

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', fecharModal);
    }

    // Buscar usuários com debounce
    const searchInput = document.getElementById('pesquisaUsuarios');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentUsuariosPage = 1;
                    const results = await fetchUsuarios(e.target.value);
                    renderUsuariosWithPagination(results);
                } catch (err) {
                    console.error('Erro na busca de usuários:', err);
                }
            }, 300);
        });
    }

    // Fechar modal clicando fora dele
    if (modal) {
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('.password-icon');

            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility';
            } else {
                input.type = 'password';
                icon.textContent = 'visibility_off';
            }
        });
    });

    // Submeter formulário
    if (formUsuario) {
        formUsuario.addEventListener('submit', async function (e) {
            e.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }
            const nivelAcesso = document.getElementById('nivelAcesso').value;
            const userData = {
                nome: document.getElementById('nomeCompleto').value,
                email: document.getElementById('email').value,
                senha: senha,
                idsCargos: [parseInt(nivelAcesso)]
            }
            ;
                    
            let result;

            if (isEditMode) {
                console.log('Atualizando usuário:', userData);
                result = await UsuarioAPI.update(currentUserId, userData);
            } else {
                result = await UsuarioAPI.create(userData);
                console.log('Criando usuário:', userData);
            }
            
            fecharModal();
        });
    }
});

// Função para excluir usuário
function excluirUsuario() {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        console.log('Excluindo usuário...');
        alert('Usuário excluído com sucesso!');
    }
}

// --- Paginação e integração (nova) ---
const ITEMS_PER_PAGE_USUARIOS = 5;
let currentUsuariosPage = 1;
let allUsuarios = [];

async function fetchUsuarios(searchTerm = '') {
    try {
        const response = await UsuarioAPI.getAll();

        if (response.ok) {
            let usuarios = response.data;
            if (searchTerm) {
                usuarios = usuarios.filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return usuarios;
        }else {
            console.error('Erro ao buscar usuários:', response.error);
            return [];
        }
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        return [];
    }
}


function renderUsuarios(usuarios) {
    const container = document.querySelector('.main-content');
    const html = usuarios.map(u => `
        <div class="table-row" data-id="${u.id}">
            <div class="table-data">
                <p class="table-row-title">${u.nome}</p>
                <p class="table-badge">${u.nivel}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit" data-user='${JSON.stringify(u)}'>Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const existing = container.querySelector('.table-content');
    if (existing) existing.innerHTML = html;
    else container.querySelector('.page-header').insertAdjacentHTML('afterend', `<div class="table-content">${html}</div>`);

    attachEventListenersUsuarios();
}

function attachEventListenersUsuarios() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            const data = this.getAttribute('data-user');
            if (data) abrirModalEditar(JSON.parse(data));
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            if (confirm('Tem certeza que deseja excluir este usuário?')) {

                const result = await UsuarioAPI.remove(id);
                if (result.ok) {
                    alert('Usuário excluído com sucesso!');
                    const usuarios = await fetchUsuarios();
                    renderUsuariosWithPagination(usuarios);
                }else {
                    alert('Erro ao excluir usuário: ' + result.error);
                }
            }
        });
    });
}

async function renderUsuariosWithPagination(usuarios) {
    allUsuarios = usuarios;
    const paginationData = createPagination(usuarios.length, ITEMS_PER_PAGE_USUARIOS, currentUsuariosPage);
    const paginated = paginateItems(usuarios, ITEMS_PER_PAGE_USUARIOS, currentUsuariosPage);
    renderUsuarios(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentUsuariosPage = page;
        renderUsuariosWithPagination(allUsuarios);
    });
}