const API_BASE_URL =
  "https://wydoraco-backend.onrender.com";

const email =
  localStorage.getItem("empresaEmail");

async function carregarEstatisticas() {

  try {

    const response = await fetch(
      `${API_BASE_URL}/estatisticas/${email}`
    );

    const data =
      await response.json();

    document.getElementById(
      "perguntas"
    ).innerText =
      data.perguntasRespondidas;

    document.getElementById(
      "plano"
    ).innerText =
      data.plano;

    document.getElementById(
      "produtos"
    ).innerText =
      data.produtos;

    document.getElementById(
      "servicos"
    ).innerText =
      data.servicos;

    document.getElementById(
      "ia"
    ).innerText =
      data.usandoIA
        ? "Sim"
        : "Não";

  } catch (error) {

    console.log(error);
  }
}

carregarEstatisticas();