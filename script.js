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
    }
];

// 2. RECUPERAÇÃO DE DADOS
let dados = JSON.parse(localStorage.getItem('ecoVidaDados')) || dadosIniciais;

// Função de Salvar com tratamento de erro (Importante para imagens em Base64)
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

const formulario = document.getElementById('form-novo-card');

if (formulario) {
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Captura os valores de texto
        const tituloInput = document.getElementById('novo-titulo').value;
        const categoriaInput = document.getElementById('nova-categoria').value;
        const descricaoInput = document.getElementById('nova-descricao').value;
        
        // 2. Captura o arquivo de imagem
        const inputImagem = document.getElementById('nova-imagem'); // Certifique-se de criar este input no HTML
        const arquivo = inputImagem ? inputImagem.files[0] : null;

        // Validação de Campos
        if (!tituloInput.trim() || !descricaoInput.trim() || !categoriaInput) {
            alert("Por favor, preencha todos os campos de texto!");
            return;
        }

        // Validação de Tamanho da Imagem
        if (arquivo && arquivo.size > 500 * 1024) {
            alert("A imagem é muito grande! Escolha uma imagem menor que 500KB.");
            return;
        }

        // Função interna para criar o card e salvar
        const processarCadastro = (imagemBase64) => {
            const novoCard = {
                id: Date.now(),
                titulo: tituloInput,
                categoria: categoriaInput,
                data: new Date().toISOString().split('T')[0],
                descricao: descricaoInput,
                curtidas: 0,
                curtido: false,
                imagem: imagemBase64 // Usa a imagem enviada ou a padrão
            };

            dados.unshift(novoCard);
            salvarNoStorage();
            
            // Atualiza Interface
            // Se houver filtros ativos, reseta para mostrar o novo card
            if(document.getElementById('search')) document.getElementById('search').value = '';
            if(document.getElementById('filtro-select')) document.getElementById('filtro-select').value = 'Todos';
            
            atualizarLista(dados); // Atualiza com base nos dados originais
            formulario.reset();
            alert("Card adicionado com sucesso!");
        };

        // Leitura da Imagem
        if (arquivo) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Quando terminar de ler a imagem, chama a função de salvar
                const imagemConvertida = e.target.result;
                processarCadastro(imagemConvertida);
            };
            
            reader.readAsDataURL(arquivo); // Inicia a leitura
        } else {
            // Se o usuário não mandou foto, usa uma padrão
            processarCadastro("img/reciclagem.png");
        }
    });
}

// FUNÇÕES AUXILIARES

function listaPequena(lista) { return lista.length <= 4; }

function formataString(value) {
    return String(value).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

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
            card.classList.add('central-card');
        } else {
            if (index === indiceCentro) card.classList.add('central-card');
            else if (index === indiceCentro - 1) card.classList.add('left-central-card');
            else if (index === indiceCentro + 1) card.classList.add('right-central-card');
        }

        // Verifica se tem imagem, senão usa placeholder
        const imgPath = item.imagem || 'img/reciclagem.png';

        card.innerHTML = `
            <h3>${item.titulo}</h3>
            <p class="card-category"><b>Categoria:</b> ${item.categoria}</p>
            <div class="card-image">
                <img src="${imgPath}" alt="${item.titulo}">
            </div>
            <p class="card-date"><b>Data:</b> ${item.data}</p>
            <p class="card-description">${item.descricao}</p>
            <button onclick="clickGostei(${item.id})" class="like-btn">
                ${item.curtido ? 'Descurtir' : 'Curtir'} (${item.curtidas})
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

// CURTIDAS
function clickGostei(id) {
    const item = dados.find(item => item.id === id);
    if (item) {
        if (!item.curtido) {
            item.curtidas++;
            item.curtido = true;
        } else {
            item.curtidas--;
            item.curtido = false;
        }
        salvarNoStorage();
        atualizarLista(listaVisual);
    }
}

// NAVEGAÇÃO
function moverDireita() {
    if(listaVisual.length > 0) {
        const primeiro = listaVisual.shift();
        listaVisual.push(primeiro);
        renderizarCards(listaVisual);
    }
}

function moverEsquerda() {
    if(listaVisual.length > 0) {
        const ultimo = listaVisual.pop();
        listaVisual.unshift(ultimo);
        renderizarCards(listaVisual);
    }
}

document.getElementById("next").addEventListener("click", moverDireita);
document.getElementById("prev").addEventListener("click", moverEsquerda);

// Inicializa
renderizarCards(listaVisual);