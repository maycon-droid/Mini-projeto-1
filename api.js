const API_URL = 'http://localhost:3000/corpos';

async function getCorpos() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar dados');
    return response.json();
}

async function createCorpo(corpo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
    });
    if (!response.ok) throw new Error('Erro ao criar');
    return response.json();
}

async function deleteCorpo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao deletar');
    return response.json();
}

async function updateCorpo(id, corpo) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
    });
    if (!response.ok) throw new Error('Erro ao atualizar');
    return response.json();
}