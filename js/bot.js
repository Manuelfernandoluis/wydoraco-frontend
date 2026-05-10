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

 message.textContent = text;

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