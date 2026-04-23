const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produto = document.getElementById("produto").value.trim();
  const email = localStorage.getItem("empresaEmail");

  if (!produto) {
    mensagem.innerText = "Digite um produto.";
    return;
  }

  const response = await fetch(`${API_BASE_URL}/company/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      produto
    })
  });

  const data = await response.json();

  mensagem.innerText = data.message;

  if (response.ok) {
    const li = document.createElement("li");
    li.innerText = produto;
    listaProdutos.appendChild(li);
    document.getElementById("produto").value = "";
  }
});