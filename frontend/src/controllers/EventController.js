//Aqui vamos pegar do model e injetar do model no html
class EventController {
    static async listarEventos() {
        //Peço os dados em JSON da API
        const eventos = await EventModel.buscarEventos();
        
        //Pegando a div que vai ficar esses dados
        const listaHtml = document.getElementById("lista-eventos");
        listaHtml.innerHTML =  "";

        //Fazer uma laço pra cada item 
        eventos.forEach(evento => {
            const card = document.createElement("div");
            //Tenho que subistituir isso aqui por um class CSS
            card.style.border = "1px solid #ccc";
            card.style.padding = "10px";
            card.style.margin = "10px 0";
            card.style.borderRadius = "5px";


            card.innerHTML = `
                <h3>${evento.titulo}</h3>
                <p><strong>Categoria:</strong> ${evento.categoria}</p>
                <p><strong>Datas:</strong> ${evento.dataInicio} <br> ${evento.dataFim}</p>
                <p><strong>Local:</strong> ${evento.local}</p>
                <p><strong>Descricao:</strong> ${evento.descricao}</p>
                <button onclick="alert('Vai abrir detalhes do evento ${evento.titulo}">Ver Detalhes</button>
            `;

            listaHtml.appendChild(card);
        });
    }
}

window.onload = () => {
    EventController.listarEventos();
}