// 1. DADOS PADRÃO
const dadosIniciais = [
    {
        id: 1, titulo: "Reciclagem em casa", categoria: "Reciclagem", data: "2025-05-12",
        descricao: "Separar corretamente os materiais recicláveis em casa.", curtidas: 243, curtido: false, imagem: "img/reciclagem.png"
    },
    {
        id: 2, titulo: "Economia de água", categoria: "Agua", data: "2025-06-20",
        descricao: "Reduzir tempo no banho e consertar vazamentos.", curtidas: 567, curtido: false, imagem: "img/agua.jpg"
    },
    {  
        id: 3, titulo: "Transporte público", categoria: "Transporte", data: "2025-07-15",
        descricao: "Optar por transporte público ou bicicleta em vez de carro.", curtidas: 500, curtido: false, imagem: "img/transporte.jpg"
    },
    {  
        id: 4, titulo: "Plantar árvores", categoria: "Plantas", data: "2025-08-10",
        descricao: "Participar de campanhas de plantio de árvores na comunidade.", curtidas: 398, curtido: false, imagem: "img/planta.jpg"
    },
    {  
        id: 5, titulo: "Reduzir uso de plástico", categoria: "Lixo", data: "2024-09-05",
        descricao: "Utilizar sacolas reutilizáveis, sempre q possível.", curtidas: 4, curtido: false, imagem: "img/lixo.jpg"
    },
];

// 2. RECUPERAÇÃO DE DADOS
let dados = JSON.parse(localStorage.getItem('ecoVidaDados')) || dadosIniciais;

// Função de Salvar com tratamento de erro
function salvarNoStorage() {
    try {
        localStorage.setItem('ecoVidaDados', JSON.stringify(dados));
    } catch (e) {
        alert("Erro: Limite de armazenamento excedido! Tente usar imagens menores.");
        console.error(e);
    }
}

let listaVisual = dados.slice();
let indiceCentro = Math.floor(listaVisual.length / 2);
const container = document.getElementById('card-container');

// FORMULÁRIO
const formulario = document.getElementById('form-novo-card');

if (formulario) {
    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const tituloInput = document.getElementById('novo-titulo').value;
        const categoriaInput = document.getElementById('nova-categoria').value;
        const descricaoInput = document.getElementById('nova-descricao').value;

        const inputImagem = document.getElementById('nova-imagem');
        const arquivo = inputImagem ? inputImagem.files[0] : null;

        if (!tituloInput.trim() || !descricaoInput.trim() || !categoriaInput) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        if (arquivo && arquivo.size > 500 * 1024) {
            alert("A imagem deve ter no máximo 500KB.");
            return;
        }

        const processarCadastro = (imagemBase64) => {
            const novoCard = {
                id: Date.now(),
                titulo: tituloInput,
                categoria: categoriaInput,
                data: new Date().toISOString().split('T')[0],
                descricao: descricaoInput,
                curtidas: 0,
                curtido: false,
                imagem: imagemBase64
            };

            dados.unshift(novoCard);
            salvarNoStorage();

            if (document.getElementById('search')) document.getElementById('search').value = '';
            if (document.getElementById('filtro-select')) document.getElementById('filtro-select').value = 'Todos';

            atualizarLista(dados);
            formulario.reset();
            alert("Card adicionado com sucesso!");
        };

        if (arquivo) {
            const reader = new FileReader();
            reader.onload = (e) => processarCadastro(e.target.result);
            reader.readAsDataURL(arquivo);
        } else {
            processarCadastro("img/reciclagem.png");
        }
    });
}

// FUNÇÕES AUXILIARES
function listaPequena(lista) {
    return lista.length <= 4;
}

function formataString(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// RENDERIZAÇÃO DOS CARDS
function renderizarCards(lista) {
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<p>Nenhum card encontrado.</p>';
        return;
    }

    const MAX_CARDS = 5;
    const visiveis = lista.slice(0, MAX_CARDS);
    indiceCentro = Math.floor(visiveis.length / 2);

    visiveis.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        if (listaPequena(visiveis)) {
            card.classList.add('lista-pequena');
        } else {
            if (index === indiceCentro) card.classList.add('central-card');
            else if (index === indiceCentro - 1) card.classList.add('left-central-card');
            else if (index === indiceCentro + 1) card.classList.add('right-central-card');
        }

        const imgPath = item.imagem || 'img/reciclagem.png';

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p class="card-category"><b>Categoria:</b> ${item.categoria}</p>
            <div class="card-image">
                <img src="${imgPath}" alt="${item.titulo}">
            </div>
            <p class="card-date"><b>Data:</b> ${item.data}</p>
            <p class="card-description">${item.descricao}</p>
            <button
                onclick="clickGostei(${item.id})"
                class="like-btn ${item.curtido ? 'curtido' : ''}"
                id="like-btn-${item.id}">
                <span class="coracao">❤</span> (${item.curtidas})
            </button>
        `;
        container.appendChild(card);
    });
}

function atualizarLista(novaLista) {
    listaVisual = novaLista;
    renderizarCards(listaVisual);
}

// FILTROS
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        const valor = formataString(event.target.value);
        const filtrada = dados.filter(item =>
            formataString(item.titulo).includes(valor) ||
            formataString(item.categoria).includes(valor)
        );
        atualizarLista(filtrada);
    });
}

const filtroSelect = document.getElementById('filtro-select');
if (filtroSelect) {
    filtroSelect.addEventListener('change', () => {
        const cat = formataString(filtroSelect.value);
        if (cat === 'todos') atualizarLista(dados);
        else atualizarLista(dados.filter(item => formataString(item.categoria) === cat));
    });
}

// RANKING
function renderizarRanking() {
    const rankingContainer = document.getElementById('ranking-container');
    if (!rankingContainer) return;

    rankingContainer.innerHTML = '';

    const top5 = [...dados]
        .sort((a, b) => b.curtidas - a.curtidas)
        .slice(0, 5);

    top5.forEach((item, index) => {
        const cardRanking = document.createElement('div');
        cardRanking.classList.add('ranking-card');

        cardRanking.innerHTML = `
            <span class="ranking-posicao">${index + 1}º Lugar</span>
            <h3>${item.titulo}</h3>
            <p class="card-category"><b>Categoria:</b> ${item.categoria}</p>
            <div class="card-image">
                <img src="${item.imagem || 'img/reciclagem.png'}" alt="${item.titulo}">
            </div>
            <p class="card-date"><b>Data:</b> ${item.data}</p>
            <p><b>${item.curtidas}</b> curtidas</p>
        `;
        rankingContainer.appendChild(cardRanking);
    });
}

// CURTIR
function clickGostei(id) {
    const item = dados.find(item => item.id === id);
    if (item) {
        item.curtido = !item.curtido;
        item.curtidas += item.curtido ? 1 : -1;

        salvarNoStorage();
        atualizarLista(listaVisual);
        renderizarRanking();
    }
}

// NAVEGAÇÃO
function moverDireita() {
    if (listaVisual.length > 0) {
        const primeiro = listaVisual.shift();
        listaVisual.push(primeiro);
        renderizarCards(listaVisual);
    }
}

function moverEsquerda() {
    if (listaVisual.length > 0) {
        const ultimo = listaVisual.pop();
        listaVisual.unshift(ultimo);
        renderizarCards(listaVisual);
    }
}

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

if (nextBtn) nextBtn.addEventListener("click", moverDireita);
if (prevBtn) prevBtn.addEventListener("click", moverEsquerda);

// INICIALIZAÇÃO
renderizarCards(listaVisual);
renderizarRanking();
