document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("formRecuperar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem");

    if (!email) {
      mensagem.innerText = "Digite seu email.";
      mensagem.classList.remove("sucesso");
      return;
    }

    mensagem.innerText = "Funcionalidade de recuperação de palavra-passe ainda em desenvolvimento no backend.";
    mensagem.classList.remove("sucesso");
    mensagem.style.color = "orange";
    return;

    mensagem.innerText = "Email de recuperação enviado! Verifique sua caixa de entrada.";
    mensagem.classList.add("sucesso");
  });

});
