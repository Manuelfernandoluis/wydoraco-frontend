 const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

// Carregar produtos
async function loadProdutos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

    console.log("Produtos recebidos:", data);

    listaProdutos.innerHTML = "";

    if (data.produtos) {
      let produtosArray;

      if (Array.isArray(data.produtos)) {
        produtosArray = data.produtos;
      } else {
        produtosArray = data.produtos.split(",");
      }

      produtosArray.forEach(produto => {
        const trimmed = produto.trim();

        const li = document.createElement("li");
        li.innerHTML = `
          ${trimmed}
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        `;

        li.querySelector(".edit-btn").addEventListener("click", () => {
          editProduto(trimmed);
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
          deleteProduto(trimmed);
        });

        listaProdutos.appendChild(li);
      });
    }

  } catch (error) {
    console.log("Erro ao carregar produtos:", error);
    mensagem.innerText = "Erro ao carregar produtos.";
    mensagem.style.color = "red";
  }
}

// Abrir página
document.addEventListener("DOMContentLoaded", () => {
  loadProdutos();
});

// Adicionar produto
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
      await loadProdutos();
      form.reset();
    }

  } catch (error) {
    mensagem.innerText = "Erro ao salvar produto.";
    mensagem.style.color = "red";
  }
});

// Editar produto
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

    await loadProdutos();

  } catch (error) {
    mensagem.innerText = "Erro ao editar produto.";
    mensagem.style.color = "red";
  }
}

// Eliminar produto
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

    await loadProdutos();

  } catch (error) {
    mensagem.innerText = "Erro ao eliminar produto.";
    mensagem.style.color = "red";
  }
}