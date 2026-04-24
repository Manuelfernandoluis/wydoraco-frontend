const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

async function loadProdutos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

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
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd;">
          <span>${nome}</span>
          <span>${preco} Kz</span>
        </div>
      `;

      listaProdutos.appendChild(item);
    });

  } catch (error) {
    mensagem.innerText = "Erro ao carregar produtos.";
    mensagem.style.color = "red";
  }
}

document.addEventListener("DOMContentLoaded", loadProdutos);

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

  try {
    const response = await fetch(`${API_BASE_URL}/company/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        nome: produto,
        preco: Number(preco)
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