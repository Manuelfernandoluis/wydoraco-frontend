 document.addEventListener("DOMContentLoaded", async () => {
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const botTitulo = document.getElementById("botTitulo");

// Email fixo temporário
const email = localStorage.getItem("empresaEmail");

console.log("🤖 BOT: Email do localStorage:", email);

let dadosEmpresa = {};

// Buscar dados da empresa
try {
const response = await fetch(`https://wydoraco-backend.onrender.com/company/data/${email}`);
dadosEmpresa = await response.json();

 
console.log("🤖 BOT: Dados da empresa carregados:", dadosEmpresa);

botTitulo.innerText = `Assistente da ${dadosEmpresa.nome || "Empresa"}`;

adicionarMensagem("bot", "Olá! Como posso ajudar?");
 

} catch (error) {
console.log("🤖 BOT: Erro ao carregar dados da empresa:", error);
adicionarMensagem("bot", "Erro ao carregar dados da empresa.");
}

// Enviar pergunta
sendBtn.addEventListener("click", () => {
const pergunta = userInput.value.trim();

```
if (!pergunta) return;

adicionarMensagem("user", pergunta);

responderBot(pergunta);

userInput.value = "";
```

});

userInput.addEventListener("keypress", (e) => {
if (e.key === "Enter") {
sendBtn.click();
}
});

// Adicionar mensagem
function adicionarMensagem(tipo, texto) {
const msg = document.createElement("div");
msg.classList.add("mensagem", tipo);

```
msg.innerHTML = texto.replace(/\n/g, "<br>");

chatBox.appendChild(msg);
chatBox.scrollTop = chatBox.scrollHeight;
```

}

// Mostrar digitando
function mostrarDigitando() {
const typing = document.createElement("div");
typing.classList.add("mensagem", "bot");
typing.id = "typing";
typing.innerText = "...";

```
chatBox.appendChild(typing);
chatBox.scrollTop = chatBox.scrollHeight;
```

}

// Remover digitando
function removerDigitando() {
const typing = document.getElementById("typing");
if (typing) typing.remove();
}

console.log(dadosEmpresa);

// Respostas IA
function responderBot(pergunta) {
mostrarDigitando();

```
console.log("🤖 BOT: Fazendo pergunta:", pergunta);
console.log("🤖 BOT: Email da empresa:", dadosEmpresa.email);

fetch("https://wydoraco-backend.onrender.com/ia", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    pergunta,
    nome: dadosEmpresa.nome,
    produtosBot: dadosEmpresa.produtosBot || dadosEmpresa.produtos,
    servicosBot: dadosEmpresa.servicosBot || dadosEmpresa.servicos,
    extra: dadosEmpresa.extra,
    email: dadosEmpresa.email
  })
})
  .then(res => res.json())
  .then(data => {
    removerDigitando();

    console.log("🤖 BOT: Resposta recebida:", data);
    console.log("🤖 BOT: Limite?", data.limite);
    console.log("🤖 BOT: Perguntas usadas:", data.perguntasUsadas);

    adicionarMensagem("bot", data.resposta);

    salvarConversa(pergunta, data.resposta);
  });
```

}

// Salvar conversa
async function salvarConversa(pergunta, resposta) {
try {
await fetch("https://wydoraco-backend.onrender.com/log", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
sessionId: localStorage.getItem("empresaEmail"),
userMessage: pergunta,
botResponse: resposta
})
});
} catch (error) {
console.error("Erro ao salvar conversa:", error);
}
}
});
