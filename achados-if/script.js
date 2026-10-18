/* Interações do protótipo. Não faz requisições nem salva credenciais. */
'use strict';

const form = document.querySelector('#cadastro-form');
const feedback = document.querySelector('#form-feedback');
const toast = document.querySelector('#demo-toast');
const fields = {
  nome: document.querySelector('#nome'),
  matricula: document.querySelector('#matricula'),
  email: document.querySelector('#email'),
  senha: document.querySelector('#senha'),
  confirmar: document.querySelector('#confirmar'),
  consentimento: document.querySelector('#consentimento')
};
let attemptedSubmit = false;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5200);
}

// Validação básica da interface. O servidor DEVE repetir as validações.
function errorFor(name) {
  const field = fields[name];
  const value = field.type === 'checkbox' ? '' : field.value.trim();
  switch (name) {
    case 'nome':
      if (!value) return 'Informe seu nome completo.';
      if (value.length < 3) return 'Informe pelo menos 3 caracteres.';
      return '';
    case 'matricula':
      return value ? '' : 'Informe sua matrícula institucional.';
    case 'email':
      if (!value) return 'Informe seu e-mail institucional.';
      if (!field.validity.valid) return 'Digite um e-mail válido.';
      return '';
    case 'senha':
      if (!field.value) return 'Crie uma senha.';
      if (field.value.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
      return '';
    case 'confirmar':
      if (!field.value) return 'Confirme sua senha.';
      if (field.value !== fields.senha.value) return 'As senhas não coincidem.';
      return '';
    case 'consentimento':
      return field.checked ? '' : 'É necessário aceitar os termos para continuar.';
    default:
      return '';
  }
}

function validate(name) {
  const field = fields[name];
  const error = errorFor(name);
  const errorElement = document.querySelector(`#${name}-erro`);
  errorElement.textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
  return !error;
}

Object.entries(fields).forEach(([name, field]) => {
  field.addEventListener(field.type === 'checkbox' ? 'change' : 'input', () => {
    feedback.hidden = true;
    if (attemptedSubmit) {
      validate(name);
      if (name === 'senha') validate('confirmar');
    }
  });
});

// Os botões de olho alternam apenas a visualização, sem armazenar a senha.
document.querySelectorAll('[data-password]').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.password);
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(showing));
    button.setAttribute('aria-label', showing ? 'Ocultar senha' : 'Mostrar senha');
    button.querySelector('use').setAttribute('href', showing ? '#i-eye-off' : '#i-eye');
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();  // Impede envio: ainda não existe API conectada.
  attemptedSubmit = true;
  feedback.hidden = true;
  const firstInvalid = Object.keys(fields).find(name => !validate(name));
  // Exibe os demais erros, além do primeiro.
  Object.keys(fields).forEach(validate);
  if (firstInvalid) {
    fields[firstInvalid].focus();
    return;
  }
  feedback.textContent = 'Formulário validado! Esta é uma demonstração: nenhuma conta foi criada e nenhum dado foi enviado. Para cadastrar usuários, conecte uma API segura.';
  feedback.hidden = false;
  feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Links ainda não conectados mostram claramente que se trata de um protótipo.
document.querySelectorAll('[data-demo-action]').forEach(button => {
  button.addEventListener('click', () => showToast(`“${button.dataset.demoAction}” é uma navegação demonstrativa. Configure o endereço real ao integrar o projeto.`));
});

const dialog = document.querySelector('#doc-dialog');
document.querySelectorAll('[data-document]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#dialog-heading').textContent = button.dataset.document === 'termos' ? 'Termos de Uso' : 'Política de Privacidade';
    dialog.showModal();
  });
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#ok-dialog').addEventListener('click', () => dialog.close());
