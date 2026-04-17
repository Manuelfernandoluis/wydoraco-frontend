 document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("formRedefinir");

form.addEventListener("submit", async (e) => {
e.preventDefault();

```
const senha = document.getElementById("senha").value.trim();
const mensagem = document.getElementById("mensagem");

if (!senha || senha.length < 6) {
  mensagem.innerText = "A senha deve ter pelo menos 6 caracteres.";
  mensagem.classList.remove("sucesso");
  return;
}

mensagem.innerText = "Funcionalidade de redefinição de palavra-passe ainda em desenvolvimento no backend.";
mensagem.classList.remove("sucesso");
mensagem.style.color = "orange";
return;

mensagem.innerText = "Senha atualizada com sucesso!";
mensagem.classList.add("sucesso");

setTimeout(() => {
  window.location.href = "login.html";
}, 1500);
```

});

});
