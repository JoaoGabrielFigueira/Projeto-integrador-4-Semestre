import { FaseAPI } from "./utils/api.js";

// Variáveis globais
let modal = document.getElementById('modalFase');
let modalTitulo = document.getElementById('modalTitulo');
let formFase = document.getElementById('formFase');
let isEditMode = false;
let currentFaseId = null;

// Elementos do modal
const cancelBtn = document.querySelector('.btn-cancel');
const addBtn = document.getElementById('btnAdicionar');
const editBtns = document.querySelectorAll('.table-actions .btn-edit');
const deleteBtns = document.querySelectorAll('.table-actions .btn-delete');

// Abrir modal para adicionar fase
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Fase';
    formFase.reset();
    document.getElementById('activitiesList').innerHTML = '';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar fase
function abrirModalEditar(faseData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Fase';
    currentFaseId = faseData.id;

    document.getElementById('nomeFase').value = faseData.nomeFase || '';
    document.getElementById('minIdade').value = faseData.minIdade || '';
    document.getElementById('maxIdade').value = faseData.maxIdade || '';

    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';

    if (faseData.atividades && faseData.atividades.length > 0) {
        faseData.atividades.forEach(atividade => {
            const row = document.createElement('div');
            row.className = 'activity-row';
            row.innerHTML = `
                <input type="text" class="activity-input" data-id="${atividade.id}" value="${atividade.descricao}" readonly>
                <div class="activity-actions">
                    <button type="button" class="activity-btn-edit">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button type="button" class="activity-btn-delete">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            `;
            activitiesList.appendChild(row);
        });
    }

    attachActivityEditListeners();
    attachActivityDeleteListeners();

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add('close');
    setTimeout(() => {
        modal.classList.remove('show');
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        formFase.reset();
        document.getElementById('activitiesList').innerHTML = '';
        isEditMode = false;
        currentFaseId = null;
    }, 300);
}

// --- Paginação ---
const ITEMS_PER_PAGE_FASES = 5;
let currentFasesPage = 1;
let allFases = [];

async function fetchFases(searchTerm = '') {
    try {
        const response = await FaseAPI.getAll();
        if (!response.ok) throw new Error(response.error);
        let fases = response.data;
        if (searchTerm) {
            fases = fases.filter(f => f.nomeFase.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return fases;
    } catch (err) {
        console.error('Erro ao buscar fases:', err);
        return [];
    }
}

function renderFases(fases) {
    const container = document.querySelector('.main-content');
    const fasesHTML = fases.map(fase => `
        <div class="table-row" data-id="${fase.id}">
            <div class="table-data">
                <p class="table-row-title">${fase.nomeFase}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit" data-user='${JSON.stringify(fase)}'>Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const existingContent = container.querySelector('.table-content');
    if (existingContent) {
        existingContent.innerHTML = fasesHTML;
    } else {
        container.querySelector('.page-header').insertAdjacentHTML('afterend', `<div class="table-content">${fasesHTML}</div>`);
    }

    attachEventListenersFases();
}

// --- Botões editar/excluir fases ---
function attachEventListenersFases() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async function () {
            let faseData = {};
            const dataAttr = this.getAttribute('data-user');
            if (dataAttr) {
                try { faseData = JSON.parse(dataAttr); } catch (e) { console.warn('Erro parse data-user', e); }
            }

            if (!faseData.minIdade && !faseData.maxIdade && (!faseData.atividades || faseData.atividades.length === 0)) {
                const row = this.closest('.table-row');
                const id = parseInt(row.dataset.id);
                if (!isNaN(id)) {
                    const result = await FaseAPI.getById(id);
                    if (result.ok) abrirModalEditar(result.data);
                    else alert('Erro ao carregar fase');
                    return;
                }
            }

            abrirModalEditar(faseData);
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            if (!confirm('Tem certeza que deseja excluir esta fase?')) return;
            const result = await FaseAPI.remove(id);
            if (result.ok) {
                alert('Fase excluída com sucesso!');
                const fasesAtualizadas = await fetchFases();
                renderFasesWithPagination(fasesAtualizadas);
            } else alert(`Erro ao excluir fase: ${result.error}`);
        });
    });
}

async function renderFasesWithPagination(fases) {
    allFases = fases;
    const paginationData = createPagination(fases.length, ITEMS_PER_PAGE_FASES, currentFasesPage);
    const paginated = paginateItems(fases, ITEMS_PER_PAGE_FASES, currentFasesPage);
    renderFases(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentFasesPage = page;
        renderFasesWithPagination(allFases);
    });
}

// --- Atividades ---
function adicionarLinhaAtividade() {
    const activitiesList = document.getElementById('activitiesList');
    const newActivityRow = document.createElement('div');
    newActivityRow.className = 'activity-row';
    newActivityRow.innerHTML = `
        <input type="text" class="activity-input" placeholder="Insira a atividade" readonly>
        <div class="activity-actions">
            <button type="button" class="activity-btn-edit">
                <span class="material-symbols-outlined">edit</span>
            </button>
            <button type="button" class="activity-btn-delete">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
    activitiesList.appendChild(newActivityRow);
    attachActivityDeleteListeners();
    attachActivityEditListeners();
}

function attachActivityEditListeners() {
    document.querySelectorAll('.activity-btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async function () {
            const row = this.closest('.activity-row');
            const input = row.querySelector('.activity-input');
            const idAtividade = input.getAttribute('data-id');

            if (input.hasAttribute('readonly')) {
                input.removeAttribute('readonly');
                input.focus();
                this.querySelector('span').textContent = 'check';
            } else {
                input.setAttribute('readonly', true);
                this.querySelector('span').textContent = 'edit';
                if (!idAtividade) return; // nova atividade salva ao salvar a fase
                try {
                    const result = await FaseAPI.updateAtividade(parseInt(idAtividade), { descricao: input.value });
                    if (!result.ok) alert(`Erro ao atualizar atividade: ${result.error}`);
                } catch (err) {
                    console.error('Erro ao atualizar atividade:', err);
                }
            }
        });
    });
}

function attachActivityDeleteListeners() {
    document.querySelectorAll('.activity-btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            const row = this.closest('.activity-row');
            row.remove();
        });
    });
}

// --- Event listeners DOM ---
document.addEventListener('DOMContentLoaded', async function () {
    const searchInput = document.getElementById('pesquisarFases');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                currentFasesPage = 1;
                const results = await fetchFases(e.target.value);
                renderFasesWithPagination(results);
            }, 300);
        });
    }

    if (addBtn) addBtn.addEventListener('click', abrirModalAdicionar);
    if (cancelBtn) cancelBtn.addEventListener('click', fecharModal);

    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) fecharModal();
        });
    }

    const btnAddActivity = document.getElementById('btnAddActivity');
    if (btnAddActivity) btnAddActivity.addEventListener('click', adicionarLinhaAtividade);

    // Carregar fases iniciais
    const fases = await fetchFases();
    renderFasesWithPagination(fases);

    // Form submit
    if (formFase) {
        formFase.addEventListener('submit', async function (e) {
            e.preventDefault();
            const nomeFase = document.getElementById('nomeFase').value;
            const minIdade = document.getElementById('minIdade').value.trim() ? parseInt(document.getElementById('minIdade').value) : null;
            const maxIdade = document.getElementById('maxIdade').value.trim() ? parseInt(document.getElementById('maxIdade').value) : null;

            const activityInputs = document.querySelectorAll('.activity-input');
            const atividades = [];
            activityInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    const idAtividade = input.getAttribute('data-id');
                    atividades.push({
                        id: idAtividade ? parseInt(idAtividade) : null,
                        descricao: input.value.trim(),
                    });
                }
            });

            const faseData = { nomeFase, minIdade, maxIdade, atividades };
            const submitButton = formFase.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                let result;
                if (isEditMode) result = await FaseAPI.update(currentFaseId, faseData);
                else result = await FaseAPI.create(faseData);

                if (result.ok) {
                    alert(`Fase ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
                    const fasesAtualizadas = await fetchFases();
                    renderFasesWithPagination(fasesAtualizadas);
                } else alert(`Erro ao salvar fase: ${result.error}`);
            } catch (err) {
                console.error('Erro ao salvar fase:', err);
            } finally {
                submitButton.disabled = false;
                fecharModal();
            }
        });
    }
});
