/* =========================================================================
   ACHADOS IF - Interacoes da pagina de inicio
   Tudo aqui trabalha em cima dos cards que ja existem no HTML: o estado
   (status, categoria, texto) e lido do proprio DOM, sem duplicar dados.
   ========================================================================= */

const TOTAL_CATALOGO = 38;   // valor mockado; virá da API depois

const grade = document.getElementById('grade');
const contagem = document.getElementById('contagem');
const botaoMais = document.getElementById('carregar-mais');
const formBusca = document.querySelector('.busca');
const campoBusca = document.getElementById('campo-busca');

/* Molde dos cards originais: usado para "Carregar mais" ate o total mockado */
const moldes = Array.from(grade.querySelectorAll('.card')).map((c) => c.cloneNode(true));

/* Estado atual dos filtros */
const filtros = { status: 'todos', categoria: 'todas', texto: '' };

/* ---------- Normalizacao: "Eletrônicos" e "eletronicos" devem casar ---------- */
const normalizar = (s) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/* ---------- Leitura dos dados de um card a partir do DOM ---------- */
function dadosDoCard(card) {
    return {
        status: card.querySelector('.tag--perdido') ? 'perdidos' : 'encontrados',
        categoria: normalizar(card.querySelector('.tag--categoria').textContent),
        texto: normalizar(card.textContent),
    };
}

/* ---------- Filtragem ---------- */
function aplicarFiltros() {
    const cards = grade.querySelectorAll('.card');
    let visiveis = 0;

    cards.forEach((card) => {
        const d = dadosDoCard(card);
        const passa =
            (filtros.status === 'todos' || d.status === filtros.status) &&
            (filtros.categoria === 'todas' || d.categoria === filtros.categoria) &&
            d.texto.includes(filtros.texto);

        card.hidden = !passa;
        if (passa) {
            visiveis++;
            reanimar(card);
        }
    });

    atualizarContagem(visiveis);
    mostrarVazio(visiveis === 0);
}

function filtrosAtivos() {
    return filtros.status !== 'todos' || filtros.categoria !== 'todas' || filtros.texto !== '';
}

function atualizarContagem(visiveis) {
    const total = grade.querySelectorAll('.card').length;
    contagem.textContent = filtrosAtivos()
        ? `${visiveis} ${visiveis === 1 ? 'item encontrado' : 'itens encontrados'} para os filtros aplicados`
        : `Exibindo ${total} de ${TOTAL_CATALOGO} itens disponíveis para resgate`;

    // Sem filtro e ainda ha itens no catalogo -> botao ativo; caso contrario, some
    botaoMais.hidden = filtrosAtivos() || total >= TOTAL_CATALOGO;
}

/* ---------- Estado vazio ---------- */
const vazio = document.createElement('p');
vazio.className = 'grade-vazia';
vazio.textContent = 'Nenhum item encontrado. Tente outros filtros ou termos de busca.';
vazio.hidden = true;
grade.after(vazio);

function mostrarVazio(sim) {
    vazio.hidden = !sim;
}

/* ---------- Reinicia a animacao de entrada do card ---------- */
function reanimar(card) {
    card.classList.remove('card--entrada');
    void card.offsetWidth;          // forca o navegador a "esquecer" a animacao anterior
    card.classList.add('card--entrada');
}

/* ---------- Chips (status e categoria) ---------- */
function ligarGrupo(grupo, chave, classeAtiva) {
    grupo.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;

        grupo.querySelectorAll('.chip').forEach((c) => {
            c.classList.remove(classeAtiva);
            c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add(classeAtiva);
        chip.setAttribute('aria-pressed', 'true');

        const valor = normalizar(chip.textContent);
        filtros[chave] = valor === 'todas categorias' ? 'todas' : valor;
        aplicarFiltros();
    });
}

const [grupoStatus, grupoCategoria] = document.querySelectorAll('.filtros__grupo');
ligarGrupo(grupoStatus, 'status', 'chip--ativo');
ligarGrupo(grupoCategoria, 'categoria', 'chip--neutro-ativo');

/* ---------- Busca: ao enviar e enquanto digita ---------- */
formBusca.addEventListener('submit', (e) => {
    e.preventDefault();                       // impede o recarregamento da pagina
    filtros.texto = normalizar(campoBusca.value);
    aplicarFiltros();
});
campoBusca.addEventListener('input', () => {
    filtros.texto = normalizar(campoBusca.value);
    aplicarFiltros();
});

/* ---------- Carregar mais ---------- */
botaoMais.addEventListener('click', () => {
    botaoMais.classList.add('botao--carregando');
    botaoMais.disabled = true;

    // Simula a espera de uma requisicao; trocar por fetch() quando houver API
    setTimeout(() => {
        const faltam = TOTAL_CATALOGO - grade.querySelectorAll('.card').length;
        moldes.slice(0, Math.min(moldes.length, faltam)).forEach((molde) => {
            const novo = molde.cloneNode(true);
            reanimar(novo);
            grade.appendChild(novo);
        });

        botaoMais.classList.remove('botao--carregando');
        botaoMais.disabled = false;
        aplicarFiltros();
    }, 700);
});

/* Animacao de entrada inicial, escalonada */
grade.querySelectorAll('.card').forEach((card, i) => {
    card.style.animationDelay = `${i * 60}ms`;
    card.classList.add('card--entrada');
});
