//Aqui vamos pegar do model e injetar do model no html
class EventController {
    static async listarEventos() {
        const resultadoApi = await EventModel.buscarEventos();

        // Separamos a lista de eventos e o número total
        const eventos = resultadoApi.lista;
        const totalApi = resultadoApi.totalGeral;

        const listaHtml = document.getElementById('lista-eventos');
        listaHtml.innerHTML = '';

        // INJETANDO OS NÚMEROS NA TELA:
        document.getElementById('qtd-mostrando').innerText = eventos.length;
        document.getElementById('qtd-total').innerText = totalApi;

        eventos.forEach(evento => {
            const card = document.createElement('div');
            // Usando as classes do Bootstrap para montar o card
            card.className = 'col-12 col-md-6 col-lg-4';

            card.innerHTML = `
                <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <img src="${evento.imagem}" class="card-img-top" alt="Banner do evento" style="height: 180px; object-fit: cover;">
                    
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h6 class="card-title fw-bold text-dark text-truncate mb-1">${evento.titulo}</h6>
                            <span class="text-muted small">${evento.data}</span>
                            <p class="text-muted small mb-3">${evento.categoria}</p>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-end mt-2">
                            <div>
                                <span class="d-block text-muted small mb-0" style="line-height: 1;">Ingresso</span>
                                <strong class="text-dark">${evento.preco}</strong>
                            </div>
                            <button class="btn btn-custom-blue px-3 py-1" onclick="window.location.href='detalhes.html?id=${evento.id}'">
                            Mais Detalhes <i class="bi bi-caret-right-fill small"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            listaHtml.appendChild(card);
        });
    }
}

window.onload = () => {
    EventController.listarEventos();
};