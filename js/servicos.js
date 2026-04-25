const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formServico");
const listaServicos = document.getElementById("listaServicos");
const mensagem = document.getElementById("mensagem");

// =========================
// Carregar serviços
// =========================
async function loadServicos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

    listaServicos.innerHTML = "";

    if (!data.servicos || data.servicos.trim() === "") {
      listaServicos.innerHTML = "<p>Nenhum serviço cadastrado.</p>";
      return;
    }

    const servicos = data.servicos.split(",");

    servicos.forEach(servico => {
      const nome = servico.trim();

      const item = document.createElement("div");
      item.className = "produto-item";

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #ddd;">
          <div>
            <strong>${nome}</strong>
          </div>

          <div style="display:flex; gap:10px;">
            <button class="editar-btn">Editar</button>
            <button class="eliminar-btn">Eliminar</button>
          </div>
        </div>
      `;

      item.querySelector(".editar-btn").addEventListener("click", () => {
        editServico(nome);
      });

      item.querySelector(".eliminar-btn").addEventListener("click", () => {
        deleteServico(nome);
      });

      listaServicos.appendChild(item);
    });

  } catch (error) {
    mensagem.innerText = "Erro ao carregar serviços.";
    mensagem.style.color = "red";
  }
}

// =========================
// Inicializar página
// =========================
document.addEventListener("DOMContentLoaded", loadServicos);

// =========================
// Adicionar serviço
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const servico = document.getElementById("servico").value.trim();
  const email = localStorage.getItem("empresaEmail");

  if (!servico) {
    mensagem.innerText = "Preencha o serviço.";
    mensagem.style.color = "red";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/company/add-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        servico
      })
    });

    const data = await response.json();

    mensagem.innerText = data.message;
    mensagem.style.color = response.ok ? "green" : "red";

    if (response.ok) {
      form.reset();
      loadServicos();
    }

  } catch (error) {
    mensagem.innerText = "Erro ao salvar serviço.";
    mensagem.style.color = "red";
  }
});

// =========================
// Editar serviço
// =========================
async function editServico(servicoAntigo) {
  const novoServico = prompt("Novo serviço:", servicoAntigo);

  if (!novoServico) return;

  const email = localStorage.getItem("empresaEmail");

  try {
    await fetch(`${API_BASE_URL}/company/edit-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        servicoAntigo,
        servicoNovo: novoServico
      })
    });

    loadServicos();

  } catch (error) {
    mensagem.innerText = "Erro ao editar serviço.";
    mensagem.style.color = "red";
  }
}

// =========================
// Eliminar serviço
// =========================
async function deleteServico(servico) {
  if (!confirm("Eliminar este serviço?")) return;

  const email = localStorage.getItem("empresaEmail");

  try {
    await fetch(`${API_BASE_URL}/company/remove-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        servico
      })
    });

    loadServicos();

  } catch (error) {
    mensagem.innerText = "Erro ao eliminar serviço.";
    mensagem.style.color = "red";
  }
}