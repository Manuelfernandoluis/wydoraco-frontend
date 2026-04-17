 const API_BASE_URL = "https://wydoraco-backend.onrender.com";

// Espera o HTML carregar completamente
document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e) => {
e.preventDefault();

 
const email = document.getElementById("email").value.trim();
const senha = document.getElementById("senha").value.trim();
const mensagem = document.getElementById("mensagem");

// Validação simples
if (!email || !senha) {
  mensagem.innerText = "Preencha todos os campos.";
  mensagem.classList.remove("sucesso");
  return;
}

try {
  const response = await fetch(`${API_BASE_URL}/company/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      senha: senha
    })
  });

  const data = await response.json();

  if (!response.ok) {
    mensagem.innerText = "Erro: " + data.message;
    mensagem.classList.remove("sucesso");
    return;
  }

  // Guardar dados
  localStorage.setItem("empresaEmail", data.email);
  localStorage.setItem("empresaNome", data.nome);

  mensagem.innerText = "Login realizado com sucesso!";
  mensagem.classList.add("sucesso");

  // Redirecionar
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);

} catch (err) {
  mensagem.innerText = "Erro de conexão ao servidor.";
  mensagem.classList.remove("sucesso");
}
 

});

});
