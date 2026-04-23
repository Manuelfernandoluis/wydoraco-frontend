const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

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
    li.innerText = produtoCompleto;
    listaProdutos.appendChild(li);

    document.getElementById("produto").value = "";
    document.getElementById("preco").value = "";
  }
});