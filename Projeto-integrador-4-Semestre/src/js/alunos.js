// Variáveis globais
let modal;
let modalTitulo;
let formAluno;
let isEditMode = false;
let currentAlunoId = null;

// --- Paginação e integração ---
const ITEMS_PER_PAGE_ALUNOS = 5;
let currentAlunosPage = 1;
let allAlunos = [];

// Função de integração com backend (simulação)
async function fetchAlunos(searchTerm = '') {
    try {
        // TODO: Substituir por chamada real à API Java
        const mockAlunos = [
            {
                id: 1,
                nome: 'Maria Clara Silva Barbosa',
                turma: '2ª e 4ª | 9h30 - 7 a 12',
                unidade: 'Unidade Selles'
            },
            {
                id: 2,
                nome: 'Maria Clara Silva Barbosa',
                turma: '3ª e 5ª | 14h00 - 10 a 15',
                unidade: 'Unidade Lorena'
            },
            {
                id: 3,
                nome: 'Maria Clara Silva Barbosa',
                turma: '2ª e 4ª | 9h30 - 7 a 12',
                unidade: 'Unidade Portal'
            },
            {
                id: 4,
                nome: 'Maria Clara Silva Barbosa',
                turma: '3ª e 5ª | 14h00 - 10 a 15',
                unidade: 'Unidade Selles'
            }
        ];

        // Simula Filtros de Busca
        if (searchTerm) {
            return mockAlunos.filter(aluno =>
                aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aluno.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aluno.unidade.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return mockAlunos;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        return [];
    }
}

function renderAlunos(alunos) {
    const container = document.querySelector('.main-content');
    const alunosHTML = alunos.map(aluno => `
        <div class="table-row" data-id="${aluno.id}">
            <div class="table-data">
                <p class="table-row-title">${aluno.nome}</p>
            </div>
            <div class="table-actions">
                <button class="btn-primary btn-ver-progresso" data-aluno='${JSON.stringify(aluno)}'>Ver progresso</button>
                <button class="btn-edit" data-aluno='${JSON.stringify(aluno)}'>Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        </div>
    `).join('');

    const existingContent = container.querySelector('.table-content');
    if (existingContent) {
        existingContent.innerHTML = alunosHTML;
    } else {
        container.querySelector('.page-header').insertAdjacentHTML('afterend', `<div class="table-content">${alunosHTML}</div>`);
    }

    // Anexa listeners aos botões recém-criados
    attachEventListenersAlunos();
}

function attachEventListenersAlunos() {
    // Botão Ver progresso
    document.querySelectorAll('.table-actions .btn-ver-progresso').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            let alunoData = {};
            if (this.getAttribute('data-aluno')) {
                try {
                    alunoData = JSON.parse(this.getAttribute('data-aluno'));
                } catch (e) {
                    console.error('Erro ao parsear data-aluno:', e);
                }
            }
            if (!alunoData.id) {
                const tableRow = this.closest('.table-row');
                alunoData = {
                    id: parseInt(tableRow.dataset.id),
                    nome: tableRow.querySelector('.table-row-title').textContent
                };
            }
            verProgressoAluno(alunoData);
        });
    });

    // Botão Editar
    document.querySelectorAll('.table-actions .btn-edit').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', function () {
            let alunoData = {};
            if (this.getAttribute('data-aluno')) {
                try {
                    alunoData = JSON.parse(this.getAttribute('data-aluno'));
                } catch (e) {
                    console.error('Erro ao parsear data-aluno:', e);
                }
            }
            if (!alunoData.id) {
                const tableRow = this.closest('.table-row');
                alunoData = {
                    id: parseInt(tableRow.dataset.id),
                    nome: tableRow.querySelector('.table-row-title').textContent
                };
            }
            abrirModalEditar(alunoData);
        });
    });

    // Botão Excluir
    document.querySelectorAll('.table-actions .btn-delete').forEach(btn => {
        btn.removeEventListener('click', null);
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.table-row').dataset.id);
            excluirAluno(id);
        });
    });
}

async function renderAlunosWithPagination(alunos) {
    allAlunos = alunos;
    const paginationData = createPagination(alunos.length, ITEMS_PER_PAGE_ALUNOS, currentAlunosPage);
    const paginated = paginateItems(alunos, ITEMS_PER_PAGE_ALUNOS, currentAlunosPage);
    renderAlunos(paginated);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentAlunosPage = page;
        renderAlunosWithPagination(allAlunos);
    });
}

// Função para buscar dados completos do aluno (similar ao editarAluno.js)
async function buscarAlunoCompletoPorId(alunoId) {
    try {
        // TODO: Substituir por chamada real à API Java
        const mockAlunos = [
            {
                id: 1,
                nomeAluno: 'Maria Clara Silva Barbosa',
                dataNascimento: '2023-05-15', // 1 ano de idade
                nomeResponsavel: 'João Silva Barbosa',
                telefone: '(12) 98765-4321',
                email: 'joao.silva@email.com',
                faseEntrada: 'Golfinho Baby',
                unidade: 'Unidade Portal',
                turma: '3ª e 5ª – 19h10',
                dataMatricula: '2023-01-10',
                descricao: 'Aluno dedicado e participativo nas aulas.',
                faseAtual: 'Golfinho Baby',
                professores: ['Mergulhar', 'Flutuar', 'Nadar', 'Respirar'] // 4 de 6 = 67%
            },
            {
                id: 2,
                nomeAluno: 'Pedro Henrique Santos',
                dataNascimento: '2016-03-20',
                nomeResponsavel: 'Ana Santos',
                telefone: '(12) 98765-4322',
                email: 'ana.santos@email.com',
                faseEntrada: 'Golfinho Infantil',
                unidade: 'Unidade Lorena',
                turma: '3ª e 5ª – 14h00',
                dataMatricula: '2023-02-15',
                descricao: 'Aluno em desenvolvimento constante.',
                faseAtual: 'Golfinho Infantil',
                professores: ['Nadar', 'Respirar'] // 2 de 6 = 33%
            },
            {
                id: 3,
                nomeAluno: 'Ana Beatriz Oliveira',
                dataNascimento: '2014-08-10',
                nomeResponsavel: 'Carlos Oliveira',
                telefone: '(12) 98765-4323',
                email: 'carlos.oliveira@email.com',
                faseEntrada: 'Foca Iniciante',
                unidade: 'Unidade Portal',
                turma: '2ª e 4ª – 19h30',
                dataMatricula: '2022-11-05',
                descricao: 'Aluno com bom desempenho.',
                faseAtual: 'Foca Iniciante',
                professores: ['Imersão', 'Coordenação', 'Nadar', 'Respirar', 'Mergulhar'] // 5 de 6 = 83%
            },
            {
                id: 4,
                nomeAluno: 'Lucas Ferreira Costa',
                dataNascimento: '2015-12-25',
                nomeResponsavel: 'Mariana Costa',
                telefone: '(12) 98765-4324',
                email: 'mariana.costa@email.com',
                faseEntrada: 'Golfinho Baby',
                unidade: 'Unidade Selles',
                turma: '3ª e 5ª – 14h00',
                dataMatricula: '2023-03-01',
                descricao: 'Aluno iniciante, precisa de atenção especial.',
                faseAtual: 'Golfinho Baby',
                professores: ['Mergulhar'] // 1 de 6 = 17%
            }
        ];
        
        const aluno = mockAlunos.find(a => a.id === parseInt(alunoId));
        
        if (!aluno) {
            // Se não encontrar, retorna dados básicos
            return {
                nomeAluno: 'Aluno',
                faseAtual: 'Não informado',
                unidade: 'Não informado',
                turma: 'Não informado',
                professores: [],
                progressoPercentual: 0,
                dataNascimento: null
            };
        }
        
        // Ajustar formato da turma se necessário
        if (aluno.turma && aluno.turma.includes('|')) {
            aluno.turma = aluno.turma.replace(/\s*\|\s*/g, ' – ');
        }
        
        // Calcular progresso baseado nos professores selecionados
        aluno.progressoPercentual = calcularProgresso(aluno.professores);
        
        return aluno;
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        return null;
    }
}

// Função para calcular progresso baseado nos professores selecionados
function calcularProgresso(professores) {
    // Lista de todos os professores possíveis (mesma ordem da página editarAluno.html)
    const todosProfessores = ['Mergulhar', 'Flutuar', 'Nadar', 'Respirar', 'Imersão', 'Coordenação'];
    const totalProfessores = todosProfessores.length;
    
    if (!professores || !Array.isArray(professores) || professores.length === 0) {
        return 0;
    }
    
    // Contar quantos professores foram selecionados
    const professoresSelecionados = professores.filter(prof => 
        todosProfessores.includes(prof)
    ).length;
    
    // Calcular porcentagem: (selecionados / total) * 100
    const progresso = Math.round((professoresSelecionados / totalProfessores) * 100);
    
    return progresso;
}

// Função para calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 'Não informado';
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    if (idade === 0) {
        // Se tem menos de 1 ano, calcular em meses
        const meses = hoje.getMonth() - nascimento.getMonth() + (12 * (hoje.getFullYear() - nascimento.getFullYear()));
        return meses === 1 ? '1 mês' : `${meses} meses`;
    }
    
    return idade === 1 ? '1 ano' : `${idade} anos`;
}

// Função para abrir modal de progresso
async function abrirModalProgresso(alunoData) {
    const modal = document.getElementById('modalProgresso');
    if (!modal) return;
    
    // Buscar dados completos do aluno
    const alunoCompleto = await buscarAlunoCompletoPorId(alunoData.id);
    
    if (!alunoCompleto) {
        alert('Erro ao carregar dados do aluno');
        return;
    }
    
    // Preencher informações no modal
    // Pegar o primeiro professor responsável (ou usar um nome padrão se não houver)
    const responsavel = alunoCompleto.professores && alunoCompleto.professores.length > 0 
        ? alunoCompleto.professores[0] 
        : 'Não informado';
    document.getElementById('progressoResponsavel').textContent = responsavel;
    
    document.getElementById('progressoFase').textContent = 
        alunoCompleto.faseAtual || alunoCompleto.faseEntrada || 'Não informado';
    
    document.getElementById('progressoAluno').textContent = 
        alunoCompleto.nomeAluno || alunoData.nome || 'Não informado';
    
    document.getElementById('progressoIdade').textContent = 
        calcularIdade(alunoCompleto.dataNascimento);
    
    document.getElementById('progressoUnidade').textContent = 
        alunoCompleto.unidade || 'Não informado';
    
    document.getElementById('progressoHorario').textContent = 
        alunoCompleto.turma || 'Não informado';
    
    // Atualizar barra de progresso
    const progressoPercentual = alunoCompleto.progressoPercentual || 0;
    const progressoBarFill = document.getElementById('progressoBarFill');
    if (progressoBarFill) {
        progressoBarFill.style.width = `${progressoPercentual}%`;
    }
    
    // Mostrar modal com animação
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal de progresso
function fecharModalProgresso() {
    const modal = document.getElementById('modalProgresso');
    if (!modal) return;
    
    const modalContent = modal.querySelector('.modal-content');
    
    if (modalContent) {
        // Adicionar classe de animação de fechamento
        modalContent.classList.add('close');
        
        // Aguardar a animação terminar (300ms) antes de esconder o modal
        setTimeout(() => {
            modal.classList.remove('show');
            modalContent.classList.remove('close');
            document.body.style.overflow = 'auto';
        }, 300);
    } else {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Função para ver progresso do aluno
async function verProgressoAluno(alunoData) {
    await abrirModalProgresso(alunoData);
}

// Função para excluir aluno
async function excluirAluno(alunoId) {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
        try {
            // TODO: Implementar chamada real à API Java
            console.log(`Excluindo Aluno ${alunoId}`);
            
            // Simulação de exclusão bem sucedida
            allAlunos = allAlunos.filter(aluno => aluno.id !== alunoId);
            renderAlunosWithPagination(allAlunos);
            alert('Aluno excluído com sucesso!');
        } catch (error) {
            alert('Erro ao excluir aluno.');
            console.error('Erro:', error);
        }
    }
}

// Função para salvar aluno (adicionar/editar)
async function salvarAluno(alunoData) {
    try {
        // TODO: Implementar chamada real à API Java
        console.log('Salvando Aluno:', alunoData);

        // Simula salvamento bem-sucedido
        const alunos = await fetchAlunos();
        if (alunoData.id) {
            // Atualização
            const index = alunos.findIndex(a => a.id === alunoData.id);
            if (index !== -1) {
                alunos[index] = { ...alunos[index], ...alunoData };
            }
        } else {
            // Novo Aluno
            alunoData.id = alunos.length + 1;
            alunos.push(alunoData);
        }

        renderAlunosWithPagination(alunos);
        return true;
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        return false;
    }
}

// Redirecionar para página de adicionar aluno
function abrirModalAdicionar() {
    // Redireciona para a página de editar aluno sem ID (modo adicionar)
    window.location.href = 'editarAluno.html';
}

// Redirecionar para página de editar aluno
function abrirModalEditar(alunoData) {
    // Redireciona para a página de editar aluno passando o ID como parâmetro
    const alunoId = alunoData.id;
    if (alunoId) {
        window.location.href = `editarAluno.html?id=${alunoId}`;
    } else {
        console.error('ID do aluno não encontrado');
        alert('Erro: ID do aluno não encontrado');
    }
}

// Fechar modal
function fecharModal() {
    if (!modal || !formAluno) return;
    const modalContent = modal.querySelector('.modal-content');
    
    if (modalContent) {
        // Adicionar classe de animação de fechamento
        modalContent.classList.add('close');
        
        // Aguardar a animação terminar (300ms) antes de esconder o modal
        setTimeout(() => {
            modal.classList.remove('show');
            modalContent.classList.remove('close');
            document.body.style.overflow = 'auto';
            if (formAluno) formAluno.reset();
            isEditMode = false;
            currentAlunoId = null;
        }, 300);
    } else {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (formAluno) formAluno.reset();
        isEditMode = false;
        currentAlunoId = null;
    }
}

// Função para marcar link ativo na sidebar
function marcarLinkAtivo() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'alunos.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const submenuLink = document.getElementById('linkAprovacoes');
    
    // Verificar se está na página de Fases ou Aprovações
    const isFasesPage = currentPage === 'fases.html';
    const isAprovacoesPage = currentPage === 'aprovacaoProgresso.html';
    
    // Mostrar/esconder submenu
    if (submenuLink) {
        if (isFasesPage || isAprovacoesPage) {
            submenuLink.classList.add('show');
        } else {
            submenuLink.classList.remove('show');
        }
        
        // Marcar submenu como ativo se estiver na página de aprovações
        if (isAprovacoesPage) {
            submenuLink.classList.add('active');
        } else {
            submenuLink.classList.remove('active');
        }
    }
    
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Comparar apenas o nome do arquivo
        const linkFileName = linkPage.split('/').pop();
        const currentFileName = currentPage.split('/').pop();
        
        if (linkFileName === currentFileName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function () {
    // Marcar link ativo na sidebar
    marcarLinkAtivo();
    
    // Inicializar elementos do modal
    modal = document.getElementById('modalAluno');
    modalTitulo = document.getElementById('modalTitulo');
    formAluno = document.getElementById('formAluno');

    // Carregar alunos iniciais
    try {
        const alunos = await fetchAlunos();
        renderAlunosWithPagination(alunos);
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alert('Erro ao carregar os alunos.');
    }

    // Botão adicionar novo
    const addBtn = document.getElementById('btnAdicionar');
    if (addBtn) {
        addBtn.addEventListener('click', abrirModalAdicionar);
    }

    // Botão filtro
    const btnFiltro = document.getElementById('btnFiltro');
    if (btnFiltro) {
        btnFiltro.addEventListener('click', function () {
            // TODO: Implementar funcionalidade de filtro
            console.log('Abrir filtros');
            alert('Funcionalidade de filtro em desenvolvimento');
        });
    }

    // Adicionar evento de busca
    const searchInput = document.getElementById('pesquisarAlunos');
    if (searchInput) {
        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                try {
                    currentAlunosPage = 1;
                    const alunos = await fetchAlunos(e.target.value);
                    renderAlunosWithPagination(alunos);
                } catch (error) {
                    console.error('Erro na busca:', error);
                }
            }, 300); // Debounce de 300ms para evitar muitas requisições
        });
    }

    // Fechar modal com botão Cancelar
    const cancelBtn = document.querySelector('.btn-cancel');
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

    // Fechar modal de progresso clicando fora dele
    const modalProgresso = document.getElementById('modalProgresso');
    if (modalProgresso) {
        modalProgresso.addEventListener('click', function (event) {
            if (event.target === modalProgresso) {
                fecharModalProgresso();
            }
        });
    }

    // Submeter formulário
    if (formAluno) {
        formAluno.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const submitButton = formAluno.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const nomeAluno = document.getElementById('nomeAluno').value;
                const turmaAluno = document.getElementById('turmaAluno').value;
                const unidadeAluno = document.getElementById('unidadeAluno').value;
                
                const alunoData = {
                    nome: nomeAluno,
                    turmaId: turmaAluno,
                    turma: document.getElementById('turmaAluno').selectedOptions[0].text,
                    unidade: unidadeAluno
                };
                
                if (isEditMode) {
                    alunoData.id = currentAlunoId;
                }
                
                const resultado = await salvarAluno(alunoData);
                if (resultado) {
                    alert(isEditMode ? 'Aluno atualizado com sucesso!' : 'Aluno adicionado com sucesso!');
                    const alunosAtualizados = await fetchAlunos();
                    renderAlunosWithPagination(alunosAtualizados);
                    fecharModal();
                } else {
                    alert('Erro ao salvar aluno');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao salvar aluno');
            } finally {
                submitButton.disabled = false;
            }
        });
    }
});

