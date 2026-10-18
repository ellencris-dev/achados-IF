/* =========================================================================
   INÍCIO - mostra os itens do catálogo, com busca e filtros
   ========================================================================= */

exigirLogin();

const grade = document.getElementById('grade-itens');
const campoBusca = document.getElementById('campo-busca');
const totalItens = document.getElementById('total-itens');
const contagem = document.getElementById('contagem');

// O que está selecionado agora nos filtros
let statusEscolhido = 'todos';        // 'todos' | 'perdido' | 'encontrado'
let categoriaEscolhida = 'todas';     // 'todas' | 'Eletrônicos' | 'Documentos' ...
let textoBuscado = '';


/* ---------- Monta o HTML de UM card ---------- */
function criarCard(item) {
    const textoBotao = item.situacao === 'encontrado' ? 'Reivindicar item' : 'Ver detalhes';
    const textoData = item.situacao === 'encontrado' ? 'Encontrado em ' : 'Perdido em ';

    return `
        <article class="item-card">
            <div class="item-imagem">
                <img src="${item.foto || FOTO_PADRAO}" alt="${item.titulo}">
                <span class="item-status">${etiquetaSituacao(item)}</span>
                <span class="etiqueta etiqueta-branca item-categoria">${item.categoria}</span>
            </div>
            <div class="item-corpo">
                <h3>${item.titulo}</h3>
                <p class="item-descricao">${item.descricao}</p>
                <p class="item-dado"><span class="icone">location_on</span> ${item.local}</p>
                <p class="item-dado item-data"><span class="icone">calendar_today</span> ${textoData}${formatarData(item.data)}</p>
                <a href="detalhes.html?id=${item.id}" class="botao botao-suave botao-largo">${textoBotao} <span class="icone">chevron_right</span></a>
            </div>
        </article>
    `;
}


/* ---------- Mostra na tela só os itens que passam nos filtros ---------- */
function mostrarItens() {
    // No catálogo público só aparecem itens que ainda não foram devolvidos
    const ativos = lerItens().filter(function (item) {
        return !item.devolvido;
    });

    const filtrados = ativos.filter(function (item) {
        const passaStatus = statusEscolhido === 'todos' || item.situacao === statusEscolhido;
        const passaCategoria = categoriaEscolhida === 'todas' || item.categoria === categoriaEscolhida;

        // Junta título, descrição e local para buscar em tudo de uma vez
        const textoDoItem = (item.titulo + ' ' + item.descricao + ' ' + item.local).toLowerCase();
        const passaBusca = textoDoItem.includes(textoBuscado);

        return passaStatus && passaCategoria && passaBusca;
    });

    if (filtrados.length === 0) {
        grade.innerHTML = '<p class="lista-vazia">Nenhum item encontrado. Tente outros filtros ou termos de busca.</p>';
    } else {
        grade.innerHTML = filtrados.map(criarCard).join('');
    }

    totalItens.innerHTML = '<span class="icone">inventory_2</span> ' + ativos.length + ' itens catalogados no campus';
    contagem.textContent = 'Exibindo ' + filtrados.length + ' de ' + ativos.length + ' itens disponíveis para resgate';
}


/* ---------- Busca ---------- */
document.getElementById('form-busca').addEventListener('submit', function (evento) {
    evento.preventDefault();
    textoBuscado = campoBusca.value.trim().toLowerCase();
    mostrarItens();
});


/* ---------- Filtros ----------
   Cada botão de filtro tem no HTML um data-status ou data-categoria.
   Ex.: <a data-status="perdido">  ->  botao.dataset.status === 'perdido'   */
const filtros = document.querySelectorAll('.filtro');

filtros.forEach(function (botao) {
    botao.addEventListener('click', function (evento) {
        evento.preventDefault();

        if (botao.dataset.status) {
            statusEscolhido = botao.dataset.status;
            marcarAtivo('[data-status]', botao);
        } else {
            categoriaEscolhida = botao.dataset.categoria;
            marcarAtivo('[data-categoria]', botao);
        }

        mostrarItens();
    });
});

// Tira o "ativo" de todos os botões do mesmo grupo e coloca só no clicado
function marcarAtivo(grupo, botaoClicado) {
    document.querySelectorAll(grupo).forEach(function (b) {
        b.classList.remove('ativo');
    });
    botaoClicado.classList.add('ativo');
}


mostrarItens();
