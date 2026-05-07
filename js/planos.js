const API_BASE_URL = "https://wydoraco-backend.onrender.com";

async function escolherPlano(plano) {

  const email = localStorage.getItem("empresaEmail");

  if (!email) {
    alert("Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

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
      alert(data.message || "Erro ao ativar plano");
      return;
    }

    alert(`Plano ${plano} ativado com sucesso!`);

    window.location.href = "dashboard.html";

  } catch (error) {

    console.log(error);

    alert("Erro ao conectar com servidor.");
  }
}