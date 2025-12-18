const dados = [
    {
        id: 1,
        titulo: "Reciclagem em casa",
        categoria: "Reciclagem",
        data: "2025-05-12",
        descricao: "Separar corretamente os materiais recicláveis em casa.",
        curtidas: 243,
        curtido: false,
        imagem: "img/reciclagem.png"
    }
    ,
    {
        id: 2,
        titulo: "Economia de água",
        categoria: "Agua",
        data: "2025-06-20",
        descricao: "Reduzir tempo no banho e consertar vazamentos.",
        curtidas: 567,
        curtido: false,
        imagem: "img/agua.jpg"
    },
    {  
        id: 3,
        titulo: "Transporte público",
        categoria: "Transporte",
        data: "2025-07-15",
        descricao: "Optar por transporte público ou bicicleta em vez de carro.",
        curtidas: 500,
        curtido: false,
        imagem: "img/transporte.jpg"
    },
    {  
        id: 4,
        titulo: "Plantar árvores",
        categoria: "Plantas",
        data: "2025-08-10",
        descricao: "Participar de campanhas de plantio de árvores na comunidade.",
        curtidas: 398,
        curtido: false,
        imagem: "img/planta.jpg"
    },
    {  
        id: 5,
        titulo: "Reduzir uso de plástico",
        categoria: "Lixo",
        data: "2024-09-05",
        descricao: "Utilizar sacolas reutilizáveis, sempre q possível.",
        curtidas: 4,
        curtido: false,
        imagem: "img/lixo.jpg"
    },
    {
        id: 6,
        titulo: "Compostagem doméstica",
        categoria: "Lixo",
        data: "2024-10-01",
        descricao: "Transformar resíduos orgânicos em adubo para plantas.",
        curtidas: 150,
        curtido: false,
        imagem: "img/lixo.jpg"
    },
    {  
        id: 7,
        titulo: "Uso consciente de energia",
        categoria: "geral",
        data: "2024-11-11",
        descricao: "Desligar aparelhos eletrônicos quando não estiverem em uso.",
        curtidas: 320,
        curtido: false,
        imagem: "img/reciclagem.jpg"
    }
];

let listaVisual = dados.slice();
let indiceCentro = Math.floor(listaVisual.length / 2);
const container = document.getElementById('card-container');

function listaPequena(lista) {
    return lista.length <= 4;
}

function formataString(value) {
    return String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function renderizarCards(lista) {
    container.innerHTML = '';
    const MAX_CARDS = 5;
    const visiveis = lista.slice(0, MAX_CARDS);
    indiceCentro = Math.floor(visiveis.length / 2);

    visiveis.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        if (listaPequena(visiveis)) {
            card.classList.add('central-card');
        } else {
            if (index === indiceCentro) card.classList.add('central-card');
            else if (index === indiceCentro - 1) card.classList.add('left-central-card');
            else if (index === indiceCentro + 1) card.classList.add('right-central-card');
        }

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p class="card-category"><b>Categoria:</b> ${item.categoria}</p>
            <div class="card-image">
                <img src="${item.imagem || ''}" alt="${item.titulo}">
            </div>
            <p class="card-date"><b>Data:</b> ${item.data}</p>
            <p class="card-description">${item.descricao}</p>
            <button onclick="clickGostei(${item.id})" class="like-btn" id="like-btn-${item.id}">Curtir (${item.curtidas})</button>
        `;
        container.appendChild(card);
    });
}

function atualizarLista(novaLista) {
    listaVisual = novaLista;
    indiceCentro = Math.floor(listaVisual.length / 2);
    renderizarCards(listaVisual);
}

const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        const valorPesquisa = formataString(event.target.value);
        const listaFiltrada = dados.filter(item =>
            formataString(item.titulo).includes(valorPesquisa) ||
            formataString(item.categoria).includes(valorPesquisa)
        );
        atualizarLista(listaFiltrada);
    });
}



const filtroSelect = document.getElementById('filtro-select');
if (filtroSelect) {
    filtroSelect.addEventListener('change', () => {
        const categoriaSelecionada = formataString(filtroSelect.value);

        if (categoriaSelecionada === 'todos') {
            atualizarLista(dados);
        } else {
            const listaFiltrada = dados.filter(item => 
                formataString(item.categoria) === categoriaSelecionada
            );
            atualizarLista(listaFiltrada);
        }
        
    });
} 

function clickGostei(id) {
    const item = dados.find(item => item.id === id);
    if (item && !item.curtido) {
        item.curtidas++;
        item.curtido = true;
        atualizarLista(dados);
    }
    else {
        item.curtidas--;
        item.curtido = false;
        atualizarLista(dados);
    }
}

function moverDireita() {
    const primeiro = listaVisual.shift();
    listaVisual.push(primeiro);
    renderizarCards(listaVisual);
}

function moverEsquerda() {
    const ultimo = listaVisual.pop();
    listaVisual.unshift(ultimo);
    renderizarCards(listaVisual);
}

document.getElementById("next").addEventListener("click", moverDireita);
document.getElementById("prev").addEventListener("click", moverEsquerda);

document.addEventListener('keydown', (event) => {
    const tag = document.activeElement && document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (event.key === 'ArrowRight') {
        event.preventDefault();
        moverDireita();
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moverEsquerda();
    }
});

renderizarCards(listaVisual);