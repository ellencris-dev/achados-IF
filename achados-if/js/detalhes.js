/* =========================================================================
   DETALHES - lê o id do endereço (detalhes.html?id=3) e preenche a página
   ========================================================================= */

exigirLogin();

const item = buscarItem(pegarIdDaUrl());

// Endereço sem id, ou id que não existe: volta para a lista
if (item === undefined) {
    alert('Item não encontrado.');
    window.location.href = 'inicio.html';
} else {
    preencherPagina(item);
}


function preencherPagina(item) {
    const foto = item.foto || FOTO_PADRAO;

    document.title = item.titulo + ' - Achados IF';
    document.getElementById('detalhe-foto').src = foto;
    document.getElementById('detalhe-miniatura').src = foto;
    document.getElementById('detalhe-registro').textContent = 'ID Registro: #IF-' + item.id;

    document.getElementById('detalhe-situacao').innerHTML = etiquetaSituacao(item);
    document.getElementById('detalhe-categoria').textContent = item.categoria;
    document.getElementById('detalhe-estado').textContent = item.devolvido ? 'Devolvido' : 'Aguardando dono';

    document.getElementById('detalhe-titulo').textContent = item.titulo;
    document.getElementById('detalhe-descricao').textContent = item.descricao;
    document.getElementById('detalhe-categoria-caixa').textContent = item.categoria;
    document.getElementById('detalhe-local').textContent = item.local;
    document.getElementById('detalhe-data').textContent = formatarData(item.data);
    document.getElementById('detalhe-dono').textContent = item.nomeDono;

    // "Entrar em contato" abre o programa de e-mail já com o destinatário
    document.getElementById('botao-contato').href = 'mailto:' + item.dono + '?subject=Achados IF - ' + item.titulo;

    // O texto do segundo botão depende da situação do item
    const botaoReivindicar = document.getElementById('botao-reivindicar');
    if (item.situacao === 'perdido') {
        botaoReivindicar.innerHTML = '<span class="icone">front_hand</span> Encontrei este item';
    }

    botaoReivindicar.addEventListener('click', function (evento) {
        evento.preventDefault();
        alert('Pedido registrado! Compareça à Central de Achados e Perdidos (Bloco Central, Sala 104) com um documento com foto.');
    });
}
