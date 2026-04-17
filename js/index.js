const API_BASE_URL = 'https://wydoraco-backend.onrender.com';
const DEFAULT_COMPANY_SLUG = 'shadow';
let companySlug = window.WYDORACO_COMPANY || DEFAULT_COMPANY_SLUG;
let botConfig = null;

// Obter ou gerar Session ID
let sessionId = localStorage.getItem(`wydoraco_session_${companySlug}`);

if (!sessionId) {
sessionId = crypto.randomUUID();
localStorage.setItem(`wydoraco_session_${companySlug}`, sessionId);
}

// Carregar configurações da empresa ao arrancar
window.onload = async function() {

// Google Analytics Tracking
if (typeof gtag === 'function') {
gtag('event', 'bot_aberto', {
event_category: 'WydoracoBot',
event_label: 'Bot aberto pelo usuário'
});
}

// Enter no input
const inputMsg = document.getElementById("inputMensagem");

if (inputMsg) {
inputMsg.addEventListener("keypress", function(event) {
if (event.key === "Enter") {
enviarMensagem();
}
});
}

try {
const res = await fetch(`${API_BASE_URL}/bot/${companySlug}/config`);

 
if (res.ok) {
  botConfig = await res.json();

  document.getElementById('chatHeader').innerText =
    `🤖 ${botConfig.botName || 'WydoraçoBot'}`;

  adicionarMensagem(
    `👋 Olá! Sou o assistente da ${botConfig.companyName || 'empresa'}. Como posso ajudar?`,
    "bot"
  );

} else {
  console.error('Empresa não encontrada');
  adicionarMensagem("❌ Não foi possível carregar as configurações do bot.", "bot");
}
 

} catch (error) {
console.error("Erro ao carregar configurações do bot", error);
adicionarMensagem("❌ Erro de conexão com o servidor.", "bot");
}
};

async function enviarMensagem() {
const input = document.getElementById("inputMensagem");
let texto = input.value.trim();

if (texto === "") return;

if (!botConfig) {
adicionarMensagem("⚠️ O bot não está configurado. Verifique o Painel de Administração.", "bot");
input.value = "";
return;
}

if (typeof gtag === 'function') {
gtag('event', 'mensagem_enviada', {
event_category: 'WydoracoBot',
event_label: 'Usuário enviou mensagem'
});
}

adicionarMensagem(texto, "usuario");
input.value = "";

await processMessage(texto);
}

async function acaoRapida(texto) {
if (!botConfig) {
adicionarMensagem("⚠️ O bot não está configurado. Verifique o Painel de Administração.", "bot");
return;
}

adicionarMensagem(texto, "usuario");
await processMessage(texto);
}

async function processMessage(texto) {
const digitando = mostrarDigitando();

try {
const res = await fetch(`${API_BASE_URL}/bot/${companySlug}/chat`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
sessionId: sessionId,
message: texto
})
});

 
digitando.remove();

if (res.ok) {
  const data = await res.json();

  const botResponse =
    typeof data === 'string'
      ? data
      : (data.response || data.message || "Não entendi.");

  adicionarMensagem(botResponse, "bot");

} else {
  console.error("Erro na resposta do bot:", res.status);
  adicionarMensagem("⚠️ Ocorreu um erro ao processar a tua mensagem. Tenta novamente.", "bot");
}
 

} catch (error) {
digitando.remove();
console.error("Erro de conexão ao enviar mensagem:", error);
adicionarMensagem("⚠️ Falha na conexão com o servidor.", "bot");
}
}

function adicionarMensagem(texto, remetente) {
const chatInfo = document.getElementById("chat");
const divMensagem = document.createElement("div");

const formattedText = texto.replace(/\n/g, '<br>');

divMensagem.className = `mensagem ${remetente}`;
divMensagem.innerHTML = formattedText;

chatInfo.appendChild(divMensagem);
chatInfo.scrollTop = chatInfo.scrollHeight;
}

function mostrarDigitando() {
const chatInfo = document.getElementById("chat");
const digitandoDiv = document.createElement("div");

digitandoDiv.className = "mensagem bot digitando";
digitandoDiv.innerText = "A escrever...";
digitandoDiv.id = "digitandoIndicator";

chatInfo.appendChild(digitandoDiv);
chatInfo.scrollTop = chatInfo.scrollHeight;

return digitandoDiv;
}
