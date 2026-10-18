/* =========================================================================
   CRIAR CONTA - valida os campos, salva o novo usuário e já faz o login
   ========================================================================= */

const formCadastro = document.querySelector('form');

formCadastro.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // 1. Pega os valores digitados (nome em branco vira "Visitante")
    const nome = document.getElementById('nome').value.trim() || 'Visitante';
    const matricula = document.getElementById('matricula').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmar-senha').value;
    const aceitouTermos = document.getElementById('termos').checked;

    // 2. Valida um por um. No primeiro erro, avisa e para (return).
    //    Campos em branco são aceitos: só validamos o que foi preenchido.
    if (email !== '' && !email.includes('@if')) {
        alert('Use seu e-mail institucional (@if...).');
        return;
    }

    if (senha !== '' && senha.length < 8) {
        alert('A senha precisa ter no mínimo 8 dígitos.');
        return;
    }

    if (senha !== confirmar) {
        alert('As senhas não são iguais.');
        return;
    }

    if (!aceitouTermos) {
        alert('Você precisa aceitar os Termos de Uso.');
        return;
    }

    const usuarios = lerUsuarios();

    // .some() responde true se ALGUM usuário já tiver esse e-mail
    const emailJaExiste = usuarios.some(function (u) {
        return u.email === email;
    });

    // E-mail em branco pode repetir (várias contas sem e-mail)
    if (email !== '' && emailJaExiste) {
        alert('Já existe uma conta com esse e-mail.');
        return;
    }

    // 3. Tudo certo: salva e entra
    const novoUsuario = { nome: nome, matricula: matricula, email: email, senha: senha };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    entrar(novoUsuario);
    alert('Conta criada com sucesso!');
    window.location.href = 'inicio.html';
});

ativarMostrarSenha();
