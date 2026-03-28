//Vamos lá aprender a usar essa bagaça

//Um import porque eu não sou tão macaco
import { API_BASE } from "../config/api";
class EventModel {
    //Simulando uma requisição
    static async buscarEventos() {
        try {
            //Chamando a API antiga que usei no App
            const resposta = await fetch(API_BASE+'/events');

            if (!resposta.ok) {
                throw new Error('Mermão deu erro ao buscar eventos da API');
            }

            const dados = await resposta.json();

            //Tentando mapear esse JSON
            return dados.map(eventoAPI => {
                let precoFormatado = "Gratuito";
                if (eventoAPI.preco && eventoAPI.preco > 0) {
                    precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
                }
                return {
                    id: eventoAPI.id,
                    titulo: eventoAPI.titulo,
                    categoria: eventoAPI.categoria,
                }
            })
        } catch (erro) {
            console.error("Falha na comunicação com a API: ", erro);
            return [];
        }
    }
}