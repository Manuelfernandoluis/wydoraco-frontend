 const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formServico");
const listaServicos = document.getElementById("listaServicos");
const mensagem = document.getElementById("mensagem");

async function loadServicos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

    listaServicos.innerHTML = "";

    if (!data.servicos || data.servicos.length === 0) {
      listaServicos.innerHTML = "<p>Nenhum serviço cadastrado.</p>";
      return;
    }

    data.servicos.forEach(servico => {
      const nome = servico.nome || "Sem nome";
      const preco = servico.preco || 0;

      const item = document.createElement("div");
      item.className = "produto-item";

      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px;">
          <div>
            <strong>${nome}</strong><br>
            <small>${preco} Kz</small>
          </div>

          <div style="display:flex; gap:10px;">
            <button class="editar-btn">Editar</button>
            <button class="eliminar-btn">Eliminar</button>
          </div>
        </div>
      `;

      item.querySelector(".editar-btn").addEventListener("click", () => {
        editServico(nome, preco);
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

document.addEventListener("DOMContentLoaded", loadServicos);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const servico = document.getElementById("servico").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const email = localStorage.getItem("empresaEmail");

  if (!servico || !preco) {
    mensagem.innerText = "Preencha nome e preço.";
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
        nome: servico,
        preco: Number(preco)
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

async function editServico(nomeAntigo, precoAntigo) {
  const novoNome = prompt("Novo nome:", nomeAntigo);
  const novoPreco = prompt("Novo preço:", precoAntigo);

  if (!novoNome || !novoPreco) return;

  const email = localStorage.getItem("empresaEmail");

  await fetch(`${API_BASE_URL}/company/edit-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      servicoAntigo: nomeAntigo,
      servicoNovo: novoNome,
      precoNovo: novoPreco
    })
  });

  loadServicos();
}

async function deleteServico(nome) {
  const email = localStorage.getItem("empresaEmail");

  await fetch(`${API_BASE_URL}/company/remove-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      servico: nome
    })
  });

  loadServicos();
}