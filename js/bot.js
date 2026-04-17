 
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
    const response = await fetch(`http://localhost:3000/company/data/${email}`);
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

    if (!pergunta) return;

    adicionarMensagem("user", pergunta);

    responderBot(pergunta);

    userInput.value = "";
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

//Para facilitar a leitura dos dados gerados pela IA e não estiver tudo junto
msg.innerHTML = texto.replace(/\n/g, "<br>","<br>");
 


  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

//A função que vai colocar a IA  a pensar
function mostrarDigitando() {
  const typing = document.createElement("div");
  typing.classList.add("mensagem", "bot");
  typing.id = "typing";
  typing.innerText = "...";

  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}


//A função que vai remover os três dígitos
function removerDigitando() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}
 

 
 
console.log(dadosEmpresa);
 

 


  // Respostas básicas
  
function responderBot(pergunta) {
 
mostrarDigitando();

console.log("🤖 BOT: Fazendo pergunta:", pergunta);
console.log("🤖 BOT: Email da empresa:", dadosEmpresa.email);
 
fetch("http://localhost:3000/ia", {
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
 
 // Verificar se atingiu limite
 if (data.limite) {
   adicionarMensagem("bot", data.resposta);
 } else {
   adicionarMensagem("bot", data.resposta);
 }
 
  salvarConversa(pergunta, data.resposta);
});
return;
 


  const texto = pergunta.toLowerCase();

  const produtosVenda = dadosEmpresa.produtos ? dadosEmpresa.produtos.toLowerCase() : "";
  const servicosVenda = dadosEmpresa.servicos ? dadosEmpresa.servicos.toLowerCase() : "";
  const produtosBot = dadosEmpresa.produtosBot ? dadosEmpresa.produtosBot.toLowerCase() : produtosVenda;
  const servicosBot = dadosEmpresa.servicosBot ? dadosEmpresa.servicosBot.toLowerCase() : servicosVenda;
  const extra = dadosEmpresa.extra ? dadosEmpresa.extra.toLowerCase() : "";

  // Procurar diretamente nos produtos de venda
  if (produtosVenda.includes(texto)) {
    const resposta = `Sim, temos ${pergunta}`;
    adicionarMensagem("bot", resposta);
    salvarConversa(pergunta, resposta);
    return;
  }

  // Procurar diretamente nos serviços de venda
  if (servicosVenda.includes(texto)) {
    const resposta = `Sim, prestamos ${pergunta}`;
    adicionarMensagem("bot", resposta);
    salvarConversa(pergunta, resposta);
    return;
  }

  // Produtos gerais
  if (
    texto.includes("produto") ||
    texto.includes("vendem") ||
    texto.includes("tem")
  ) {
    const resposta = `Temos: ${dadosEmpresa.produtos || dadosEmpresa.produtosBot || "não informado"}`;
    adicionarMensagem("bot", resposta);
    salvarConversa(pergunta, resposta);
    return;
  }

  // Serviços gerais
  if (
    texto.includes("serviço") ||
    texto.includes("fazem")
  ) {
    const resposta = `Prestamos: ${dadosEmpresa.servicos || dadosEmpresa.servicosBot || "não informado"}`;
    adicionarMensagem("bot", resposta);
    salvarConversa(pergunta, resposta);
    return;
  }

  // Extra
  if (
    texto.includes("promoção") ||
    texto.includes("oferta") ||
    texto.includes("horário")
  ) {
    const resposta = dadosEmpresa.extra;
    adicionarMensagem("bot", resposta);
    salvarConversa(pergunta, resposta);
    return;
  }

  const resposta = "Posso ajudar com produtos, serviços, promoções ou informações da empresa.";
  adicionarMensagem("bot", resposta);
  salvarConversa(pergunta, resposta);
}
 

 

//Aqui temos a função que irá salvar as conversas, versão melhora ✅, se o backend cair o bot não vai parar de funcionar e apenas o erro vai aparecer no console
async function salvarConversa(pergunta, resposta) {
  try {
    await fetch("http://localhost:3000/log", {
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
 
