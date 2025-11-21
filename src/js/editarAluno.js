// ============================================
// CONTROLE DE ESTADO - PÁGINA EDITAR ALUNO
// ============================================

// Estado do formulário
const formState = {
    nomeAluno: '',
    dataNascimento: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    faseEntrada: '',
    unidade: '',
    turma: '',
    dataMatricula: '',
    descricao: '',
    faseAtual: '',
    professores: []
};

// Elementos do formulário
const formEditarAluno = document.getElementById('formEditarAluno');
const formAtualizarAtividades = document.getElementById('formAtualizarAtividades');
const btnClose = document.getElementById('btnClose');

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar dados do aluno (simulação - substituir por chamada real à API)
    await carregarDadosAluno();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Aplicar máscara de telefone
    aplicarMascaraTelefone();
});

// ============================================
// CARREGAR DADOS DO ALUNO
// ============================================

async function carregarDadosAluno() {
    const alunoId = obterIdAlunoDaURL();
    const sectionTitle = document.getElementById('sectionTitle');
    
    // Se não houver ID, está no modo adicionar
    if (!alunoId) {
        // Alterar título para "Adicionar Aluno"
        if (sectionTitle) {
            sectionTitle.textContent = 'Adicionar Aluno';
        }
        // Limpar formulário e não carregar dados
        limparFormulario();
        return;
    }
    
    // Se houver ID, está no modo editar
    if (sectionTitle) {
        sectionTitle.textContent = 'Editar Aluno';
    }
    
    try {
        // TODO: Substituir por chamada real à API
        // Por enquanto, busca nos dados mockados
        const dadosAluno = await buscarAlunoPorId(alunoId);
        
        if (!dadosAluno) {
            alert('Aluno não encontrado. Redirecionando...');
            window.location.href = 'alunos.html';
            return;
        }
        
        // Preencher formulário com dados
        preencherFormulario(dadosAluno);
    } catch (error) {
        console.error('Erro ao carregar dados do aluno:', error);
        alert('Erro ao carregar dados do aluno. Redirecionando...');
        window.location.href = 'alunos.html';
    }
}

// ============================================
// BUSCAR ALUNO POR ID
// ============================================

async function buscarAlunoPorId(alunoId) {
    try {
        // TODO: Substituir por chamada real à API Java
        // Mock de dados - simula busca de aluno completo
        const mockAlunos = [
            {
                id: 1,
                nomeAluno: 'Maria Clara Silva Barbosa',
                dataNascimento: '2015-05-15',
                nomeResponsavel: 'João Silva Barbosa',
                telefone: '(12) 98765-4321',
                email: 'joao.silva@email.com',
                faseEntrada: 'Golfinho Baby',
                unidade: 'Unidade Selles',
                turma: '2ª e 4ª – 9h30',
                dataMatricula: '2023-01-10',
                descricao: 'Aluno dedicado e participativo nas aulas.',
                faseAtual: 'Golfinho Baby',
                professores: ['Mergulhar', 'Flutuar']
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
                professores: ['Nadar', 'Respirar']
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
                professores: ['Imersão', 'Coordenação']
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
                professores: ['Mergulhar']
            }
        ];
        
        const aluno = mockAlunos.find(a => a.id === parseInt(alunoId));
        
        if (!aluno) {
            return null;
        }
        
        // Ajustar formato da turma se necessário (converter | para – caso venha de outra fonte)
        if (aluno.turma && aluno.turma.includes('|')) {
            aluno.turma = aluno.turma.replace(/\s*\|\s*/g, ' – ');
        }
        
        return aluno;
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        return null;
    }
}

// ============================================
// LIMPAR FORMULÁRIO
// ============================================

function limparFormulario() {
    // Limpar campos do formulário Editar Aluno
    if (formEditarAluno) {
        formEditarAluno.reset();
    }
    
    // Limpar campos do formulário Atualizar Atividades
    if (formAtualizarAtividades) {
        formAtualizarAtividades.reset();
    }
    
    // Limpar checkboxes de professores
    const checkboxes = document.querySelectorAll('input[name="professores"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Limpar estado
    Object.keys(formState).forEach(key => {
        if (Array.isArray(formState[key])) {
            formState[key] = [];
        } else {
            formState[key] = '';
        }
    });
}

// ============================================
// PREENCHER FORMULÁRIO
// ============================================

function preencherFormulario(dados) {
    // Atualizar estado
    Object.assign(formState, dados);
    
    // Preencher campos do formulário Editar Aluno
    document.getElementById('nomeAluno').value = dados.nomeAluno || '';
    document.getElementById('dataNascimento').value = dados.dataNascimento || '';
    document.getElementById('nomeResponsavel').value = dados.nomeResponsavel || '';
    document.getElementById('telefone').value = dados.telefone || '';
    document.getElementById('email').value = dados.email || '';
    document.getElementById('faseEntrada').value = dados.faseEntrada || '';
    document.getElementById('unidade').value = dados.unidade || '';
    document.getElementById('turma').value = dados.turma || '';
    document.getElementById('dataMatricula').value = dados.dataMatricula || '';
    document.getElementById('descricao').value = dados.descricao || '';
    
    // Preencher campos do formulário Atualizar Atividades
    document.getElementById('faseAtual').value = dados.faseAtual || '';
    
    // Marcar professores selecionados
    if (Array.isArray(dados.professores)) {
        dados.professores.forEach(prof => {
            const checkbox = document.querySelector(`input[value="${prof}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
}

// ============================================
// CONFIGURAR EVENT LISTENERS
// ============================================

function configurarEventListeners() {
    // Botão fechar
    if (btnClose) {
        btnClose.addEventListener('click', function() {
            // Voltar para a página anterior ou fechar
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'alunos.html';
            }
        });
    }
    
    // Formulário Editar Aluno - atualizar estado em tempo real
    if (formEditarAluno) {
        const inputs = formEditarAluno.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                formState[input.name] = input.value;
            });
            
            input.addEventListener('change', function() {
                formState[input.name] = input.value;
            });
        });
        
        // Submissão do formulário
        formEditarAluno.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarDadosAluno();
        });
    }
    
    // Formulário Atualizar Atividades
    if (formAtualizarAtividades) {
        // Atualizar fase atual no estado
        const faseAtual = document.getElementById('faseAtual');
        if (faseAtual) {
            faseAtual.addEventListener('change', function() {
                formState.faseAtual = this.value;
            });
        }
        
        // Atualizar professores selecionados
        const checkboxes = formAtualizarAtividades.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                atualizarProfessoresSelecionados();
            });
        });
        
        // Submissão do formulário
        formAtualizarAtividades.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarAtividades();
        });
    }
}

// ============================================
// ATUALIZAR PROFESSORES SELECIONADOS
// ============================================

function atualizarProfessoresSelecionados() {
    const checkboxes = document.querySelectorAll('input[name="professores"]:checked');
    formState.professores = Array.from(checkboxes).map(cb => cb.value);
}

// ============================================
// SALVAR DADOS DO ALUNO
// ============================================

async function salvarDadosAluno() {
    const alunoId = obterIdAlunoDaURL();
    const isEditMode = !!alunoId;
    
    const dados = {
        nomeAluno: document.getElementById('nomeAluno').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        nomeResponsavel: document.getElementById('nomeResponsavel').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        faseEntrada: document.getElementById('faseEntrada').value,
        unidade: document.getElementById('unidade').value,
        turma: document.getElementById('turma').value,
        dataMatricula: document.getElementById('dataMatricula').value,
        descricao: document.getElementById('descricao').value
    };
    
    // Se estiver editando, incluir o ID
    if (isEditMode) {
        dados.id = parseInt(alunoId);
    }
    
    // Validar dados
    if (!validarFormularioEditarAluno(dados)) {
        return;
    }
    
    try {
        // TODO: Substituir por chamada real à API
        console.log(isEditMode ? 'Atualizando dados do aluno:' : 'Adicionando novo aluno:', dados);
        
        // Simular salvamento
        // Aqui você faria a chamada à API:
        // const resultado = await fetch('/api/alunos', {
        //     method: isEditMode ? 'PUT' : 'POST',
        //     body: JSON.stringify(dados)
        // });
        
        alert(isEditMode ? 'Aluno atualizado com sucesso!' : 'Aluno adicionado com sucesso!');
        
        // Atualizar estado
        Object.assign(formState, dados);
        
        // Redirecionar para a lista de alunos após salvar
        setTimeout(() => {
            window.location.href = 'alunos.html';
        }, 1000);
    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        alert('Erro ao salvar aluno. Tente novamente.');
    }
}

// ============================================
// SALVAR ATIVIDADES
// ============================================

function salvarAtividades() {
    const faseAtual = document.getElementById('faseAtual').value;
    atualizarProfessoresSelecionados();
    
    // Validar
    if (!faseAtual) {
        alert('Por favor, selecione a fase atual.');
        return;
    }
    
    if (formState.professores.length === 0) {
        alert('Por favor, selecione pelo menos um professor responsável.');
        return;
    }
    
    const dados = {
        faseAtual: faseAtual,
        professores: formState.professores
    };
    
    // TODO: Substituir por chamada real à API
    console.log('Salvando atividades:', dados);
    
    // Simular salvamento
    alert('Atividades registradas com sucesso!');
    
    // Atualizar estado
    formState.faseAtual = faseAtual;
}

// ============================================
// VALIDAÇÃO
// ============================================

function validarFormularioEditarAluno(dados) {
    if (!dados.nomeAluno || dados.nomeAluno.trim() === '') {
        alert('Por favor, preencha o nome do aluno.');
        return false;
    }
    
    if (!dados.dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        return false;
    }
    
    if (!dados.nomeResponsavel || dados.nomeResponsavel.trim() === '') {
        alert('Por favor, preencha o nome do responsável.');
        return false;
    }
    
    if (!dados.telefone || dados.telefone.trim() === '') {
        alert('Por favor, preencha o telefone.');
        return false;
    }
    
    if (!dados.email || dados.email.trim() === '') {
        alert('Por favor, preencha o e-mail.');
        return false;
    }
    
    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }
    
    return true;
}

// ============================================
// MÁSCARA DE TELEFONE
// ============================================

function aplicarMascaraTelefone() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            }
            
            e.target.value = value;
            formState.telefone = value;
        });
    }
}

// ============================================
// UTILITÁRIOS
// ============================================

function obterIdAlunoDaURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || null;
}

