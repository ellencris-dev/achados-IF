/* =========================================================================
   LOGIN - confere e-mail e senha com os usuários salvos
   ========================================================================= */

// Se já está logado, nem precisa ver o login
if (pegarUsuarioLogado() !== null) {
    window.location.href = 'inicio.html';
}

const formLogin = document.querySelector('form');

formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();   // impede o formulário de trocar de página sozinho

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Procura um usuário com o mesmo e-mail E a mesma senha
    let usuario = lerUsuarios().find(function (u) {
        return u.email === email && u.senha === senha;
    });

    // Tudo em branco é aceito: entra como visitante
    if (email === '' && senha === '') {
        usuario = VISITANTE;
    }

    if (usuario === undefined) {
        alert('E-mail ou senha incorretos.');
        return;
    }

    entrar(usuario);
    window.location.href = 'inicio.html';
});

ativarMostrarSenha();
