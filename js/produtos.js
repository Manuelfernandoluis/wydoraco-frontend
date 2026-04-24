const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

async function loadProdutos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

    console.log("Produtos recebidos:", data);

    listaProdutos.innerHTML = "";

    if (!data.produtos || data.produtos.length === 0) {
      listaProdutos.innerHTML = "<p>Nenhum produto cadastrado.</p>";
      return;
    }

    data.produtos.forEach(produto => {
      const nome = produto.nome || "Sem nome";
      const preco = produto.preco || 0;

      const item = document.createElement("div");
      item.className = "produto-item";

      item.innerHTML = `
        <div>
          <strong>${nome}</strong> - ${preco} Kz
        </div>
        <div>
          <button onclick="editProduto('${nome}')">Editar</button>
          <button onclick="deleteProduto('${nome}')">Eliminar</button>
        </div>
      `;

      listaProdutos.appendChild(item);
    });

  } catch (error) {
    console.log("Erro ao carregar produtos:", error);
    mensagem.innerText = "Erro ao carregar produtos.";
    mensagem.style.color = "red";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProdutos();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produto = document.getElementById("produto").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const email = localStorage.getItem("empresaEmail");

  if (!produto || !preco) {
    mensagem.innerText = "Preencha nome e preço.";
    mensagem.style.color = "red";
    return;
  }

  const produtoCompleto = `${produto} - ${preco}`;

  try {
    const response = await fetch(`${API_BASE_URL}/company/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        produto: produtoCompleto
      })
    });

    const data = await response.json();

    mensagem.innerText = data.message;
    mensagem.style.color = response.ok ? "green" : "red";

    if (response.ok) {
      form.reset();
      loadProdutos();
    }

  } catch (error) {
    mensagem.innerText = "Erro ao salvar produto.";
    mensagem.style.color = "red";
  }
});

async function editProduto(produtoAntigo) {
  const produtoNovo = prompt("Editar produto:", produtoAntigo);

  if (!produtoNovo) return;

  const email = localStorage.getItem("empresaEmail");

  try {
    await fetch(`${API_BASE_URL}/company/edit-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        produtoAntigo,
        produtoNovo
      })
    });

    loadProdutos();

  } catch (error) {
    mensagem.innerText = "Erro ao editar produto.";
    mensagem.style.color = "red";
  }
}

async function deleteProduto(produto) {
  if (!confirm("Eliminar este produto?")) return;

  const email = localStorage.getItem("empresaEmail");

  try {
    await fetch(`${API_BASE_URL}/company/remove-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        produto
      })
    });

    loadProdutos();

  } catch (error) {
    mensagem.innerText = "Erro ao eliminar produto.";
    mensagem.style.color = "red";
  }
}