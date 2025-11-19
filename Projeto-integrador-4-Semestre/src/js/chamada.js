// Variáveis globais
let alunosTurma = [];
let presencas = {}; // { alunoId: 'presente' | 'faltou' }
let dataAula = new Date();
let turmaId = null;
let turmaNome = null;

// Função para obter parâmetros da URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    turmaId = params.get('id');
    turmaNome = params.get('nome') || 'Turma';
    return { turmaId, turmaNome };
}

// Função para buscar alunos da turma
async function fetchAlunosTurma(turmaId) {
    try {
        // TODO: Substituir por chamada real à API Java
        const mockAlunos = [
            {
                id: 1,
                nome: 'Maria Clara Alves de Almeida',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 2,
                nome: 'João Pedro Silva Santos',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 3,
                nome: 'Ana Luiza Costa Oliveira',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 4,
                nome: 'Pedro Henrique Souza Lima',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 5,
                nome: 'Mariana Ferreira Rodrigues',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 6,
                nome: 'Lucas Gabriel Martins Pereira',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 7,
                nome: 'Isabella Santos Almeida',
                turma: '2º e 4º 19h10 - 7 a 12'
            },
            {
                id: 8,
                nome: 'Rafael Oliveira Costa',
                turma: '2º e 4º 19h10 - 7 a 12'
            }
        ];

        // Filtrar alunos da turma (simulação)
        return mockAlunos;
    } catch (error) {
        console.error('Erro ao buscar alunos da turma:', error);
        return [];
    }
}

// Função para formatar data
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para atualizar display da data
function atualizarDataDisplay() {
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        // Formatar data para YYYY-MM-DD (formato do input date)
        const ano = dataAula.getFullYear();
        const mes = String(dataAula.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAula.getDate()).padStart(2, '0');
        dateInput.value = `${ano}-${mes}-${dia}`;
    }
}

// Função para renderizar lista de alunos
function renderizarListaAlunos() {
    const container = document.getElementById('attendanceList');
    if (!container) return;

    if (alunosTurma.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #9E9E9E;">Nenhum aluno encontrado nesta turma.</p>';
        return;
    }

    const listaHTML = alunosTurma.map(aluno => {
        const presenca = presencas[aluno.id] || 'presente'; // Padrão: presente
        return `
            <div class="attendance-item" data-aluno-id="${aluno.id}">
                <div class="attendance-item-name-wrapper">
                    <div class="attendance-item-name">${aluno.nome}</div>
                </div>
                <div class="attendance-actions">
                    <button class="btn-presente ${presenca === 'presente' ? 'active' : ''}" 
                            data-aluno-id="${aluno.id}" 
                            data-status="presente">
                        <span class="attendance-indicator"></span>
                        Presente
                    </button>
                    <button class="btn-faltou ${presenca === 'faltou' ? 'active' : ''}" 
                            data-aluno-id="${aluno.id}" 
                            data-status="faltou">
                        <span class="attendance-indicator"></span>
                        Faltou
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = listaHTML;

    // Adicionar event listeners
    attachAttendanceListeners();
}

// Função para anexar event listeners aos botões de presença
function attachAttendanceListeners() {
    document.querySelectorAll('.btn-presente, .btn-faltou').forEach(btn => {
        btn.addEventListener('click', function () {
            const alunoId = parseInt(this.getAttribute('data-aluno-id'));
            const status = this.getAttribute('data-status');
            
            // Atualizar presença
            presencas[alunoId] = status;
            
            // Atualizar visual dos botões
            const item = this.closest('.attendance-item');
            const btnPresente = item.querySelector('.btn-presente');
            const btnFaltou = item.querySelector('.btn-faltou');
            
            if (status === 'presente') {
                btnPresente.classList.add('active');
                btnFaltou.classList.remove('active');
            } else {
                btnFaltou.classList.add('active');
                btnPresente.classList.remove('active');
            }
        });
    });
}

// Função para registrar presença
async function registrarPresenca() {
    try {
        // TODO: Substituir por chamada real à API Java
        const dadosPresenca = {
            turmaId: turmaId,
            data: dataAula.toISOString().split('T')[0],
            presencas: presencas
        };

        console.log('Registrando presença:', dadosPresenca);
        
        // Simulação de sucesso
        alert('Presença registrada com sucesso!');
        
        // Opcional: redirecionar de volta para turmas
        // window.location.href = 'turmas.html';
    } catch (error) {
        console.error('Erro ao registrar presença:', error);
        alert('Erro ao registrar presença. Tente novamente.');
    }
}

// Função para atualizar data quando o input mudar
function atualizarData() {
    const dateInput = document.getElementById('dateInput');
    if (dateInput && dateInput.value) {
        dataAula = new Date(dateInput.value);
        // Recarregar presenças para a nova data (se necessário)
        // loadPresencasData();
    }
}

// Função para gerar relatório
function gerarRelatorio() {
    // TODO: Implementar geração de relatório
    console.log('Gerando relatório de presença...');
    alert('Funcionalidade de geração de relatório será implementada em breve.');
}

// Função para fechar página
function fecharPagina() {
    if (confirm('Deseja sair sem salvar as alterações?')) {
        window.location.href = 'turmas.html';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', async function () {
    // Obter parâmetros da URL
    const params = getUrlParams();
    
    // Botão fechar
    const btnClose = document.getElementById('btnClose');
    if (btnClose) {
        btnClose.addEventListener('click', fecharPagina);
    }
    
    // Input de data
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.addEventListener('change', atualizarData);
    }
    
    // Botão gerar relatório
    const btnGerarRelatorio = document.getElementById('btnGerarRelatorio');
    if (btnGerarRelatorio) {
        btnGerarRelatorio.addEventListener('click', function () {
            gerarRelatorio();
        });
    }
    
    // Botão registrar presença
    const btnRegistrar = document.getElementById('btnRegistrarPresenca');
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', registrarPresenca);
    }
    
    // Inicializar data
    atualizarDataDisplay();
    
    // Carregar alunos da turma
    alunosTurma = await fetchAlunosTurma(turmaId);
    
    // Inicializar todas as presenças como "presente" por padrão
    alunosTurma.forEach(aluno => {
        presencas[aluno.id] = 'presente';
    });
    
    // Renderizar lista
    renderizarListaAlunos();
});

