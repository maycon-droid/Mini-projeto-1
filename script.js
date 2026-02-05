let dados = [];

const container = document.getElementById('card-container');
const rankingContainer = document.getElementById('ranking-container');
const formulario = document.getElementById('form-novo-card');
const formularioEdicao = document.getElementById('form-editar-card');
const inputPesquisa = document.getElementById('search');
const filtroSelect = document.getElementById('filtro-select');
const modalEdicao = document.getElementById('modal-editar');

async function carregarDados() {
    try {
        container.innerHTML = '<p style="text-align:center; width:100%">Carregando dados...</p>';
        dados = await getCorpos();
        atualizarLista(dados);
        renderizarRanking();
    } catch (erro) {
        container.innerHTML = '<p style="text-align:center; color:red">Erro ao carregar dados do servidor.</p>';
        console.error(erro);
    }
}

function atualizarLista(lista) {
    container.innerHTML = '';
    
    if(lista.length === 0) {
        container.innerHTML = '<p>Nenhuma ação encontrada.</p>';
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let imagemSrc = (item.imagem && item.imagem.trim() !== "") ? item.imagem : 'https://placehold.co/300x180?text=Sem+Imagem';

        card.innerHTML = `
            <div class="card-header">
                <span class="categoria-tag">${item.categoria}</span>
                <img src="${imagemSrc}" alt="${item.titulo}" onerror="this.src='https://placehold.co/300x180?text=Erro+Imagem'">
                <h3>${item.titulo}</h3>
            </div>
            <div class="card-body">
                <p>${item.descricao}</p>
                <p class="card-date"><small>Data: ${item.data}</small></p>
            </div>
            <div class="card-actions">
                <button class="btn-gostei ${item.curtido ? 'liked' : ''}" onclick="clickGostei(${item.id})">
                    <i class="fa-solid fa-heart"></i> <span id="likes-${item.id}">${item.curtidas}</span>
                </button>
                <div>
                    <button class="btn-editar" onclick="abrirModalEdicao(${item.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-deletar" onclick="deletarCard(${item.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderizarRanking() {
    rankingContainer.innerHTML = '';
    const top5 = [...dados].sort((a, b) => b.curtidas - a.curtidas).slice(0, 5);

    top5.forEach(item => {
        const cardRanking = document.createElement('div');
        cardRanking.className = 'ranking-card';
        let imgRanking = (item.imagem && item.imagem.trim() !== "") ? item.imagem : 'https://placehold.co/100?text=...';
        
        cardRanking.innerHTML = `
            <h3>${item.titulo}</h3>
            <img src="${imgRanking}" alt="${item.titulo}" onerror="this.src='https://placehold.co/100?text=Erro'">
            <p><b>${item.curtidas}</b> curtidas</p>
        `;
        rankingContainer.appendChild(cardRanking);
    });
}

function clickGostei(id) {
    const item = dados.find(item => item.id == id);
    if (item) {
        item.curtido = !item.curtido;
        item.curtidas += item.curtido ? 1 : -1;
        atualizarLista(dados);
        renderizarRanking();
        
        updateCorpo(item.id, item).catch(err => console.error("Erro ao salvar like", err));
    }
}

async function deletarCard(id) {
    if (!confirm('Tem certeza que deseja apagar?')) return;

    try {
        await deleteCorpo(id);
        await carregarDados();
    } catch (erro) {
        alert("Não foi possível deletar.");
        console.error(erro);
    }
}

if (formulario) {
    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const btnSubmit = document.getElementById('btn-submit-adicionar');
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Adicionando...";

        const novoItem = {
            titulo: document.getElementById('novo-titulo').value,
            categoria: document.getElementById('nova-categoria').value,
            descricao: document.getElementById('nova-descricao').value,
            imagem: document.getElementById('nova-imagem').value || '',
            data: new Date().toISOString().split('T')[0],
            curtidas: 0,
            curtido: false
        };

        try {
            await addCorpo(novoItem);
            formulario.reset();
            await carregarDados();
        } catch (erro) {
            alert("Erro ao adicionar card!");
            console.error(erro);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "➕ Adicionar Card";
        }
    });
}

function filtrarCards() {
    const termo = inputPesquisa.value.toLowerCase();
    const categoria = filtroSelect.value;

    const filtrados = dados.filter(item => {
        const matchTexto = item.titulo.toLowerCase().includes(termo) || item.descricao.toLowerCase().includes(termo);
        const matchCategoria = categoria === 'Todos' || item.categoria === categoria;
        return matchTexto && matchCategoria;
    });

    atualizarLista(filtrados);
}

inputPesquisa.addEventListener('input', filtrarCards);
filtroSelect.addEventListener('change', filtrarCards);

function abrirModalEdicao(id) {
    const item = dados.find(x => x.id == id);
    if(!item) return;

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-titulo').value = item.titulo;
    document.getElementById('edit-categoria').value = item.categoria;
    document.getElementById('edit-descricao').value = item.descricao;
    document.getElementById('edit-imagem').value = item.imagem || '';

    modalEdicao.style.display = "block";
}

function fecharModalEdicao() {
    modalEdicao.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalEdicao) {
        fecharModalEdicao();
    }
}

formularioEdicao.addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('edit-id').value;
    const btnSalvar = document.getElementById('btn-submit-editar');
    
    btnSalvar.disabled = true;
    btnSalvar.innerText = "Salvando...";

    const itemOriginal = dados.find(x => x.id == id);
    
    const objetoAtualizado = {
        ...itemOriginal,
        titulo: document.getElementById('edit-titulo').value,
        categoria: document.getElementById('edit-categoria').value,
        descricao: document.getElementById('edit-descricao').value,
        imagem: document.getElementById('edit-imagem').value
    };

    try {
        await updateCorpo(id, objetoAtualizado);
        fecharModalEdicao();
        await carregarDados();
        alert("Card atualizado com sucesso!");
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar o card.");
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.innerText = "💾 Salvar Alterações";
    }
});

carregarDados();