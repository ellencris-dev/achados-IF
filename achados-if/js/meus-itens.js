/* =========================================================================
   MEUS ITENS - lista os itens do usuário logado, com abas, busca,
   "marcar como devolvido" e exclusão
   ========================================================================= */

const usuario = exigirLogin();

const lista = document.getElementById('lista-itens');
const campoBusca = document.getElementById('busca-meus-itens');

let abaAtual = 'ativos';      // 'ativos' | 'devolvidos'
let idParaExcluir = null;     // guarda qual item a janela de exclusão vai apagar


/* ---------- Só os itens que pertencem a quem está logado ---------- */
function meusItens() {
    return lerItens().filter(function (item) {
        return item.dono === usuario.email;
    });
}


/* ---------- Monta o HTML de UM item da lista ---------- */
function criarLinha(item) {
    const estado = item.devolvido
        ? '<span class="etiqueta etiqueta-encontrado"><span class="icone">task_alt</span> Devolvido</span>'
        : '<span class="etiqueta etiqueta-aguardando"><span class="icone">schedule</span> Aguardando dono</span>';

    // Item já devolvido não precisa do botão "Marcar como devolvido"
    const botaoDevolvido = item.devolvido
        ? ''
        : `<a href="#" class="botao botao-principal botao-pequeno" data-devolver="${item.id}"><span class="icone">check_circle</span> Marcar como devolvido</a>`;

    return `
        <article class="meu-item">
            <div class="meu-item-imagem">
                <img src="${item.foto || FOTO_PADRAO}" alt="${item.titulo}">
                ${etiquetaSituacao(item)}
            </div>
            <div class="meu-item-info">
                <p class="meu-item-topo">
                    ${estado}
                    <span>Protocolo IF-${item.id}</span>
                </p>
                <h3>${item.titulo}</h3>
                <p class="meu-item-descricao">${item.descricao}</p>
                <p class="meu-item-dados">
                    <span><span class="icone">location_on</span> ${item.local}</span>
                    <span><span class="icone">calendar_today</span> Ocorrido em ${formatarData(item.data)}</span>
                </p>
            </div>
            <div class="meu-item-acoes">
                <div class="acoes-linha">
                    <a href="cadastrar-item.html?id=${item.id}" class="botao botao-contorno botao-pequeno"><span class="icone">edit</span> Editar</a>
                    <a href="#modal-excluir" class="botao-lixeira" title="Excluir" data-excluir="${item.id}"><span class="icone">delete</span></a>
                </div>
                ${botaoDevolvido}
            </div>
        </article>
    `;
}


/* ---------- Desenha a lista e os contadores das abas ---------- */
function mostrarItens() {
    const itens = meusItens();
    const texto = campoBusca.value.trim().toLowerCase();

    const ativos = itens.filter(function (item) { return !item.devolvido; });
    const devolvidos = itens.filter(function (item) { return item.devolvido; });

    document.getElementById('contador-ativos').textContent = ativos.length;
    document.getElementById('contador-devolvidos').textContent = devolvidos.length;

    const daAba = abaAtual === 'ativos' ? ativos : devolvidos;
    const filtrados = daAba.filter(function (item) {
        return item.titulo.toLowerCase().includes(texto);
    });

    if (filtrados.length === 0) {
        lista.innerHTML = '<p class="lista-vazia">Nenhum item por aqui.</p>';
    } else {
        lista.innerHTML = filtrados.map(criarLinha).join('');
    }
}


/* ---------- Abas ---------- */
document.querySelectorAll('.aba').forEach(function (aba) {
    aba.addEventListener('click', function (evento) {
        evento.preventDefault();

        document.querySelectorAll('.aba').forEach(function (a) {
            a.classList.remove('ativa');
        });
        aba.classList.add('ativa');

        abaAtual = aba.dataset.aba;
        mostrarItens();
    });
});


/* ---------- Busca (filtra enquanto digita) ---------- */
campoBusca.addEventListener('input', mostrarItens);


/* ---------- Cliques nos botões dos itens ----------
   Os itens são criados pelo JavaScript e recriados a cada mostrarItens().
   Por isso colocamos UM ouvinte na lista inteira e descobrimos qual
   botão foi clicado com .closest() (isso se chama "delegação de eventos"). */
lista.addEventListener('click', function (evento) {
    const botaoDevolver = evento.target.closest('[data-devolver]');
    const botaoExcluir = evento.target.closest('[data-excluir]');

    if (botaoDevolver) {
        evento.preventDefault();
        marcarComoDevolvido(Number(botaoDevolver.dataset.devolver));
    }

    if (botaoExcluir) {
        // Não usamos preventDefault: o link "#modal-excluir" abre a janela pelo CSS
        idParaExcluir = Number(botaoExcluir.dataset.excluir);
        const item = buscarItem(idParaExcluir);
        document.getElementById('modal-nome').textContent = item.titulo;
        document.getElementById('modal-data').textContent = 'Ocorrido em ' + formatarData(item.data);
    }
});

function marcarComoDevolvido(id) {
    const itens = lerItens();
    const item = itens.find(function (i) { return i.id === id; });
    item.devolvido = true;
    salvarItens(itens);
    mostrarItens();
}


/* ---------- Confirmar exclusão (botão vermelho da janela) ---------- */
document.getElementById('confirmar-exclusao').addEventListener('click', function () {
    // Mantém todos os itens MENOS o que vai ser excluído
    const restantes = lerItens().filter(function (item) {
        return item.id !== idParaExcluir;
    });
    salvarItens(restantes);
    mostrarItens();
    // O link deste botão é "#", então a janela fecha sozinha pelo CSS
});


mostrarItens();
