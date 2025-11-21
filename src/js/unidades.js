import { UnidadeAPI } from "./utils/api.js";

// Variáveis globais
let modal = document.getElementById('modalUnidade');
let modalTitulo = document.getElementById('modalTitulo');
let formUnidade = document.getElementById('formUnidade');
let isEditMode = false;
let currentUnitId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');

// Abrir modal para adicionar unidade
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Unidade';
    formUnidade.reset();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar unidade
function abrirModalEditar(unitData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Unidade';

    currentUnitId = unitData.id;

    // Preencher formulário com dados da unidade
    document.getElementById('nomeUnidade').value = unitData.nomeUnidade || '';
    document.getElementById('cep').value = unitData.cepUnidade || '';
    document.getElementById('numeroUnidade').value = unitData.numeroUnidade || '';
    document.getElementById('telefoneUnidade').value = unitData.telefoneUnidade || '';

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
        formUnidade.reset();
    }, 300);
}

// --- Paginação e integração (nova) ---
const ITEMS_PER_PAGE_UNIDADES = 5;
let currentUnidadesPage = 1;
let allUnidades = [];

async function fetchUnidades(searchTerm = '') {
    try {
        const response = await UnidadeAPI.getAll();

        if(response.ok) {
            let unidades = response.data;

            if (searchTerm) {
                return unidades.filter(u => u.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return unidades;
        }else {
            console.error('Erro ao buscar unidades:', response.error);
            return [];
        }
    } catch (err) {
        console.error('Erro ao buscar unidades:', err);
        return [];
    }
}

function renderUnidades(unidades) {
    const container = document.querySelector('.main-content');
    const html = unidades.map(u => `
        <div class="table-row" data-id="${u.id}">
            <div class="table-data">
                <p class="table-row-title">${u.nomeUnidade}</p>
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

    attachEventListenersUnidades();
}

function attachEventListenersUnidades() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            const data = this.getAttribute('data-user');
            if (data) {
                abrirModalEditar(JSON.parse(data));
            } else {
                const row = this.closest('.table-row');
                abrirModalEditar({ id: parseInt(row.dataset.id), nome: row.querySelector('.table-row-title').textContent });
            }
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            console.log("ID enviado para delete:", id);
            if (confirm('Tem certeza que deseja excluir esta unidade?')) {

                
                const result = await UnidadeAPI.remove(id);

                if (result.ok) {
                    alert('Unidade excluída com sucesso!');
                    const unidadesAtualizadas = await fetchUnidades();
                    renderUnidadesWithPagination(unidadesAtualizadas);
                }else {
                    alert(`Erro ao excluir unidade: ${result.error}`);
                }
            }
        });
    });
}

async function renderUnidadesWithPagination(unidades) {
    allUnidades = unidades;
    const paginationData = createPagination(unidades.length, ITEMS_PER_PAGE_UNIDADES, currentUnidadesPage);
    const paginated = paginateItems(unidades, ITEMS_PER_PAGE_UNIDADES, currentUnidadesPage);
    renderUnidades(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentUnidadesPage = page;
        renderUnidadesWithPagination(allUnidades);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Carregar unidades iniciais com paginação
    try {
        const unidades = await fetchUnidades();
        renderUnidadesWithPagination(unidades);
    } catch (err) {
        console.error('Erro ao carregar unidades iniciais:', err);
    }

    // Botão adicionar novo
    if (addBtn) {
        addBtn.addEventListener('click', abrirModalAdicionar);
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const unitData = JSON.parse(this.getAttribute('data-user'));
            abrirModalEditar(unitData);
        });
    });

    // Fechar modal
    if (cancelBtn) {
        cancelBtn.addEventListener('click', fecharModal);
    }

    // Buscar unidades com debounce
    const searchInput = document.getElementById('pesquisarUnidades');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentUnidadesPage = 1;
                    const results = await fetchUnidades(e.target.value);
                    renderUnidadesWithPagination(results);
                } catch (err) {
                    console.error('Erro na busca de unidades:', err);
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

    // Submeter formulário
    if (formUnidade) {
        formUnidade.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const nomeUnidade = document.getElementById('nomeUnidade').value;
            const cep = document.getElementById('cep').value;
            const numeroUnidade = document.getElementById('numeroUnidade').value;
            const telefoneUnidade = document.getElementById('telefoneUnidade').value;

            const unitData = {
                nomeUnidade: nomeUnidade,
                cepUnidade: cep,
                numeroUnidade: numeroUnidade,
                telefoneUnidade: telefoneUnidade
            };

            let result;
            const submitButton = formUnidade.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                if (isEditMode) {
                    result = await UnidadeAPI.update(currentUnitId, unitData);
                } else {
                    result = await UnidadeAPI.create(unitData);
                }

                if (result.ok) {
                    alert(`Unidade ${isEditMode ? 'atualizada' : 'adicionada'} com sucesso!`);
                    const unidadesAtualizadas = await fetchUnidades();
                    renderUnidadesWithPagination(unidadesAtualizadas);
                } else {
                    alert(`Erro ao salvar unidade: ${result.error}`);
                }
            } catch (err) {
                console.error('Erro ao salvar unidade:', err);
                alert(`Erro ao salvar unidade. Verifique os dados e a conexão.`);
            } finally {
                submitButton.disabled = false;
                fecharModal();
            }
        });
    }
});

