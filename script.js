const dados = [
    {
        id: 1,
        titulo: "Reciclagem em casa",
        categoria: "reciclagem",
        data: "2025-05-12",
        descricao: "Separar corretamente os materiais recicláveis em casa.",
        curtidas: 0
    }
    ,
    {
        id: 2,
        titulo: "Economia de água",
        categoria: "Consumo Consciente",
        data: "2025-06-20",
        descricao: "Reduzir tempo no banho e consertar vazamentos.",
        curtidas: 2
    }
    ,
    {  
        id: 3,
        titulo: "Transporte público",
        categoria: "Mobilidade Sustentável",
        data: "2025-07-15",
        descricao: "Optar por transporte público ou bicicleta em vez de carro.",
        curtidas: 5
    }
    ,
    {  
        id: 4,
        titulo: "Plantar árvores",
        categoria: "Reflorestamento",
        data: "2025-08-10",
        descricao: "Participar de campanhas de plantio de árvores na comunidade.",
        curtidas: 3
    }
    , 
    {  
        id: 5,
        titulo: "Reduzir uso de plástico",
        categoria: "Consumo Consciente",
        data: "2025-09-05",
        descricao: "Utilizar sacolas reutilizáveis e evitar produtos com excesso de embalagem plástica.",
        curtidas: 4
    }
]
let indiceLeftCentro = 1;
let indiceCentro = 2;
let indiceRightCentro = 3;

const container = document.getElementById('card-container');

function renderizarCards(lista) {
    container.innerHTML = '';

    lista.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        if(index === indiceLeftCentro) {
            card.classList.add('left-central-card');
        }
        if(index === indiceCentro) {
            card.classList.add('central-card');
        }
        if(index === indiceRightCentro) {
            card.classList.add('right-central-card');
        }
        
        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p><b>Categoria:</b> ${item.categoria}</p>
            <p><b>Data:</b> ${item.data}</p>
            <p>${item.descricao}</p>
            <button id="like-btn-${item.id}">Curtir (${item.curtidas})</button>
        `;
        container.appendChild(card);
    });
}
renderizarCards(dados);