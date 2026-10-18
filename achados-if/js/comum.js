/* =========================================================================
   ACHADOS IF - Código compartilhado por TODAS as páginas
   -------------------------------------------------------------------------
   Ainda não temos back-end (API), então usamos o localStorage do navegador
   como se fosse um "banco de dados". Ele guarda TEXTO, por isso usamos:
     - JSON.stringify(objeto)  -> transforma objeto em texto para salvar
     - JSON.parse(texto)       -> transforma o texto de volta em objeto
   Quando a API existir, só as funções deste arquivo precisam mudar.
   ========================================================================= */


/* ---------- Dados iniciais (usados só na primeira vez que o site abre) ---------- */

// Usuário de demonstração, para testar sem precisar criar conta
const USUARIOS_INICIAIS = [
    { nome: 'Aluno Demonstração', matricula: '2024101100123', email: 'aluno@if.edu.br', senha: '12345678' }
];

// Itens de exemplo. "dono" é o e-mail de quem cadastrou o item.
const ITENS_INICIAIS = [
    { id: 1, titulo: 'Calculadora Científica Casio', situacao: 'encontrado', categoria: 'Eletrônicos', local: 'Bloco B, Sala 12', data: '2026-10-18', descricao: 'Aparelho preto com tampa protetora e adesivo pequeno do curso de Edificações.', foto: 'imagens/calculadora.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 2, titulo: 'Mochila preta Dell', situacao: 'perdido', categoria: 'Outros', local: 'Laboratório de Informática 3', data: '2026-10-14', descricao: 'Contém cadernos pautados do 4º período e um carregador de notebook.', foto: 'imagens/mochila.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 3, titulo: 'Cartão do Estudante / SUAP', situacao: 'encontrado', categoria: 'Documentos', local: 'Refeitório Estudantil', data: '2026-10-17', descricao: 'Identificação estudantil de matrícula com iniciais M. S. Henrique.', foto: 'imagens/cartao-estudante.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 4, titulo: 'Garrafa Térmica Stanley', situacao: 'perdido', categoria: 'Outros', local: 'Pátio Central / Cantina', data: '2026-10-15', descricao: 'Garrafa verde oliva com pequeno amassado na base. Esquecida durante o intervalo.', foto: 'imagens/garrafa-stanley.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 5, titulo: 'Fone de ouvido Bluetooth', situacao: 'encontrado', categoria: 'Eletrônicos', local: 'Biblioteca Central - Piso 2', data: '2026-10-18', descricao: 'Estojo carregador branco com fones intra-auriculares. Deixado sobre uma mesa.', foto: 'imagens/fone.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 6, titulo: 'Moletom Canguru Cinza', situacao: 'perdido', categoria: 'Roupas', local: 'Quadra Poliesportiva', data: '2026-10-12', descricao: 'Casaco com capuz cinza mescla com o emblema do Instituto Federal.', foto: 'imagens/moletom.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 7, titulo: 'Chaveiro com chave de armário', situacao: 'encontrado', categoria: 'Outros', local: 'Vestiário Masculino / Quadra', data: '2026-10-17', descricao: 'Duas chaves pequenas tipo Yale com tag plástico vermelho numerado.', foto: 'imagens/chaveiro.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    { id: 8, titulo: 'Estojo Azul Faber-Castell', situacao: 'encontrado', categoria: 'Material escolar', local: 'Auditório Principal', data: '2026-10-17', descricao: 'Estojo de tecido azul marinho com canetas esferográficas e marcadores.', foto: 'imagens/estojo.jpg', dono: 'servidor@if.edu.br', nomeDono: 'Profª. Helena Souza', devolvido: false },
    // Itens do usuário de demonstração (aparecem em "Meus itens")
    { id: 9, titulo: 'Carregador de celular', situacao: 'perdido', categoria: 'Eletrônicos', local: 'Laboratório de Informática 3', data: '2026-10-10', descricao: 'Carregador rápido USB-C preto Samsung esquecido conectado na tomada.', foto: 'imagens/carregador.jpg', dono: 'aluno@if.edu.br', nomeDono: 'Aluno Demonstração', devolvido: false },
    { id: 10, titulo: 'Caderno de Algoritmos', situacao: 'encontrado', categoria: 'Material escolar', local: 'Biblioteca Central - Sala de Estudos', data: '2026-10-08', descricao: 'Caderno capa dura 10 matérias com anotações de Estrutura de Dados.', foto: 'imagens/caderno.jpg', dono: 'aluno@if.edu.br', nomeDono: 'Aluno Demonstração', devolvido: false },
    { id: 11, titulo: 'Garrafa térmica azul', situacao: 'encontrado', categoria: 'Outros', local: 'Pátio Central / Cantina', data: '2026-10-05', descricao: 'Garrafa de inox térmica azul escuro com alça na tampa, capacidade de 750ml.', foto: 'imagens/garrafa-azul.jpg', dono: 'aluno@if.edu.br', nomeDono: 'Aluno Demonstração', devolvido: true }
];

// Usado quando a pessoa entra com o login todo em branco
const VISITANTE = { nome: 'Visitante', matricula: '', email: '', senha: '' };

// Imagem mostrada quando o item não tem foto
const FOTO_PADRAO = 'imagens/sem-foto.svg';


/* ---------- Leitura e gravação no localStorage ---------- */

// Lê uma lista salva. Se ainda não existir, salva e devolve a lista inicial.
function lerLista(chave, listaInicial) {
    const texto = localStorage.getItem(chave);

    if (texto === null) {
        localStorage.setItem(chave, JSON.stringify(listaInicial));
        return listaInicial;
    }

    return JSON.parse(texto);
}

function lerItens() {
    return lerLista('itens', ITENS_INICIAIS);
}

function salvarItens(itens) {
    localStorage.setItem('itens', JSON.stringify(itens));
}

function lerUsuarios() {
    return lerLista('usuarios', USUARIOS_INICIAIS);
}

function salvarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Procura um item pelo id. Devolve o item ou "undefined" se não achar.
function buscarItem(id) {
    return lerItens().find(function (item) {
        return item.id === id;
    });
}


/* ---------- Usuário logado ---------- */

function pegarUsuarioLogado() {
    return JSON.parse(localStorage.getItem('usuarioLogado'));   // null se ninguém logou
}

function entrar(usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

function sair() {
    localStorage.removeItem('usuarioLogado');
}

// Chamada no início das páginas internas: sem login, volta para o login.
// Também preenche o cabeçalho com os dados do usuário e ativa o botão "Sair".
function exigirLogin() {
    const usuario = pegarUsuarioLogado();

    if (usuario === null) {
        window.location.href = 'login.html';
        return null;
    }

    // Avatar com as iniciais do nome ("Aluno Demonstração" -> "AD", "Visitante" -> "VI")
    const avatar = document.querySelector('.usuario-avatar');
    if (avatar) {
        const partes = usuario.nome.split(' ');
        const ultima = partes[partes.length - 1];
        const iniciais = partes.length > 1 ? partes[0][0] + ultima[0] : partes[0].slice(0, 2);
        avatar.textContent = iniciais.toUpperCase();
    }

    // Troca "Campus Central - Aluno" pelo nome de quem está logado
    const campus = document.querySelector('.usuario-campus');
    if (campus) {
        campus.innerHTML = '<span class="icone">school</span> ' + usuario.nome;
    }

    // O único link dentro de .usuario é o de "Sair"
    const linkSair = document.querySelector('.usuario a');
    linkSair.addEventListener('click', sair);

    return usuario;
}


/* ---------- Funções de ajuda ---------- */

// "2026-10-18" -> "18/10/2026"
function formatarData(dataIso) {
    const partes = dataIso.split('-');   // ["2026", "10", "18"]
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// Pega o "id" do endereço. Ex.: detalhes.html?id=3 -> 3
function pegarIdDaUrl() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');     // texto "3" ou null
    return id === null ? null : Number(id);
}

// Etiqueta colorida de Perdido / Encontrado (classes que já existem no CSS)
function etiquetaSituacao(item) {
    if (item.situacao === 'perdido') {
        return '<span class="etiqueta etiqueta-perdido"><span class="icone">error</span> Perdido</span>';
    }
    return '<span class="etiqueta etiqueta-encontrado"><span class="icone">check_circle</span> Encontrado</span>';
}

// Liga o ícone de "olho" dos campos de senha para mostrar/esconder o texto
function ativarMostrarSenha() {
    const olhos = document.querySelectorAll('.campo-caixa .icone');

    olhos.forEach(function (olho) {
        if (olho.textContent !== 'visibility') return;   // só os ícones de olho

        olho.style.cursor = 'pointer';
        olho.addEventListener('click', function () {
            const campo = olho.parentElement.querySelector('input');

            if (campo.type === 'password') {
                campo.type = 'text';
                olho.textContent = 'visibility_off';
            } else {
                campo.type = 'password';
                olho.textContent = 'visibility';
            }
        });
    });
}
