const dados = [
    {
        id: 1,
        título: "Reciclagem em casa",
        categoria: "reciclagem",
        data: "2025-05-12",
        descrição: "separar corretamente os materiais recicláveis em casa.",
        curtidas: 0
    }
    ,
    {
        id: 2,
        título: "Economia de água",
        categoria: "Consumo Consciente",
        data: "2025-06-20",
        descrição: "reduzir tempo no banho e consertar vazamentos.",
        curtidas: 2
    }
]
const container = document.getElementById('card-container');

function renderizarCards(lista) {
    container.innerHTML = '';

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.título}</h3>
            <p><b>Categoria:</b> ${item.categoria}i</p>
            <p><b>Data:</b> ${item.data}</p>
            <p>${item.descrição}</p>
            <button id="like-btn-${item.id}">Curtir (${item.curtidas})</button>
        `;
        container.appendChild(card);
    });
}
renderizarCards(dados);