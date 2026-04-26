const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const listaConversas = document.getElementById("listaConversas");

async function loadConversas() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/logs/${email}`);
    const logs = await response.json();

    listaConversas.innerHTML = "";

    if (!logs.length) {
      listaConversas.innerHTML = "<p>Nenhuma conversa encontrada.</p>";
      return;
    }

    logs.forEach(log => {
      const item = document.createElement("div");
      item.className = "conversa-item";

      item.innerHTML = `
        <div class="cliente">Cliente: ${log.pergunta}</div>
        <div class="bot">Bot: ${log.resposta}</div>
      `;

      listaConversas.appendChild(item);
    });

  } catch (error) {
    listaConversas.innerHTML = "<p>Erro ao carregar conversas.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadConversas);