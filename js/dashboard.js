 const API_BASE_URL = "https://wydoraco-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
const empresaNome = document.getElementById("empresaNome");
const totalProdutos = document.getElementById("totalProdutos");
const totalConversas = document.getElementById("totalConversas");
const totalMensagens = document.getElementById("totalMensagens");
const totalServicos = document.getElementById("totalServicos");
const logoutBtn = document.getElementById("logout");
const conteudoDinamico = document.getElementById("conteudoDinamico");

const menuDashboard = document.getElementById("menuDashboard");
const menuProdutos = document.getElementById("menuProdutos");
const menuServicos = document.getElementById("menuServicos");
const menuConversas = document.getElementById("menuConversas");
const menuEstatisticas = document.getElementById("menuEstatisticas");
const menuPlanos = document.getElementById("menuPlanos");

let secaoAtual = "dashboard";

function parseItensComPreco(texto) {
if (!texto) return [];
return texto.split(",").map(item => {
const original = item.trim();
if (!original) return null;

 
  let nome = original;
  let preco = null;

  const splitMatch = original.match(/^(.*?)\s*[-–—:]\s*(.+)$/);

  if (splitMatch) {
    nome = splitMatch[1].trim();
    preco = splitMatch[2].trim();
  }

  return {
    original,
    nome,
    preco
  };
}).filter(Boolean);
 

}

const nome = localStorage.getItem("empresaNome");

if (!nome) {
window.location.href = "login.html";
return;
}

empresaNome.innerText = `Bem-vindo(a), ${nome}!`;

logoutBtn.addEventListener("click", () => {
localStorage.removeItem("empresaNome");
localStorage.removeItem("empresaEmail");
window.location.href = "login.html";
});

function resetActiveMenu() {
[menuDashboard, menuProdutos, menuServicos, menuConversas, menuPlanos, menuEstatisticas]
.forEach(m => m.classList.remove("active"));
}

async function mostrarDashboard() {
secaoAtual = "dashboard";

 
resetActiveMenu();
menuDashboard.classList.add("active");

const email = localStorage.getItem("empresaEmail");

conteudoDinamico.innerHTML = `
  <h2>Resumo Rápido</h2>
  <p>A carregar dados...</p>
`;

try {
  const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
  const data = await response.json();

  const produtosDetalhados = parseItensComPreco(data.produtos);
  totalProdutos.innerText = produtosDetalhados.length;

  const listaServicos = data.servicos ? data.servicos.split(",") : [];
  totalServicos.innerText = listaServicos.length;

  const logsResponse = await fetch(`${API_BASE_URL}/logs/${email}`);
  const logs = await logsResponse.json();

  totalConversas.innerText = logs.length;
  totalMensagens.innerText = logs.length * 2;

  conteudoDinamico.innerHTML = `
    <h2>Resumo da Empresa</h2>
    <div class="resumo-box">
      <p><strong>Plano:</strong> ${data.plano || "Wydoraço Grátis"}</p>
      <p><strong>Perguntas Respondidas:</strong> ${data.perguntasRespondidas || 0}</p>
      <a href="bot.html" target="_blank" class="btnBot">Abrir Meu Bot</a>
    </div>
  `;

} catch (error) {
  conteudoDinamico.innerHTML = `
    <h2>Erro</h2>
    <p>Não foi possível carregar os dados.</p>
  `;
}
 

}

window.criarPagamento = async function(plano) {
const email = localStorage.getItem("empresaEmail");

 
await fetch(`${API_BASE_URL}/company/plan`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, plano })
});

alert(`Plano ${plano} solicitado com sucesso`);
mostrarDashboard();
 

};

window.escolherPlano = async function(plano) {
const email = localStorage.getItem("empresaEmail");

 
await fetch(`${API_BASE_URL}/company/plan`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, plano })
});

alert(`${plano} ativado com sucesso`);
mostrarDashboard();
 

};

menuDashboard.addEventListener("click", mostrarDashboard);

mostrarDashboard();
});
