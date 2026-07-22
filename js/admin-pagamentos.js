const API_BASE_URL = "https://wydoraco-backend.onrender.com";

async function carregarPagamentos() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/company/pending-payments`
        );

        const empresas = await response.json();

        const tabela = document.getElementById("listaPagamentos");

        tabela.innerHTML = "";

        empresas.forEach(empresa => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${empresa.nome}</td>
                <td>${empresa.planoSolicitado}</td>
                <td>${empresa.valorPlano} Kz</td>
                <td>${empresa.referenciaPagamento}</td>
                <td>${new Date(empresa.dataPagamento).toLocaleDateString()}</td>
                <td>
                    <button onclick="confirmarPagamento('${empresa.email}')">
                        Confirmar
                    </button>
                </td>
            `;

            tabela.appendChild(linha);

        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar pagamentos.");

    }

}

carregarPagamentos();