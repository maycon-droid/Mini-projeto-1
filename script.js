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
let listaVisual=[...dados];
let indiceCentro= Math.floor(listaVisual.length / 2);
const container = document.getElementById('card-container');

function renderizarCards(lista) {
    container.innerHTML = '';

    lista.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        if(index === indiceCentro-1) {
            card.classList.add('left-central-card');
        }
        if(index === indiceCentro) {
            card.classList.add('central-card');
        }
        if(index === indiceCentro+1) {
            card.classList.add('right-central-card');
        }

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <div class= "card-image">
                <img src="${item.imagem}" alt="${item.titulo}" />
            </div>
            <p><b>Categoria:</b> ${item.categoria}</p>
            <p><b>Data:</b> ${item.data}</p>
            <p>${item.descricao}</p>
            <button id="like-btn-${item.id}">Curtir (${item.curtidas})</button>
        `;
        container.appendChild(card);
    });
}
function atualizarLista(novaLista) {
    listaVisual = novaLista;
    indiceCentro = Math.floor(listaVisual.length / 2);
    renderizarCards(listaVisual);
}

renderizarCards(listaVisual);

const searchInput = document.getElementById('search');

searchInput.addEventListener('input', (event) =>{
    const valorPesquisa = formatString(event.target.value);
    
    const cards = document.querySelectorAll('#card-container .card');
    
    cards.forEach(card => {
        const textoCard = formatString(card.textContent);
        
        if (textoCard.includes(valorPesquisa)) {
            card.style.display = ''; 
        } else {
            card.style.display = 'none';
        }
    });
});

function formatString (value){
    return value
    .toLowerCase()
    .trim();
}