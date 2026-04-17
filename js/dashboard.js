 
document.addEventListener("DOMContentLoaded", () => {
  const empresaNome = document.getElementById("empresaNome");
  const totalProdutos = document.getElementById("totalProdutos");
  const totalConversas = document.getElementById("totalConversas");
  const totalMensagens = document.getElementById("totalMensagens");
  const totalServicos = document.getElementById("totalServicos");
  const logoutBtn = document.getElementById("logout");
  const conteudoDinamico = document.getElementById("conteudoDinamico");

  const menuDashboard = document.getElementById("menuDashboard");
  const menuProdutos = document.getElementById("menuProdutos"); // Referência de produtos
  const menuServicos = document.getElementById("menuServicos"); // Referência de menu
  const menuConversas = document.getElementById("menuConversas");
  const menuEstatisticas = document.getElementById("menuEstatisticas");
  const menuPlanos = document.getElementById("menuPlanos");  // Referência dos planos da wydoraço
 

 
  let secaoAtual = "dashboard";

  function parseItensComPreco(texto) {
    if (!texto) return [];

    return texto.split(",").map(item => {
      const original = item.trim();
      if (!original) return null;

      let nome = original;
      let preco = null;

      const splitMatch = original.match(/^(.*?)\s*[-–—:]\s*(.+)$/);
      if (splitMatch) {
        nome = splitMatch[1].trim();
        preco = splitMatch[2].trim();
      } else {
        const trailingPreco = original.match(/^(.*?)\s+(\d[\d\.,]*\s*(?:kz|akz)?|\d+(?:[\.,]\d{2})?)$/i);
        if (trailingPreco) {
          nome = trailingPreco[1].trim();
          preco = trailingPreco[2].trim();
        }
      }

      return {
        original,
        nome: nome || original,
        preco: preco || null
      };
    }).filter(Boolean);
  }


  // Nome empresa
  const nome = localStorage.getItem("empresaNome");

  if (!nome) {
    window.location.href = "login.html";
    return;
  }

  empresaNome.innerText = `Bem-vindo(a), ${nome}!`;

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("empresaNome");
    localStorage.removeItem("empresaEmail");
    window.location.href = "login.html";
  });

  const btnConfigurarBot = document.getElementById("btnConfigurarBot");
  if (btnConfigurarBot) {
    btnConfigurarBot.addEventListener("click", () => {
      window.location.href = "configuracao.html";
    });
  }

  // Valores iniciais
  totalProdutos.innerText = 0;
  totalConversas.innerText = 0;
  totalMensagens.innerText = 0;

  // Reset menu
  function resetActiveMenu() {
     
       
      [menuDashboard, menuProdutos, menuServicos, menuConversas, menuPlanos, menuEstatisticas]
 

 
      .forEach(m => m.classList.remove("active"));
  }

  // Mostrar os dados Dashboard
async function mostrarDashboard() {

  //Atualize apenas quando tiver no dashboard
  secaoAtual = "dashboard";

  resetActiveMenu();
  menuDashboard.classList.add("active");

  const email = localStorage.getItem("empresaEmail");

  console.log("📊 Buscando dados do dashboard para email:", email);

  conteudoDinamico.innerHTML = `
    <h2>Resumo Rápido</h2>
    <p>A carregar dados...</p>
  `;

  try {
    const response = await fetch(`http://localhost:3000/company/data/${email}`);
    const data = await response.json();
    
    console.log("📨 Dados recebidos do servidor:", data);
    console.log("Perguntas Respondidas:", data.perguntasRespondidas);
 
//A função que vai listar produtos 
const produtosDetalhados = parseItensComPreco(data.produtos);
totalProdutos.innerText = produtosDetalhados.length;
 
//A função que vai listar os serviços
const listaServicos = data.servicos ? data.servicos.split(",") : [];
totalServicos.innerText = listaServicos.length;

//Faz o total de conversas para mostrar no dashboard
const logsResponse = await fetch(`http://localhost:3000/logs/${email}`);
const logs = await logsResponse.json();

//Área que vai calcularo total de mensagens
totalConversas.innerText = logs.length;
 
totalMensagens.innerText = logs.length * 2;
 
 


conteudoDinamico.innerHTML = `
  
  <h2>Resumo da Empresa</h2>

 <div class="resumo-box plano-box">
  <h2>Plano Atual</h2>

  <p><strong>Plano:</strong> ${data.plano || "Wydoraço Grátis"}</p>

  ${
  data.planoSolicitado
    ? `<p><strong>Plano solicitado:</strong> ${data.planoSolicitado}</p>`
    : ""
}

  <p><strong>Valor:</strong> ${data.valorPlano || 0} Kz</p>

  <p><strong>Referência:</strong> ${data.referenciaPagamento || "Sem referência"}</p>

  ${
  data.paymentStatus === "pending"
    ? `<p><strong>Instrução:</strong> Efetue o pagamento usando a referência acima.</p>`
    : ""
}

 ${
  data.paymentStatus === "pending"
    ? `<button id="btnConfirmarPagamento">Confirmar Pagamento</button>`
    : ""
}
  <p><strong>Pagamento:</strong> ${
    data.paymentStatus === "free"
      ? "🟢 Ativo"
      : data.paymentStatus === "paid"
      ? "🟢 Pago"
      : "🟡 Pagamento Pendente"
  }</p>
</div>

<div class="resumo-box" style="border: 2px solid #3498db; background: #f0f8ff;">
  <h2>📊 Uso do Bot Neste Mês</h2>
  
  ${(() => {
    // Determinar limite baseado no plano
    let limite = 0;
    let planoDisplay = data.plano || "Wydoraço Grátis";
    
    if (planoDisplay === "Wydoraço Grátis") {
      limite = 50;
    } else if (planoDisplay === "Wydoraço Pro") {
      limite = 500;
    } else if (planoDisplay === "Wydoraço Pro+" || planoDisplay === "Wydoraço Premium") {
      limite = Infinity;
    }
    
    const usado = data.perguntasRespondidas || 0;
    const percentual = limite === Infinity ? 0 : Math.min((usado / limite) * 100, 100);
    
    if (limite === Infinity) {
      return `
        <p style="font-size: 16px;"><strong>✨ Perguntas Respondidas:</strong> <span style="color: #27ae60; font-weight: bold;">${usado}</span></p>
        <p style="color: #27ae60; font-weight: bold;">∞ Ilimitado (Sem restrições)</p>
      `;
    } else {
      return `
        <p style="font-size: 16px;"><strong>Perguntas Respondidas:</strong> <span style="color: #3498db; font-weight: bold;">${usado}/${limite}</span></p>
        
        <div style="background: #ecf0f1; border-radius: 10px; height: 25px; margin: 10px 0; overflow: hidden;">
          <div style="background: linear-gradient(90deg, ${percentual > 80 ? '#e74c3c' : percentual > 50 ? '#f39c12' : '#27ae60'}, ${percentual > 80 ? '#c0392b' : percentual > 50 ? '#e67e22' : '#229954'}); width: ${percentual}%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; transition: width 0.3s ease;">
            ${percentual > 5 ? Math.round(percentual) + '%' : ''}
          </div>
        </div>
        
        ${percentual >= 80 ? '<p style="color: #e74c3c; font-weight: bold;">⚠️ Atenção: Você está próximo do limite!</p>' : ''}
        ${percentual >= 100 ? '<p style="color: #c0392b; font-weight: bold;">❌ Limite atingido! Faça upgrade para continuar.</p>' : ''}
        
        <p style="font-size: 12px; color: #7f8c8d;">Reseta mensalmente em <strong>${(() => {
          const dataReset = new Date(data.dataUltimoReset);
          const proximoReset = new Date(dataReset.getTime() + 30 * 24 * 60 * 60 * 1000);
          const dias = Math.ceil((proximoReset - new Date()) / (1000 * 60 * 60 * 24));
          return dias > 0 ? dias + ' dias' : 'em breve';
        })()}</strong></p>
      `;
    }
  })()}
</div>
 
  
<div class="resumo-box">
  <h3>🔗 Link do Bot</h3>
   
<a href="bot.html" target="_blank" class="btnBot">
  Abrir Meu Bot
</a>
 
</div>
 

`;
 
//✅ Evento para confirmar pagamento
const btnConfirmar = document.getElementById("btnConfirmarPagamento");

if (btnConfirmar) {
  btnConfirmar.addEventListener("click", async () => {
    const email = localStorage.getItem('empresaEmail');
    
    try {
      await fetch("http://localhost:3000/company/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });

      alert("✅ Pagamento confirmado com sucesso!\n\n🎉 Seu plano agora está ativo!\nVocê tem acesso a todos os recursos.");
      mostrarDashboard();
    } catch (erro) {
      alert("❌ Erro ao confirmar pagamento. Tente novamente.");
      console.error(erro);
    }
  });
}


  } catch (error) {
    conteudoDinamico.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível carregar os dados.</p>
    `;
  }
}
 


  // Abaixo temos a função que vai listar os produtos
    
async function mostrarProdutos() {

//Atualizar apenas quando o usuário estiver em dashboard   
secaoAtual = "produtos";
 

  resetActiveMenu();
  menuProdutos.classList.add("active");

  const email = localStorage.getItem("empresaEmail");

  conteudoDinamico.innerHTML = `
    <h2>Meus Produtos</h2>
    <p>A carregar produtos...</p>
  `;

  try {
    const response = await fetch(`http://localhost:3000/company/data/${email}`);
    const data = await response.json();

    const produtosDetalhados = parseItensComPreco(data.produtos);

    conteudoDinamico.innerHTML = `
      <div class="produtos-header">
        <div>
          <h2>Meus Produtos</h2>
          <p>Aqui estão os produtos cadastrados na sua loja</p>
        </div>
        <div class="add-product-form">
          <input id="produtoNome" type="text" placeholder="Nome do produto" />
          <input id="produtoPreco" type="text" placeholder="Preço do produto" />
          <button id="btnAddProduto">Adicionar</button>
        </div>
      </div>
      <div class="produtos-grid">
        ${produtosDetalhados.map(produto => `
          <div class="product-card">
            <div class="product-card-content">
              <span class="product-name">${produto.nome}</span>
              <span class="product-price">${produto.preco || "Preço não informado"}</span>
            </div>
            <div class="product-card-footer">
              <button class="btnExcluir" data-produto="${produto.original.replace(/"/g, '&quot;')}">Excluir</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Adicionar produto
    document.getElementById("btnAddProduto").addEventListener("click", async () => {
      const produtoNome = document.getElementById("produtoNome").value.trim();
      const produtoPreco = document.getElementById("produtoPreco").value.trim();

      if (!produtoNome || !produtoPreco) {
        alert("Por favor preencha o nome do produto e o preço.");
        return;
      }

      const novoProduto = `${produtoNome} - ${produtoPreco}`;
      const produtoExiste = produtosDetalhados.some(item => item.original.toLowerCase() === novoProduto.toLowerCase());

      if (produtoExiste) {
        alert("Este produto já está cadastrado.");
        return;
      }

      const response = await fetch("http://localhost:3000/company/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          produto: novoProduto
        })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Erro ao adicionar o produto.");
        return;
      }

      mostrarProdutos();
    });

    // Excluir produto
    document.querySelectorAll(".btnExcluir").forEach(btn => {
      btn.addEventListener("click", async () => {
        const produto = btn.dataset.produto;

        await fetch("http://localhost:3000/company/remove-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            produto
          })
        });

        mostrarProdutos();
      });
    });

  } catch (error) {
    conteudoDinamico.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível carregar produtos.</p>
    `;
  }
}

//Função criar pagamento através de empresas logadas
 window.criarPagamento = async function(plano, valor) {
  try {
    const email = localStorage.getItem('empresaEmail');

    if (!email) {
      alert('Erro: Email não encontrado. Faça login novamente.');
      window.location.href = 'login.html';
      return;
    }

    // Chamar a rota de atualizar plano
    const resposta = await fetch('http://localhost:3000/company/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        plano
      })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao alterar plano');
    }

    const dados = await resposta.json();

    alert(`✅ Solicitação de Upgrade Criada!\n\n📋 Plano: ${plano}\n💳 Referência: ${dados.referenciaPagamento}\n💰 Valor: ${dados.valorPlano} Kz\n\n⏳ Efetue o pagamento usando a referência acima.\nDepois clique em "Confirmar Pagamento" no dashboard.`);

    mostrarDashboard();

  } catch (erro) {
    console.error('Erro no pagamento:', erro);
    alert('❌ Erro ao mudar de plano. Tente novamente.');
  }
}


// Abaixo temos a função que vai listar os serviços
async function mostrarServicos() {

//Atualize apenas quando estiver no dashboard 
secaoAtual = "servicos";
 

  resetActiveMenu();
  menuServicos.classList.add("active");

  const email = localStorage.getItem("empresaEmail");

  conteudoDinamico.innerHTML = `
    <h2>Meus Serviços</h2>
    <p>A carregar serviços...</p>
  `;

  try {
    const response = await fetch(`http://localhost:3000/company/data/${email}`);
    const data = await response.json();

    const servicosDetalhados = parseItensComPreco(data.servicos);

    conteudoDinamico.innerHTML = `
      <div class="produtos-header">
        <div>
          <h2>Meus Serviços</h2>
          <p>Aqui estão os serviços cadastrados na sua empresa</p>
        </div>
        <div class="add-product-form">
          <input id="servicoNome" type="text" placeholder="Nome do serviço" />
          <input id="servicoPreco" type="text" placeholder="Preço do serviço" />
          <button id="btnAddServico">Adicionar</button>
        </div>
      </div>
      <div class="produtos-grid">
        ${servicosDetalhados.map(servico => `
          <div class="product-card">
            <div class="product-card-content">
              <span class="product-name">${servico.nome}</span>
              <span class="product-price">${servico.preco || "Preço não informado"}</span>
            </div>
            <div class="product-card-footer">
              <button class="btnExcluirServico" data-servico="${servico.original.replace(/"/g, '&quot;')}">Excluir</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Adicionar serviço
    document.getElementById("btnAddServico").addEventListener("click", async () => {
      const servicoNome = document.getElementById("servicoNome").value.trim();
      const servicoPreco = document.getElementById("servicoPreco").value.trim();

      if (!servicoNome || !servicoPreco) {
        alert("Por favor preencha o nome do serviço e o preço.");
        return;
      }

      const novoServico = `${servicoNome} - ${servicoPreco}`;
      const servicoExiste = servicosDetalhados.some(item => item.original.toLowerCase() === novoServico.toLowerCase());

      if (servicoExiste) {
        alert("Este serviço já está cadastrado.");
        return;
      }

      const response = await fetch("http://localhost:3000/company/add-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          servico: novoServico
        })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Erro ao adicionar o serviço.");
        return;
      }

      mostrarServicos();
    });

    // Excluir serviço
    document.querySelectorAll(".btnExcluirServico").forEach(btn => {
      btn.addEventListener("click", async () => {
        const servico = btn.dataset.servico;

        await fetch("http://localhost:3000/company/remove-service", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            servico
          })
        });

        mostrarServicos();
      });
    });

  } catch (error) {
    conteudoDinamico.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível carregar serviços.</p>
    `;
  }
}
 

 

  // Conversas
async function mostrarConversas() {

   //Atualize apenas quando a página esiver em dashboard 
  secaoAtual = "conversas";
 

  resetActiveMenu();
  menuConversas.classList.add("active");

  const email = localStorage.getItem("empresaEmail");

  conteudoDinamico.innerHTML = `
    <div class="conversas-header">
      <div>
        <h2>Conversas</h2>
        <p>Veja os últimos diálogos ou limpe tudo quando desejar.</p>
      </div>
      <button id="btnLimparConversas" class="btn-clear-conversas">Limpar conversas</button>
    </div>
    <p>A carregar conversas...</p>
  `;

  try {
    const response = await fetch(`http://localhost:3000/logs/${email}`);
    const logs = await response.json();

    conteudoDinamico.innerHTML = `
      <div class="conversas-header">
        <div>
          <h2>Conversas Recentes</h2>
          <p>${logs.length} conversa(s) encontradas</p>
        </div>
        <button id="btnLimparConversas" class="btn-clear-conversas">Limpar conversas</button>
      </div>
      <ul class="conversas-list">
        ${logs.map(log => `
          <li>
            <strong>Pergunta:</strong> ${log.userMessage}<br>
            <strong>Resposta:</strong> ${log.botResponse}<br>
            <small>${new Date(log.createdAt).toLocaleString()}</small>
          </li>
        `).join("")}
      </ul>
    `;

    const btnLimparConversas = document.getElementById("btnLimparConversas");
    if (btnLimparConversas) {
      btnLimparConversas.addEventListener("click", async () => {
        const confirmar = confirm("Deseja realmente apagar todas as conversas registradas? Esta ação não pode ser desfeita.");
        if (!confirmar) return;

        try {
          const limparResposta = await fetch("http://localhost:3000/logs/clear", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
          });

          const limparData = await limparResposta.json();

          if (!limparResposta.ok) {
            throw new Error(limparData.error || "Falha ao limpar conversas.");
          }

          alert("✅ Conversas apagadas com sucesso.");
          mostrarConversas();
        } catch (deleteError) {
          console.error(deleteError);
          alert("❌ Não foi possível limpar as conversas. Tente novamente.");
        }
      });
    }

  } catch (error) {
    conteudoDinamico.innerHTML = `
      <h2>Erro</h2>
      <p>Não foi possível carregar conversas.</p>
    `;
  }
}
 

 
 
 
function mostrarPlanos() {

   //Atualize apenas quando a página esiver em dashboard 
  secaoAtual = "planos";

  resetActiveMenu();
  secaoAtual = "planos";
  menuPlanos.classList.add("active");

  conteudoDinamico.innerHTML = `
    <h2>📋 Escolha o Melhor Plano para Sua Empresa</h2>
    <p style="color: #7f8c8d; margin-bottom: 20px;">Upgrade seu plano para desbloquear mais recursos e IA avançada.</p>

    <div class="resumo-box" style="border: 2px solid #2ecc71; background: #f0fff4;">
      <h3>🟢 Wydoraço Grátis</h3>
      <p>✔ Chatbot básico</p>
      <p>✔ Até <strong>50 perguntas/mês</strong></p>
      <p>✔ Respostas pré-programadas</p>
      <p>✔ Sem IA</p>
      <p style="font-size: 18px; font-weight: bold; color: #2ecc71;"><strong>0 Kz</strong></p>
      <button onclick="escolherPlano('Wydoraço Grátis')" style="background-color: #2ecc71; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Escolher Plano</button>
    </div>

    <div class="resumo-box" style="border: 2px solid #3498db;">
      <h3>🔵 Wydoraço Pro</h3>
      <p>✔ IA Chatbot integrada com OpenAI</p>
      <p>✔ Até <strong>500 perguntas/mês</strong></p>
      <p>✔ Respostas inteligentes personalizadas</p>
      <p>✔ Rastreamento de conversas</p>
      <p>✔ Suporte básico</p>
      <p style="font-size: 18px; font-weight: bold; color: #3498db;"><strong>2.000 Kz / mês</strong></p>
       <button onclick="criarPagamento('Wydoraço Pro', 2000)" style="background-color: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Escolher Plano</button>
    </div>

    <div class="resumo-box" style="border: 2px solid #9b59b6;">
      <h3>🟣 Wydoraço Pro+</h3>
      <p>✔ IA avançada com conversas ilimitadas</p>
      <p>✔ <strong>Respostas ILIMITADAS</strong></p>
      <p>✔ Análise inteligente de clientes</p>
      <p>✔ Histórico completo de conversas</p>
      <p>✔ Prioridade de suporte</p>
      <p style="font-size: 18px; font-weight: bold; color: #9b59b6;"><strong>4.000 Kz / mês</strong></p>
       <button onclick="criarPagamento('Wydoraço Pro+', 4000)" style="background-color: #9b59b6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Escolher Plano</button>
    </div>

    <div class="resumo-box" style="border: 3px solid #f39c12; background: #fffbf0;">
      <h3>👑 Wydoraço Premium</h3>
      <p style="background: #f39c12; color: white; padding: 5px 10px; border-radius: 3px; display: inline-block; font-size: 12px;">⭐ MODO VENDAS INTELIGENTE</p>
      <p><strong>✨ IA Especializada em Vendas e Marketing</strong></p>
      <p>✔ <strong>Conversas ILIMITADAS</strong></p>
      <p>✔ Recomendações inteligentes de produtos</p>
      <p>✔ Análise de necessidades de clientes</p>
      <p>✔ Geração de propostas comerciais</p>
      <p>✔ Estratégias de upsell e cross-sell</p>
      <p>✔ Suporte premium 24/7</p>
      <p style="font-size: 18px; font-weight: bold; color: #f39c12;"><strong>8.000 Kz / mês</strong></p>
       <button onclick="criarPagamento('Wydoraço Premium', 8000)" style="background-color: #f39c12; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">🚀 Escolher Premium</button>
    </div>

    <div style="margin-top: 30px; padding: 15px; background: #ecf0f1; border-radius: 5px;">
      <h4>📊 Comparação de Planos:</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #34495e; color: white;">
          <th style="padding: 10px; text-align: left;">Feature</th>
          <th style="padding: 10px; text-align: center;">Grátis</th>
          <th style="padding: 10px; text-align: center;">Pro</th>
          <th style="padding: 10px; text-align: center;">Pro+</th>
          <th style="padding: 10px; text-align: center;">Premium</th>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #bdc3c7;">Limite de Perguntas</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">50</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">500</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">∞</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">∞</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #bdc3c7;">IA Integrada</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">❌</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">✅</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">✅</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">✅</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #bdc3c7;">Modo Vendas</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">❌</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">❌</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">❌</td>
          <td style="padding: 10px; text-align: center; border-bottom: 1px solid #bdc3c7;">✅ Ativo</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Suporte</td>
          <td style="padding: 10px; text-align: center;">Email</td>
          <td style="padding: 10px; text-align: center;">Prioritário</td>
          <td style="padding: 10px; text-align: center;">Prioritário</td>
          <td style="padding: 10px; text-align: center;">24/7</td>
        </tr>
      </table>
    </div>
  `;
}
 

 

 

  // Estatísticas
  function mostrarEstatisticas() {


    resetActiveMenu();
    menuEstatisticas.classList.add("active");

    conteudoDinamico.innerHTML = `
      <h2>Estatísticas</h2>
      <p>Em breve adicionaremos estatísticas reais.</p>
    `;
  }

  //Aqui vamos adicionar os eventos click para cada sidebar 
  menuDashboard.addEventListener("click", mostrarDashboard);
  menuProdutos.addEventListener("click", mostrarProdutos);
  menuServicos.addEventListener("click", mostrarServicos);
  menuConversas.addEventListener("click", mostrarConversas);
  menuPlanos.addEventListener("click", mostrarPlanos);
  menuEstatisticas.addEventListener("click", mostrarEstatisticas);


//Função escolher plano
 window.escolherPlano = async function(plano) {
  const email = localStorage.getItem("empresaEmail");

  await fetch("http://localhost:3000/company/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      plano
    })
  });

  alert(`✅ ${plano} ativado com sucesso!\n\nVocê agora está usando o ${plano}.\nBem-vindo!`);

  mostrarDashboard();
};
 

  

  mostrarDashboard();

   //Atualização contínua do dashboard a cada 2 segundos ✅
let refreshInterval;

function iniciarRefreshAutomatico() {
  // Se já existe um intervalo, limpa
  if (refreshInterval) clearInterval(refreshInterval);
  
  // Atualiza a cada 2 segundos enquanto estiver no dashboard
  refreshInterval = setInterval(() => {
    if (secaoAtual === "dashboard") {
      console.log("🔄 Atualizando dados do dashboard...");
      mostrarDashboard();
    }
  }, 9000);
}

function pararRefreshAutomatico() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Iniciar refresh quando dashboard carregar
iniciarRefreshAutomatico();

// Parar refresh quando sair do dashboard
[menuProdutos, menuServicos, menuConversas, menuPlanos, menuEstatisticas].forEach(menu => {
  menu.addEventListener("click", pararRefreshAutomatico);
});

// Reiniciar quando voltar ao dashboard
menuDashboard.addEventListener("click", () => {
  iniciarRefreshAutomatico();
});

});
 
