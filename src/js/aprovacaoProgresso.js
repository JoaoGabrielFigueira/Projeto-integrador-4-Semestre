// Variáveis globais
const ITEMS_PER_PAGE_APROVACOES = 8;
let currentAprovacoesPage = 1;
let allAprovacoes = [];
let filteredAprovacoes = [];

// Função de integração com backend (simulação)
async function fetchAprovacoes(searchTerm = '') {
    try {
        // TODO: Substituir por chamada real à API Java
        const mockAprovacoes = [
            {
                id: 1,
                nome: 'Maria Clara Alves de Almeida',
                turma: 'Golfinho Baby'
            },
            {
                id: 2,
                nome: 'João Pedro Silva Santos',
                turma: 'Golfinho Baby'
            },
            {
                id: 3,
                nome: 'Ana Luiza Costa Oliveira',
                turma: 'Golfinho'
            },
            {
                id: 4,
                nome: 'Pedro Henrique Souza Lima',
                turma: 'Tubarão'
            },
            {
                id: 5,
                nome: 'Mariana Ferreira Rodrigues',
                turma: 'Golfinho Baby'
            },
            {
                id: 6,
                nome: 'Lucas Gabriel Martins Pereira',
                turma: 'Golfinho'
            },
            {
                id: 7,
                nome: 'Isabella Santos Almeida',
                turma: 'Tubarão'
            },
            {
                id: 8,
                nome: 'Rafael Oliveira Costa',
                turma: 'Golfinho Baby'
            },
        ];

        // Simula Filtros de Busca
        if (searchTerm) {
            return mockAprovacoes.filter(aprovacao =>
                aprovacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                aprovacao.turma.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return mockAprovacoes;
    } catch (error) {
        console.error('Erro ao buscar aprovações:', error);
        return [];
    }
}

function renderAprovacoes(aprovacoes) {
    const container = document.getElementById('aprovacoesContainer');
    if (!container) return;

    if (aprovacoes.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #9E9E9E;">Nenhuma aprovação pendente encontrada.</p>';
        return;
    }

    const aprovacoesHTML = aprovacoes.map(aprovacao => `
        <div class="table-row" data-id="${aprovacao.id}">
            <div class="table-data">
                <p class="table-row-title">${aprovacao.nome}</p>
                <span class="table-badge">${aprovacao.turma}</span>
            </div>
            <div class="table-actions">
                <button class="btn-approve" data-id="${aprovacao.id}" data-aluno='${JSON.stringify(aprovacao)}'>Aprovar</button>
                <button class="btn-reject" data-id="${aprovacao.id}" data-aluno='${JSON.stringify(aprovacao)}'>Recusar</button>
                <button class="btn-view-student" data-id="${aprovacao.id}" data-aluno='${JSON.stringify(aprovacao)}'>Ver aluno</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = aprovacoesHTML;

    // Anexa listeners aos botões recém-criados
    attachEventListenersAprovacoes();
}

function attachEventListenersAprovacoes() {
    // Botão Aprovar
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function () {
            const aprovacaoId = this.getAttribute('data-id');
            const alunoData = JSON.parse(this.getAttribute('data-aluno'));
            aprovarProgresso(aprovacaoId, alunoData);
        });
    });

    // Botão Recusar
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function () {
            const aprovacaoId = this.getAttribute('data-id');
            const alunoData = JSON.parse(this.getAttribute('data-aluno'));
            recusarProgresso(aprovacaoId, alunoData);
        });
    });

    // Botão Ver aluno
    document.querySelectorAll('.btn-view-student').forEach(btn => {
        btn.addEventListener('click', function () {
            const aprovacaoId = this.getAttribute('data-id');
            const alunoData = JSON.parse(this.getAttribute('data-aluno'));
            verAluno(aprovacaoId, alunoData);
        });
    });
}

async function aprovarProgresso(aprovacaoId, alunoData) {
    if (!confirm(`Deseja aprovar o progresso de ${alunoData.nome}?`)) {
        return;
    }

    try {
        // TODO: Substituir por chamada real à API Java
        console.log('Aprovando progresso:', aprovacaoId, alunoData);
        
        // Remove da lista
        allAprovacoes = allAprovacoes.filter(a => a.id !== aprovacaoId);
        filteredAprovacoes = filteredAprovacoes.filter(a => a.id !== aprovacaoId);
        
        // Recarrega a lista
        await loadAprovacoes();
        
        alert('Progresso aprovado com sucesso!');
    } catch (error) {
        console.error('Erro ao aprovar progresso:', error);
        alert('Erro ao aprovar progresso. Tente novamente.');
    }
}

async function recusarProgresso(aprovacaoId, alunoData) {
    if (!confirm(`Deseja recusar o progresso de ${alunoData.nome}?`)) {
        return;
    }

    try {
        // TODO: Substituir por chamada real à API Java
        console.log('Recusando progresso:', aprovacaoId, alunoData);
        
        // Remove da lista
        allAprovacoes = allAprovacoes.filter(a => a.id !== aprovacaoId);
        filteredAprovacoes = filteredAprovacoes.filter(a => a.id !== aprovacaoId);
        
        // Recarrega a lista
        await loadAprovacoes();
        
        alert('Progresso recusado.');
    } catch (error) {
        console.error('Erro ao recusar progresso:', error);
        alert('Erro ao recusar progresso. Tente novamente.');
    }
}

async function verAluno(aprovacaoId, alunoData) {
    await abrirModalProgresso(alunoData);
}

// Função para buscar dados completos do aluno
async function buscarAlunoCompletoPorId(alunoId) {
    try {
        // TODO: Substituir por chamada real à API Java
        const mockAlunos = [
            {
                id: 1,
                nomeAluno: 'Maria Clara Alves de Almeida',
                dataNascimento: '2023-05-15',
                nomeResponsavel: 'João Silva Barbosa',
                telefone: '(12) 98765-4321',
                email: 'joao.silva@email.com',
                faseEntrada: 'Golfinho Baby',
                unidade: 'Unidade Portal',
                turma: '3ª e 5ª – 19h10',
                dataMatricula: '2023-01-10',
                descricao: 'Aluno dedicado e participativo nas aulas.',
                faseAtual: 'Golfinho Baby',
                professores: ['Mergulhar', 'Flutuar', 'Nadar', 'Respirar']
            },
            {
                id: 2,
                nomeAluno: 'João Pedro Silva Santos',
                dataNascimento: '2016-03-20',
                nomeResponsavel: 'Ana Santos',
                telefone: '(12) 98765-4322',
                email: 'ana.santos@email.com',
                faseEntrada: 'Golfinho Baby',
                unidade: 'Unidade Lorena',
                turma: '3ª e 5ª – 14h00',
                dataMatricula: '2023-02-15',
                descricao: 'Aluno em desenvolvimento constante.',
                faseAtual: 'Golfinho Baby',
                professores: ['Nadar', 'Respirar']
            },
            {
                id: 3,
                nomeAluno: 'Ana Luiza Costa Oliveira',
                dataNascimento: '2014-08-10',
                nomeResponsavel: 'Carlos Oliveira',
                telefone: '(12) 98765-4323',
                email: 'carlos.oliveira@email.com',
                faseEntrada: 'Golfinho',
                unidade: 'Unidade Portal',
                turma: '2ª e 4ª – 19h30',
                dataMatricula: '2022-11-05',
                descricao: 'Aluno com bom desempenho.',
                faseAtual: 'Golfinho',
                professores: ['Imersão', 'Coordenação', 'Nadar', 'Respirar', 'Mergulhar']
            },
            {
                id: 4,
                nomeAluno: 'Pedro Henrique Souza Lima',
                dataNascimento: '2015-12-25',
                nomeResponsavel: 'Mariana Costa',
                telefone: '(12) 98765-4324',
                email: 'mariana.costa@email.com',
                faseEntrada: 'Tubarão',
                unidade: 'Unidade Selles',
                turma: '3ª e 5ª – 14h00',
                dataMatricula: '2023-03-01',
                descricao: 'Aluno iniciante, precisa de atenção especial.',
                faseAtual: 'Tubarão',
                professores: ['Mergulhar']
            }
        ];
        
        const aluno = mockAlunos.find(a => a.id === parseInt(alunoId));
        
        if (!aluno) {
            // Se não encontrar, retorna dados básicos baseado no alunoData
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
    const todosProfessores = ['Mergulhar', 'Flutuar', 'Nadar', 'Respirar', 'Imersão', 'Coordenação'];
    const totalProfessores = todosProfessores.length;
    
    if (!professores || !Array.isArray(professores) || professores.length === 0) {
        return 0;
    }
    
    const professoresSelecionados = professores.filter(prof => 
        todosProfessores.includes(prof)
    ).length;
    
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
    const responsavel = alunoCompleto.professores && alunoCompleto.professores.length > 0 
        ? alunoCompleto.professores[0] 
        : 'Não informado';
    document.getElementById('progressoResponsavel').textContent = responsavel;
    
    document.getElementById('progressoFase').textContent = 
        alunoCompleto.faseAtual || alunoCompleto.faseEntrada || alunoData.turma || 'Não informado';
    
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
    const progressoBarFillText = document.getElementById('progressoBarFillText');
    
    if (progressoBarFill) {
        progressoBarFill.style.width = `${progressoPercentual}%`;
    }
    
    if (progressoBarFillText) {
        progressoBarFillText.textContent = `${progressoPercentual}%`;
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
        modalContent.classList.add('close');
        
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

async function loadAprovacoes() {
    const searchTerm = document.getElementById('pesquisarAprovacoes')?.value || '';
    allAprovacoes = await fetchAprovacoes(searchTerm);
    filteredAprovacoes = [...allAprovacoes];
    
    // Paginar resultados
    const paginationData = createPagination(
        filteredAprovacoes.length,
        ITEMS_PER_PAGE_APROVACOES,
        currentAprovacoesPage
    );
    
    const paginatedAprovacoes = paginateItems(
        filteredAprovacoes,
        ITEMS_PER_PAGE_APROVACOES,
        currentAprovacoesPage
    );
    
    renderAprovacoes(paginatedAprovacoes);
    renderPaginationControls(paginationData, 'paginationContainer', (page) => {
        currentAprovacoesPage = page;
        loadAprovacoes();
    });
}

function gerarRelatorio() {
    // TODO: Implementar geração de relatório
    console.log('Gerando relatório de aprovações pendentes...');
    alert('Funcionalidade de geração de relatório será implementada em breve.');
}

// Função para marcar link ativo na sidebar
function marcarLinkAtivo() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    marcarLinkAtivo();
    loadAprovacoes();

    // Busca
    const searchInput = document.getElementById('pesquisarAprovacoes');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentAprovacoesPage = 1;
                loadAprovacoes();
            }, 300);
        });
    }

    // Botão Gerar Relatório
    const btnGerarRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnGerarRelatorio) {
        btnGerarRelatorio.addEventListener('click', gerarRelatorio);
    }

    // Botão Filtro
    const btnFiltro = document.getElementById('btnFiltro');
    if (btnFiltro) {
        btnFiltro.addEventListener('click', function () {
            // TODO: Implementar modal de filtros
            alert('Funcionalidade de filtros será implementada em breve.');
        });
    }

    // Fechar modal ao clicar fora dele
    const modalProgresso = document.getElementById('modalProgresso');
    if (modalProgresso) {
        modalProgresso.addEventListener('click', function (event) {
            if (event.target === modalProgresso) {
                fecharModalProgresso();
            }
        });
    }
});