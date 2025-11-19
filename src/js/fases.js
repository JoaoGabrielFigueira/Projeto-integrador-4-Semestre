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
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Abrir modal para editar fase
function abrirModalEditar(faseData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Fase';
    currentFaseId = faseData.id;

    // Preencher formulário com dados da fase
    document.getElementById('nomeFase').value = faseData.nomeFase || '';
    
    // Aqui você pode adicionar lógica para preencher outras áreas do formulário
    // como atividades da fase, imagem, etc.

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function fecharModal() {
    const modalContent = modal.querySelector('.modal-content');
    
    // Adicionar classe de animação de fechamento
    modalContent.classList.add('close');
    
    // Aguardar a animação terminar (300ms) antes de esconder o modal
    setTimeout(() => {
        modal.classList.remove('show');
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        formFase.reset();
        isEditMode = false;
        currentFaseId = null;
    }, 300);
}

// Excluir fase
function excluirFase() {
    if (confirm('Tem certeza que deseja excluir esta fase?')) {
        console.log('Fase excluída');
        // Aqui você pode adicionar a lógica para excluir a fase
        alert('Fase excluída com sucesso!');
    }
}

// --- Paginação e integração (nova) ---
const ITEMS_PER_PAGE_FASES = 5;
let currentFasesPage = 1;
let allFases = [];

async function fetchFases(searchTerm = '') {
    try {
        const response = await FaseAPI.getAll();

        if (response.ok) {
            let fases = response.data;

            if (searchTerm) {
                return fases.filter(f => f.nomeFase.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return fases;
        }else {
           console.error('Erro ao buscar fases:', response.error);
           return [];
        }
    }catch (err) {
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

    // Anexa listeners aos botões recém-criados
    attachEventListenersFases();
}

function attachEventListenersFases() {
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            let faseData = {};
            if (this.getAttribute('data-user')) {
                try { faseData = JSON.parse(this.getAttribute('data-user')); } catch (e) { }
            }
            if (!faseData.nomeFase) {
                const tableRow = this.closest('.table-row');
                faseData = { id: parseInt(tableRow.dataset.id), nomeFase: tableRow.querySelector('.table-row-title').textContent };
            }
            abrirModalEditar(faseData);
        });
    });

    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', async (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            if (confirm('Tem certeza que deseja excluir esta fase?')) {

                const result = await FaseAPI.remove(id);
                if (result.ok) {
                    alert('Fase excluída com sucesso!');
                    const fasesAtualizadas = await fetchFases();    
                    renderFasesWithPagination(fasesAtualizadas);
                }else {
                    alert(`Erro ao excluir fase: ${result.error}`);
                }
            }
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

// Função para adicionar nova linha de atividade
function adicionarLinhaAtividade() {
    const activitiesList = document.getElementById('activitiesList');
    const newActivityRow = document.createElement('div');
    newActivityRow.className = 'activity-row';
    newActivityRow.innerHTML = `
        <input type="text" class="activity-input" placeholder="Insira a atividade">
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
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Carregar fases iniciais com paginação
    try {
        const fases = await fetchFases();
        renderFasesWithPagination(fases);
    } catch (err) {
        console.error('Erro ao carregar fases iniciais:', err);
    }

    // Botão adicionar novo
    if (addBtn) {
        addBtn.addEventListener('click', abrirModalAdicionar);
    }

    // Buscar fases com debounce
    const searchInput = document.getElementById('pesquisarFases');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentFasesPage = 1;
                    const results = await fetchFases(e.target.value);
                    renderFasesWithPagination(results);
                } catch (err) {
                    console.error('Erro na busca de fases:', err);
                }
            }, 300);
        });
    }

    // Botões editar
    editBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Pegar dados do atributo data-user se disponível
            let faseData = {};
            
            if (btn.getAttribute('data-user')) {
                try {
                    faseData = JSON.parse(btn.getAttribute('data-user'));
                } catch (e) {
                    console.error('Erro ao parsear data-user:', e);
                }
            }
            
            // Se não houver data-user, usar dados de exemplo
            if (!faseData.nomeFase) {
                // Pegar o nome da fase da linha da tabela
                const tableRow = btn.closest('.table-row');
                const faseName = tableRow.querySelector('.table-row-title').textContent;
                
                faseData = {
                    id: 1,
                    nomeFase: faseName,
                    atividades: [] // Adicione outras propriedades conforme necessário
                };
            }
            
            abrirModalEditar(faseData);
        });
    });

    // Botões excluir
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            excluirFase();
        });
    });

    // Fechar modal com botão Cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', fecharModal);
    }

    // Fechar modal clicando fora dele
    if (modal) {
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }

    // Botão adicionar atividade
    const btnAddActivity = document.getElementById('btnAddActivity');
    if (btnAddActivity) {
        btnAddActivity.addEventListener('click', adicionarLinhaAtividade);
    }

    // Upload de imagem
    const imageUploadBox = document.getElementById('imageUploadBox');
    const imagemMascote = document.getElementById('imagemMascote');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUploadBox && imagemMascote) {
        imageUploadBox.addEventListener('click', function() {
            imagemMascote.click();
        });

        imagemMascote.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageUploadBox.querySelector('.image-upload-icon').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Submeter formulário
    if (formFase) {
        formFase.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const nomeFase = document.getElementById('nomeFase').value;
            
            const minIdade = document.getElementById('minIdade').value.trim() !== '' 
                            ? parseInt(document.getElementById('minIdade').value)
                            : null;
                            
            const maxIdade = document.getElementById('maxIdade').value.trim() !== '' 
                            ? parseInt(document.getElementById('maxIdade').value)
                            : null;

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
            
            const faseData = {
                nomeFase: nomeFase,
                minIdade: minIdade,
                maxIdade: maxIdade,
                atividades: atividades,
            };

            let result;
            const submitButton = formFase.querySelector('button[type="submit"]');
            submitButton.disabled = true;

            try {
                if (isEditMode) {
                    console.log("TOKEN SENDO ENVIADO NO UPDATE:", localStorage.getItem("authToken"));
                    result = await FaseAPI.update(currentFaseId, faseData);
                } else {
                    result = await FaseAPI.create(faseData);
                }

                if (result.ok) {
                    alert(`Fase ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
                    const fasesAtualizadas = await fetchFases();
                    renderFasesWithPagination(fasesAtualizadas);
                }else {
                    alert(`Erro ao salvar fase: ${result.error}`);
                }
            } catch (err) {
                console.error('Erro ao salvar fase:', err);
                alert('Erro ao salvar fase. Por favor, tente novamente.');
            }finally {
                submitButton.disabled = false;
                fecharModal();              
            }
        });
    }
});

