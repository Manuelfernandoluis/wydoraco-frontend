const API_BASE_URL =
  "https://wydoraco-backend.onrender.com";

const chatMessages =
  document.getElementById("chatMessages");

const userInput =
  document.getElementById("userInput");

const sendButton =
  document.getElementById("sendButton");

const params =
  new URLSearchParams(window.location.search);

let empresa = params.get("empresa");

if (!empresa) {
  empresa = "wydoraco@gmail.com";
}

console.log("EMPRESA:", empresa);

/* =========================
   SCROLL AUTOMÁTICO
========================= */

function scrollToBottom() {
  chatMessages.scrollTop =
    chatMessages.scrollHeight;
}

function formatMessage(text) {

  return text

    // Negrito
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Quebra de linha
    .replace(/\n/g, "<br>");
}

/* =========================
   ADICIONAR MENSAGEM
========================= */

function addMessage(text, type) {

  const message =
    document.createElement("div");

  message.classList.add(
    type === "user"
      ? "user-message"
      : "bot-message"
  );

message.innerHTML = formatMessage(text);

  chatMessages.appendChild(message);

  scrollToBottom();
}

/* =========================
   LOADING
========================= */

function createLoading() {

  const loading =
    document.createElement("div");

  loading.classList.add("bot-message");

  loading.id = "loadingMessage";

  loading.innerHTML =
    "⌛ Assistente digitando...";

  chatMessages.appendChild(loading);

  scrollToBottom();
}

function removeLoading() {

  const loading =
    document.getElementById("loadingMessage");

  if (loading) {
    loading.remove();
  }
}

function createProductCard(nome, preco) {

  const card =
    document.createElement("div");

  card.classList.add("product-card");

  card.innerHTML = `
  
    <h3>${nome}</h3>

    <div class="product-price">
      ${preco} Kz
    </div>

    <div class="product-description">
      Produto disponível na Wydoraço.
    </div>

    <button>
      Comprar
    </button>
  `;

  chatMessages.appendChild(card);

  scrollToBottom();
}

/* =========================
   ENVIAR MENSAGEM
========================= */

async function sendMessage() {

  const pergunta =
    userInput.value.trim();

  if (!pergunta) return;

  addMessage(pergunta, "user");

  userInput.value = "";

  createLoading();

  try {

    const response = await fetch(
      `${API_BASE_URL}/ia`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

         body: JSON.stringify({
         pergunta,
         empresa
       })
      }
    );

    const data =
      await response.json();

    removeLoading();

    addMessage(
      data.resposta,
      "bot"
    );

  } catch (error) {

    console.log(error);

    removeLoading();

    addMessage(
      "❌ Erro ao comunicar com a IA.",
      "bot"
    );
  }

  if (
  data.resposta.includes("Arduino UNO")
) {

  createProductCard(
    "Arduino UNO",
    "11.000"
  );
}
}

/* =========================
   BOTÃO ENVIAR
========================= */

sendButton.addEventListener(
  "click",
  sendMessage
);

/* =========================
   ENTER
========================= */

userInput.addEventListener(
  "keypress",
  (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }
  }
);

/* =========================
   AUTOFOCUS
========================= */

window.addEventListener(
  "load",
  () => {
    userInput.focus();
  }
);