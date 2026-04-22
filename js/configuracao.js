const API_BASE_URL = "https://wydoraco-backend.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const email = localStorage.getItem("empresaEmail");

  // Se não tiver email, redireciona para login
  if (!email) {
    alert("Por favor, faça login primeiro.");
    window.location.href = "index.html";
    return;
  }

  console.log("📧 Email recuperado:", email);

  // Carregar dados atuais
  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados");
    }

    const dados = await response.json();

    console.log("📊 Dados carregados:", dados);

    document.getElementById("nome").value = dados.nome || "";
    document.getElementById("produtos").value = dados.produtosBot || dados.produtos || "";
    document.getElementById("servicos").value = dados.servicosBot || dados.servicos || "";
    document.getElementById("extra").value = dados.extra || "";

  } catch (error) {
    console.log("❌ Erro ao carregar dados:", error);
    alert("Erro ao carregar dados da empresa.");
  }
});

// Salvar configuração
document.getElementById("formConfig").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const produtos = document.getElementById("produtos").value.trim();
  const servicos = document.getElementById("servicos").value.trim();
  const extra = document.getElementById("extra").value.trim();
  const mensagem = document.getElementById("mensagem");

  const email = localStorage.getItem("empresaEmail");

  // Validar email
  if (!email) {
    mensagem.innerText = "Erro: Email da empresa não encontrado. Faça login novamente.";
    mensagem.style.color = "red";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

    return;
  }

  // Validar nome
  if (!nome) {
    mensagem.innerText = "O nome da empresa é obrigatório.";
    mensagem.style.color = "red";
    return;
  }

  // Validar produtos ou serviços
  if (!produtos && !servicos) {
    mensagem.innerText = "Preencha pelo menos produtos ou serviços.";
    mensagem.style.color = "red";
    return;
  }

  try {
    console.log("📤 Enviando dados:", {
      email,
      nome,
      produtosBot: produtos,
      servicosBot: servicos,
      extra
    });

    const response = await fetch(`${API_BASE_URL}/company/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        nome,
        produtosBot: produtos,
        servicosBot: servicos,
        extra
      })
    });

    const data = await response.json();

    console.log("✅ Resposta do servidor:", data);

    if (!response.ok) {
      mensagem.innerText = data.message || "Erro ao salvar configuração.";
      mensagem.style.color = "red";
      return;
    }

    mensagem.innerText = "Configuração salva com sucesso!";
    mensagem.style.color = "green";

    localStorage.setItem("empresaNome", nome);

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } catch (error) {
    console.log("❌ Erro ao conectar ao servidor:", error);
    mensagem.innerText = "Erro ao conectar ao servidor.";
    mensagem.style.color = "red";
  }
});