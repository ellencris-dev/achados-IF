/* =========================================================================
   CADASTRAR ITEM - cria um item novo ou edita um existente
   -------------------------------------------------------------------------
   cadastrar-item.html        -> cadastra um item novo
   cadastrar-item.html?id=9   -> edita o item 9 (vem do botão "Editar")
   ========================================================================= */

const usuario = exigirLogin();

const formItem = document.getElementById('form-item');
const campoFoto = document.getElementById('foto');
const textoFoto = document.getElementById('texto-foto');

const idEditando = pegarIdDaUrl();   // null quando é um cadastro novo
let fotoEscolhida = '';              // a foto vira um texto (base64) para caber no localStorage


/* ---------- Modo edição: preenche o formulário com o item ---------- */
if (idEditando !== null) {
    const item = buscarItem(idEditando);

    document.getElementById('titulo-pagina').textContent = 'Editar item';
    document.querySelector('input[value="' + item.situacao + '"]').checked = true;
    document.getElementById('titulo').value = item.titulo;
    document.getElementById('categoria').value = item.categoria;
    document.getElementById('data').value = item.data;
    document.getElementById('local').value = item.local;
    document.getElementById('descricao').value = item.descricao;

    fotoEscolhida = item.foto;
    if (fotoEscolhida) textoFoto.textContent = 'Foto atual mantida. Escolha outra para trocar.';
}


/* ---------- Foto: lê o arquivo escolhido ---------- */
campoFoto.addEventListener('change', function () {
    const arquivo = campoFoto.files[0];
    if (!arquivo) return;

    // O localStorage tem pouco espaço (uns 5MB no total), então limitamos a 1MB
    if (arquivo.size > 1024 * 1024) {
        alert('A foto precisa ter no máximo 1MB.');
        campoFoto.value = '';
        return;
    }

    // FileReader lê o arquivo e entrega como texto "data:image/jpeg;base64,..."
    const leitor = new FileReader();
    leitor.onload = function () {
        fotoEscolhida = leitor.result;
        textoFoto.textContent = 'Foto selecionada: ' + arquivo.name;
    };
    leitor.readAsDataURL(arquivo);
});


/* ---------- Salvar ---------- */
formItem.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const situacaoMarcada = document.querySelector('input[name="situacao"]:checked');

    const dados = {
        situacao: situacaoMarcada ? situacaoMarcada.value : '',
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria').value,
        data: document.getElementById('data').value,
        local: document.getElementById('local').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        foto: fotoEscolhida
    };

    if (dados.situacao === '' || dados.titulo === '' || dados.categoria === '' ||
        dados.data === '' || dados.local === '' || dados.descricao === '') {
        alert('Preencha todos os campos obrigatórios (*).');
        return;
    }

    const itens = lerItens();

    if (idEditando === null) {
        // NOVO: completa os dados e coloca no fim da lista
        dados.id = Date.now();          // número único (milissegundos desde 1970)
        dados.dono = usuario.email;
        dados.nomeDono = usuario.nome;
        dados.devolvido = false;
        itens.push(dados);
    } else {
        // EDIÇÃO: acha a posição do item e junta os dados novos com os antigos
        const posicao = itens.findIndex(function (item) {
            return item.id === idEditando;
        });
        itens[posicao] = Object.assign(itens[posicao], dados);
    }

    salvarItens(itens);
    alert(idEditando === null ? 'Item cadastrado com sucesso!' : 'Item atualizado com sucesso!');
    window.location.href = 'meus-itens.html';
});
