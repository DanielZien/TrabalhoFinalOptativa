//Aqui vamos pegar do model e injetar do model no html
class EventController {
    //Vou ter que guarda isso aqui em uma lista por problemas de API
    static todosEventosAPI = [];

    static async inicializar() {
        //Pegar os dados da API
        const resultadoApi = await EventModel.buscarEventos();

        this.todosEventosAPI = resultadoApi.lista || resultadoApi;

        this.renderizarEventos(this.todosEventosAPI);

        const inputPesquisa = document.getElementById('input-pesquisa');
        if (inputPesquisa) {
            inputPesquisa.addEventListener('input', (evento) => {
                const termoDigitado = evento.target.value.toLowerCase();

                //Filtra os eventos aqui, vou usar o titulo
                const eventosFiltrados = this.todosEventosAPI.filter(ev => 
                    ev.titulo.toLowerCase().includes(termoDigitado) 
                );

                this.renderizarEventos(eventosFiltrados);
            });
        }
    }


    //Fazer as coisas sem React ou framework decente da nesses trabalhos de jumento aqui
    static renderizarEventos(listaParaExibir) {
        const listaHtml = document.getElementById('lista-eventos');
        listaHtml.innerHTML = ''; //Deixar limpo

        //Preciso atualizar o contador de tela( eu tenho que subistituir isso pela paginação o preguiça)
        const qtdMostrando = document.getElementById('qtd-mostrando');
        if (qtdMostrando) qtdMostrando.innerText = listaParaExibir.length //If com uma linha apenas

        //Se não achar nada
        if (listaParaExibir.length == 0 ) {
            listaHtml.innerHTML = `
                <div class="col-12 text-center mt-5">
                    <p class="text-muted">Nenhum evento encontrado para essa pesquisa.</p>
                </div>
            `;
            return;

        };
        listaParaExibir.forEach(evento=> {
            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';

            //Montando o card no DOM
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

    static async listarEventos() {
        
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
    EventController.inicializar();
};