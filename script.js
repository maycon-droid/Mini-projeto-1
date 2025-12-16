const dados = [
    {
        id: 1,
        titulo: "Reciclagem em casa",
        categoria: "Reciclagem",
        data: "2025-05-12",
        descricao: "Separar corretamente os materiais recicláveis em casa.",
        curtidas: 0
    }
    ,
    {
        id: 2,
        titulo: "Economia de água",
        categoria: "Àgua",
        data: "2025-06-20",
        descricao: "Reduzir tempo no banho e consertar vazamentos.",
        curtidas: 2,
        imagem: "img/agua.jpg"
    }
    ,
    {  
        id: 3,
        titulo: "Transporte público",
        categoria: "Transporte",
        data: "2025-07-15",
        descricao: "Optar por transporte público ou bicicleta em vez de carro.",
        curtidas: 5,
        imagem: "img/transporte.jpg"
    }
    ,
    {  
        id: 4,
        titulo: "Plantar árvores",
        categoria: "Plantas",
        data: "2025-08-10",
        descricao: "Participar de campanhas de plantio de árvores na comunidade.",
        curtidas: 3,
        imagem: "img/planta.jpg"
    }
    , 
    {  
        id: 5,
        titulo: "Reduzir uso de plástico",
        categoria: "Lixo",
        data: "2025-09-05",
        descricao: "Utilizar sacolas reutilizáveis e evitar produtos com excesso de embalagem plástica.",
        curtidas: 4,
        imagem: "img/lixo.jpg"
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
            <p class="card-category"><b>Categoria:</b> ${item.categoria}</p>
            <div class="card-image">
                <img src="${item.imagem}" alt="${item.titulo}">
            </div>
            <p class="card-date"><b>Data:</b> ${item.data}</p>
            <p class="card-description">${item.descricao}</p>
            <button class="like-btn" id="like-btn-${item.id}">Curtir (${item.curtidas})</button>
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

renderizarCards(dados);
