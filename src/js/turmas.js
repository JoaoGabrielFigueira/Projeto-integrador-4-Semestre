import { TurmaAPI, UnidadeAPI, UsuarioAPI } from "./utils/api.js"; 

// ====================================================================
// VARIÁVEIS GLOBAIS
// ====================================================================
let modal = null;
let modalTitulo = null;
let formTurmas = null;
let isEditMode = false;
let currentTurmaId = null;

// Configurações de paginação
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let allTurmas = [];

// ====================================================================
// FUNÇÕES DE UI E EVENTOS (Definidas Primeiro para Resolver ReferenceError)
// ====================================================================

/**
 * Fecha o modal.
 */
function fecharModal() {
    const modalInstance = document.getElementById('modalTurmas');
    if (!modalInstance) return;

    const modalContent = modalInstance.querySelector('.modal-content');
    modalContent.classList.add('close');
    
    setTimeout(() => {
        modalInstance.classList.remove('show');
        modalContent.classList.remove('close');
        document.body.style.overflow = 'auto';
        if (formTurmas) formTurmas.reset();
        isEditMode = false;
        currentTurmaId = null;
    }, 300);
}

/**
 * Abre o modal para adicionar uma nova turma.
 */
function abrirModalAdicionar() {
    isEditMode = false;
    modalTitulo.textContent = 'Adicionar Turma';
    formTurmas.reset();
    currentTurmaId = null;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Abre o modal para editar uma turma.
 */
function abrirModalEditar(turmaData) {
    isEditMode = true;
    modalTitulo.textContent = 'Editar Turma';
    currentTurmaId = turmaData.id;

    // CRÍTICO: Preencher formulário com dados do backend
    document.getElementById('turma').value = turmaData.nomeTurma || '';
    
    if (turmaData.unidade) {
        // Assume que o select de unidade está preenchido pelo carregarDadosRelacionados
        document.getElementById('unidade').value = turmaData.unidade.id;
    }
    if (turmaData.professorResponsavel) {
        // Preenche o radio button
        const professorRadio = document.querySelector(`input[name="professorId"][value="${turmaData.professorResponsavel.id}"]`);
        if(professorRadio) professorRadio.checked = true;
    }
    
    // CRÍTICO: Preencher a Hora da Aula (LocalTime HH:mm:ss -> HH:mm)
    const hora = turmaData.horaAula ? turmaData.horaAula.substring(0, 5) : '';
    document.getElementById('horaAula').value = hora;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Anexa os event listeners aos botões de Editar e Excluir.
 */
function attachEventListeners() {
    // Listener para o botão Editar
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null); 
        btn.addEventListener('click', async function () {
            const row = this.closest('.table-row');
            const turmaId = parseInt(row.dataset.id);
            
            if (isNaN(turmaId) || !row.dataset.id) {
                console.error('ID da turma inválido para edição. data-id lido:', row.dataset.id);
                alert("Erro: ID da turma não encontrado ou inválido para edição.");
                return;
            }
            
            // Requisita os dados completos para edição
            const response = await TurmaAPI.getById(turmaId); 
            
            if (response.ok) {
                abrirModalEditar(response.data); 
            } else {
                // O 401 Unauthorized (sem token) ou 404/Erro do servidor (sem recurso) cairá aqui
                alert(`Erro ao buscar dados da turma (Status: ${response.status}). Verifique seu token de autenticação (401).`);
            }
        });
    });

    // Listener para o botão Excluir
    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null); 
        btn.addEventListener('click', function () {
            const row = this.closest('.table-row');
            const turmaId = parseInt(row.dataset.id);
            if (!isNaN(turmaId)) {
                excluirTurma(turmaId);
            } else {
                 console.error('ID da turma inválido para exclusão. data-id lido:', row.dataset.id);
            }
        });
    });
}


/**
 * Renderiza a lista de turmas no DOM.
 */
function renderTurmas(turmas) {
    console.log('Renderizando turmas:', turmas); // Log para depuração
    const container = document.querySelector('.main-content');
    const turmasHTML = turmas.map(turma => `
        <div class="table-row" data-id="${turma.id}">
            <div class="table-data">
                <p class="table-row-title">${turma.nomeTurma || 'Turma Sem Nome'}</p>
                <p class="table-badge">${turma.unidade ? turma.unidade.nomeUnidade : 'N/A'}</p>
            </div>
            <div class="table-actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    // Garante que o container de turmas existe e atualiza o conteúdo
    let tableContent = document.getElementById('turmasContainer');
    if (!tableContent) {
        tableContent = document.createElement('div');
        tableContent.id = 'turmasContainer';
        tableContent.className = 'table-content';
        container.querySelector('.page-header').insertAdjacentElement('afterend', tableContent);
    }
    tableContent.innerHTML = turmasHTML;

    // CRÍTICO: Anexar listeners APÓS a renderização
    attachEventListeners(); 
}

/**
 * Renderiza turmas aplicando paginação.
 */
async function renderTurmasWithPagination(turmas) {
    allTurmas = turmas;
    
    // As funções de paginação (createPagination, paginateItems, renderPaginationControls)
    // são globais se o pagination.js for carregado corretamente no HTML.
    if (typeof createPagination === 'undefined') {
        renderTurmas(turmas);
        return;
    }

    const paginationData = createPagination(turmas.length, ITEMS_PER_PAGE, currentPage);
    const paginatedTurmas = paginateItems(turmas, ITEMS_PER_PAGE, currentPage);
    
    renderTurmas(paginatedTurmas);
    
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentPage = page;
        renderTurmasWithPagination(allTurmas);
    });
}


// ====================================================================
// FUNÇÕES DE SERVIÇO (CRUD e Fetch)
// ====================================================================

/**
 * Busca todas as turmas da API, aplicando filtro local se necessário.
 */
async function fetchTurmas(searchTerm = '') {
    try {
        const response = await TurmaAPI.getAll();
        if (!response.ok) {
            console.error('Erro ao buscar turmas:', response.error);
            if (searchTerm === '') {
                alert('Erro ao carregar as turmas. Verifique o backend e o console.');
            }
            return [];
        }
        
        let turmas = response.data;
        
        if (searchTerm) {
            return turmas.filter(t => 
                t.nomeTurma && t.nomeTurma.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.unidade && t.unidade.nomeUnidade && t.unidade.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return turmas;
        
    } catch (error) {
        console.error('Erro de rede ao buscar turmas:', error);
        return [];
    }
}

/**
 * Salva (POST) ou atualiza (PUT) uma turma.
 */
async function salvarTurma(turmaData, isEdit) {
    try {
        let result;
        if (isEdit) {
            // No PUT, o ID deve ser enviado no payload
            turmaData.id = currentTurmaId; 
            result = await TurmaAPI.update(turmaData.id, turmaData);
        } else {
            result = await TurmaAPI.create(turmaData);
        }

        if (!result.ok) {
            console.error("Erro detalhado da API (400 Bad Request):", result.error);
            // A API retorna 400 se o JSON estiver inválido ou houver falha de validação no Java
            alert(`Erro do servidor (Status: ${result.status}). Verifique se o formato de hora (HH:mm:ss) ou IDs estão corretos.`);
        }
        return result.ok;
    } catch (error) {
        console.error('Erro ao salvar turma:', error);
        return false;
    }
}

async function excluirTurma(turmaId) {
    // ... (Lógica de exclusão mantida)
    if(confirm('Tem certeza que deseja excluir esta turma?')) {
        try {
            const result = await TurmaAPI.remove(turmaId);
            
            if(result.ok) {
                alert('Turma excluída com sucesso!');
                const turmasAtualizadas = await fetchTurmas();
                renderTurmasWithPagination(turmasAtualizadas);
            } else {
                alert(`Erro ao excluir turma (Status: ${result.status}). Verifique seu token.`);
            }
        } catch (error) {
            alert('Erro ao excluir turma.');
        }
    }
}

/**
 * Carrega unidades e professores (usuários) para o modal.
 */
async function carregarDadosRelacionados() {
    const selectUnidade = document.getElementById('unidade');
    const containerProfessores = document.getElementById('professoresContainer');
    
    // 1. CARREGAR UNIDADES
    // ... (Lógica para carregar unidades mantida) ...
    selectUnidade.innerHTML = '<option value="">Selecione a unidade</option>';
    const unidadesResult = await UnidadeAPI.getAll();

    if (unidadesResult.ok) {
        unidadesResult.data.forEach(unidade => {
            selectUnidade.insertAdjacentHTML('beforeend', 
                `<option value="${unidade.id}">${unidade.nomeUnidade}</option>`);
        });
    }

    // 2. CARREGAR PROFESSORES (USUÁRIOS)
    if (containerProfessores) {
        containerProfessores.innerHTML = '<p>Selecione o professor responsável (Um por turma):</p>';
        const professoresResult = await UsuarioAPI.getAll(); 

        if (professoresResult.ok) {
            const professores = professoresResult.data.filter(u => 
                u.cargos && u.cargos.some(c => c.nomeCargo === 'Professor')
            );
            
            professores.forEach(prof => {
                // CORREÇÃO CRÍTICA: Usa 'nome' (resolve 'undefined' no professor)
                const nome = prof.nome; 
                const id = prof.id;
                containerProfessores.insertAdjacentHTML('beforeend', `
                    <div class="option-item">
                        <input type="radio" id="prof-${id}" name="professorId" value="${id}">
                        <label for="prof-${id}">${nome}</label>
                    </div>
                `);
            });
        }
    }
}

// ====================================================================
// INICIALIZAÇÃO (DOMContentLoaded) - DEVE SER O ÚLTIMO BLOCO
// ====================================================================

document.addEventListener('DOMContentLoaded', async function () {
    // 1. OBTENÇÃO DE REFERÊNCIAS APÓS O DOM CARREGAR
    modal = document.getElementById('modalTurmas');
    modalTitulo = document.getElementById('modalTitulo');
    formTurmas = document.getElementById('formTurmas');
    
    // 2. CARREGAR DADOS DINÂMICOS
    await carregarDadosRelacionados(); 
    
    // 3. CARREGAR TURMAS INICIAIS
    const turmas = await fetchTurmas(); 
    await renderTurmasWithPagination(turmas);
    
    // 4. ANEXAR EVENTOS GLOBAIS
    const addButton = document.getElementById('btnAdicionar');
    if (addButton) {
        // Agora abrirModalAdicionar está definido!
        addButton.addEventListener('click', abrirModalAdicionar); 
    }
    
    const cancelButton = modal ? modal.querySelector('.btn-cancel') : null;
    if (cancelButton) {
        cancelButton.addEventListener('click', fecharModal);
    }
    
    // 5. LÓGICA DE SUBMISSÃO
    if (formTurmas) {
        formTurmas.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const submitButton = formTurmas.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const turmaNome = document.getElementById('turma').value;
                const unidadeId = document.getElementById('unidade').value; 
                // CRÍTICO: Adiciona ":00" para garantir o formato HH:mm:ss que a API Java espera para LocalTime
                const horaAula = document.getElementById('horaAula').value + ":00"; 
                const professorSelecionado = document.querySelector('input[name="professorId"]:checked');
                const professorId = professorSelecionado ? professorSelecionado.value : null;

                if (!professorId || unidadeId === "" || !turmaNome || !horaAula) {
                    alert('Por favor, preencha todos os campos obrigatórios (Nome, Unidade, Horário e Professor).');
                    submitButton.disabled = false;
                    return;
                }
                
                const turmaDataDTO = {
                    nomeTurma: turmaNome, 
                    horaAula: horaAula,
                    idUnidade: parseInt(unidadeId),
                    idProfessorResponsavel: parseInt(professorId)
                };
                
                // Salva ou atualiza
                const resultadoAPI = await salvarTurma(turmaDataDTO, isEditMode);

                if (resultadoAPI) {
                    alert(isEditMode ? 'Turma atualizada com sucesso!' : 'Turma adicionada com sucesso!');
                    const turmasAtualizadas = await fetchTurmas();
                    renderTurmasWithPagination(turmasAtualizadas);
                    fecharModal();
                } else {
                    alert('Erro ao salvar turma. Verifique o console para detalhes da API.');
                }
                
            } catch (error) {
                console.error('Erro no processamento do formulário:', error);
                alert('Erro fatal ao processar o formulário. Verifique o console.');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});