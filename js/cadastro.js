// API de Produção
const API_BASE_URL = 'https://wydoraco-backend.onrender.com';

// Função para cadastrar empresa
async function cadastrarEmpresa(nome, email, senha) {
try {
const randomStr = Math.random().toString(36).substring(2, 6);
const slug = nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + randomStr;

 
const response = await fetch(`${API_BASE_URL}/company/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },

  body: JSON.stringify({
    nome: nome,
    email: email,
    senha: senha,
    slug: slug
  })
});

const data = await response.json();

if (!response.ok) {
  let errorMsg = data.message;
  if (Array.isArray(errorMsg)) errorMsg = errorMsg[0];

  document.getElementById("mensagem").innerText = "Erro no cadastro: " + errorMsg;
  document.getElementById("mensagem").classList.remove("sucesso");
  return false;
}

localStorage.setItem("empresaEmail", email);
localStorage.setItem("empresaNome", nome);

document.getElementById("mensagem").innerText = "Empresa cadastrada com sucesso!";
document.getElementById("mensagem").classList.add("sucesso");

setTimeout(() => {
  window.location.href = "configuracao.html";
}, 1000);

return true;
 

} catch (err) {
console.error("Erro inesperado no cadastro:", err);
document.getElementById("mensagem").innerText = "Ocorreu um erro ao conectar ao servidor.";
document.getElementById("mensagem").classList.remove("sucesso");
return false;
}
}

// Conectar a função ao formulário
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
e.preventDefault();

const botao = document.querySelector("button");
botao.disabled = true;

const nome = document.getElementById("nome").value;
const email = document.getElementById("email").value;
const senha = document.getElementById("senha").value;

const erro = validarCadastro(nome, email, senha);

if (erro) {
const mensagem = document.getElementById("mensagem");
mensagem.innerText = erro;
mensagem.classList.remove("sucesso");
botao.disabled = false;
return;
}

const sucesso = await cadastrarEmpresa(nome, email, senha);

if (!sucesso) {
botao.disabled = false;
}
});

// Função de validação
function validarCadastro(nome, email, senha) {
if (!nome || nome.length < 3) {
return "O nome da empresa deve ter pelo menos 3 caracteres.";
}

const regexEmail = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

if (!regexEmail.test(email)) {
return "Digite um email válido.";
}

if (!senha || senha.length < 6) {
return "A senha deve ter pelo menos 6 caracteres.";
}

return null;
}
