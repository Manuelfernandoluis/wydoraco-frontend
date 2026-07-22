const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const email = localStorage.getItem("empresaEmail");

async function carregarPlanoAtual() {

  try {

    const response = await fetch(
      `${API_BASE_URL}/company/data/${email}`
    );

    const data = await response.json();

    const botoes = document.querySelectorAll(".plano-card button");

    botoes.forEach(btn => {

    const planoBotao = btn.dataset.plano;

    // Plano ativo
    if (planoBotao === data.plano) {

        btn.innerText = "Plano Atual";
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
    }

    // Plano solicitado
    else if (
        planoBotao === data.planoSolicitado &&
        data.paymentStatus === "pending"
    ) {

        btn.innerText = "Aguardando Pagamento";
        btn.disabled = true;
        btn.style.background = "#f39c12";
        btn.style.cursor = "not-allowed";
    }

});

  } catch (error) {
    console.log(error);
  }
}

async function escolherPlano(plano) {

  try {

    const response = await fetch(`${API_BASE_URL}/company/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        plano
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("planoAtual", plano);

    alert(`Plano ${plano} ativado com sucesso!`);

    window.location.reload();

  } catch (error) {

    console.log(error);

    alert("Erro ao conectar ao servidor.");
  }
}

carregarPlanoAtual();