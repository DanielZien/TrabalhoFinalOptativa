class DetalhesController {
    static async carregarDetalhes() {
        // 1. Pega o ID da URL (ex: detalhes.html?id=3)
        const params = new URLSearchParams(window.location.search);
        const idEvento = params.get('id');

        if (!idEvento) {
            alert("Evento não encontrado!");
            window.location.href = 'index.html';
            return;
        }

        // 2. Busca os dados na API através do Model
        const evento = await EventModel.buscarEventoPorId(idEvento);

        if (!evento) {
            alert("Erro ao carregar o evento. Ele pode ter sido excluído.");
            window.location.href = 'index.html';
            return;
        }

        // 3. Injeta os dados no HTML
        document.getElementById('detalhe-titulo').innerText = evento.titulo;
        document.getElementById('detalhe-data').innerText = evento.dataCompleta;
        document.getElementById('detalhe-descricao').innerText = evento.descricao;
        document.getElementById('detalhe-local').innerText = evento.localizacao;
        document.getElementById('detalhe-preco').innerText = evento.preco;
        
        // Injeta Organizador
        document.getElementById('org-nome').innerText = evento.organizador.nome;
        document.getElementById('org-email').innerText = evento.organizador.email;
        document.getElementById('org-telefone').innerText = evento.organizador.telefone;

        // 4. Monta o Mapa (Se a API enviou coordenadas, usamos elas. Se não, busca pelo texto do endereço)
        const mapaContainer = document.getElementById('mapa-container');
        let queryMapa = evento.coordenadas ? evento.coordenadas : evento.localizacao;
        // Cria um iframe embed do Google Maps
        mapaContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border:0;" 
                referrerpolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=${encodeURIComponent(queryMapa)}&t=m&z=15&output=embed">
            </iframe>
        `;

        // 5. Esconde o loader e mostra o conteúdo
        document.getElementById('loader').classList.add('d-none');
        document.getElementById('conteudo-evento').classList.remove('d-none');
    }
}

// Quando a página carregar, chama o Controller
window.onload = () => {
    DetalhesController.carregarDetalhes();
};