const API_BASE_URL = "https://wydoraco-backend.onrender.com";

const form = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

// Função para carregar produtos
async function loadProdutos() {
  const email = localStorage.getItem("empresaEmail");

  try {
    const response = await fetch(`${API_BASE_URL}/company/data/${email}`);
    const data = await response.json();

    console.log("Produtos recebidos:", data);

    listaProdutos.innerHTML = "";

    if (data.produtos) {
      let produtosArray;
      if (Array.isArray(data.produtos)) {
        produtosArray = data.produtos;
      } else {
        produtosArray = data.produtos.split(",");
      }

      produtosArray.forEach(produto => {
        const li = document.createElement("li");
        const trimmed = produto.trim();
        const parts = trimmed.split(" - ");
        let displayText = trimmed;
        if (parts.length === 2) {
          displayText = `${parts[0]} - ${parts[1]} Kz`;
        }
        li.innerHTML = `${displayText} <button class="edit-btn">Editar</button> <button class="delete-btn">Eliminar</button>`;
        
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editProduto(trimmed));
        deleteBtn.addEventListener('click', () => deleteProduto(trimmed));
        
        listaProdutos.appendChild(li);
      });
    }

  } catch (error) {
    console.log("Erro ao carregar produtos:", error);
  }
}

// Carregar produtos ao abrir página
document.addEventListener("DOMContentLoaded", () => {
  loadProdutos();
});

// Adicionar produto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Form submitted");

  const produto = document.getElementById("produto").value.trim();
  const precoStr = document.getElementById("preco").value.trim();
  const email = localStorage.getItem("empresaEmail");

  console.log("Values:", produto, precoStr, email);

  if (!produto || !precoStr) {
    mensagem.innerText = "Preencha nome e preço.";
    mensagem.style.color = "red";
    return;
  }

  const precoNum = parseFloat(precoStr.replace(',', '.'));
  if (isNaN(precoNum) || precoNum < 0) {
    mensagem.innerText = "Preço deve ser um número válido.";
    mensagem.style.color = "red";
    return;
  }

  const produtoCompleto = `${produto} - ${precoNum}`;

  try {
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

    console.log("Add response:", response.status, response.ok, data);

    mensagem.innerText = data.message || "Produto adicionado com sucesso.";
    mensagem.style.color = response.ok ? "green" : "red";

    if (response.ok) {
      // Recarregar a lista de produtos para garantir que está atualizada
      await loadProdutos();

      document.getElementById("produto").value = "";
      document.getElementById("preco").value = "";
    }

  } catch (error) {
    console.log("Erro ao salvar produto:", error);
    mensagem.innerText = "Erro ao salvar produto.";
    mensagem.style.color = "red";
  }
});

// Função para editar produto
function editProduto(produto) {
  const parts = produto.split(" - ");
  if (parts.length !== 2) return;
  
  const currentName = parts[0];
  const currentPrice = parts[1];
  
  const newName = prompt("Novo nome do produto:", currentName);
  const newPriceStr = prompt("Novo preço (Kz):", currentPrice);
  
  if (!newName || !newPriceStr) return;
  
  const newPrice = parseFloat(newPriceStr.replace(',', '.'));
  if (isNaN(newPrice) || newPrice < 0) {
    alert("Preço deve ser um número válido.");
    return;
  }
  
  const newProduto = `${newName} - ${newPrice}`;
  updateProduto(produto, newProduto);
}

// Função para atualizar produto
async function updateProduto(oldProduto, newProduto) {
  const email = localStorage.getItem("empresaEmail");
  
  try {
    const response = await fetch(`${API_BASE_URL}/company/update-product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        oldProduto,
        newProduto
      })
    });
    
    console.log("Update response status:", response.status);
    
    if (!response.ok && response.status === 404) {
      mensagem.innerText = "Função de edição ainda não implementada no backend.";
      mensagem.style.color = "orange";
      return;
    }
    
    const data = await response.json();
    
    if (response.ok) {
      await loadProdutos();
      mensagem.innerText = data.message || "Produto atualizado com sucesso.";
      mensagem.style.color = "green";
    } else {
      mensagem.innerText = data.message || "Erro ao atualizar produto.";
      mensagem.style.color = "red";
    }
  } catch (error) {
    console.log("Erro ao atualizar produto:", error);
    mensagem.innerText = "Erro ao atualizar produto. Verifique o console.";
    mensagem.style.color = "red";
  }
}

// Função para eliminar produto
async function deleteProduto(produto) {
  if (!confirm("Tem certeza que deseja eliminar este produto?")) return;
  
  const email = localStorage.getItem("empresaEmail");
  
  try {
    const response = await fetch(`${API_BASE_URL}/company/delete-product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        produto
      })
    });
    
    console.log("Delete response status:", response.status);
    
    if (!response.ok && response.status === 404) {
      mensagem.innerText = "Função de eliminação ainda não implementada no backend.";
      mensagem.style.color = "orange";
      return;
    }
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      mensagem.innerText = "Função de eliminação ainda não implementada no backend.";
      mensagem.style.color = "orange";
      return;
    }
    
    const data = await response.json();
    
    if (response.ok) {
      await loadProdutos();
      mensagem.innerText = data.message || "Produto eliminado com sucesso.";
      mensagem.style.color = "green";
    } else {
      mensagem.innerText = data.message || "Erro ao eliminar produto.";
      mensagem.style.color = "red";
    }
  } catch (error) {
    console.log("Erro ao eliminar produto:", error);
    mensagem.innerText = "Erro ao eliminar produto. Verifique o console.";
    mensagem.style.color = "red";
  }
}