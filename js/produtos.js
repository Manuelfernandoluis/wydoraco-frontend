const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

// Carregar produtos ao abrir página
document.addEventListener("DOMContentLoaded", async () => {
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
        const li = document.createElement("li");
        const trimmed = produto.trim();
        const parts = trimmed.split(" - ");
        if (parts.length === 2) {
          li.innerText = `${parts[0]} - ${parts[1]} Kz`;
        } else {
          li.innerText = trimmed;
        }
        listaProdutos.appendChild(li);
      });
    }

  } catch (error) {
    console.log("Erro ao carregar produtos:", error);
  }
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
      const li = document.createElement("li");
      const parts = produtoCompleto.split(" - ");
      if (parts.length === 2) {
        li.innerText = `${parts[0]} - ${parts[1]} Kz`;
      } else {
        li.innerText = produtoCompleto;
      }
      listaProdutos.appendChild(li);

      document.getElementById("produto").value = "";
      document.getElementById("preco").value = "";
    }

  } catch (error) {
    mensagem.innerText = "Erro ao salvar produto.";
    mensagem.style.color = "red";
  }
});