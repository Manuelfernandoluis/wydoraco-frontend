const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const listaConversas = document.getElementById("listaConversas");

async function loadConversas() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/logs/${email}`);
    const data = await response.json();

    listaConversas.innerHTML = "";

    if (!data || data.length === 0) {
      listaConversas.innerHTML = "<p>Nenhuma conversa encontrada.</p>";
      return;
    }

    data.forEach(log => {
      const item = document.createElement("div");
      item.className = "conversa-item";

      item.innerHTML = `
        <div style="padding:15px; border-bottom:1px solid #ddd;">
          <strong>Cliente:</strong> ${log.userMessage}<br>
          <strong>Bot:</strong> ${log.botResponse}<br>
          <small>${new Date(log.createdAt).toLocaleString()}</small>
        </div>
      `;

      listaConversas.appendChild(item);
    });

  } catch (error) {
    listaConversas.innerHTML = "<p>Erro ao carregar conversas.</p>";
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", loadConversas);