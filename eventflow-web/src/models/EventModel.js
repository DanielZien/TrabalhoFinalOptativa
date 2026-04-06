import { API_BASE } from "../config/api";

export const EventModel = {
     async buscarEventos(pagina) {
        try {
            // Adicionamos o ?page= no final da URL
            const resposta = await fetch(`${API_BASE}/events?page=${pagina}&limit=6`);
            const token = localStorage.getItem('token');
            console.log(token);

            if (!resposta.ok) {
                throw new Error('Mermão deu erro ao buscar eventos da API');
            }

            const dados = await resposta.json();
            console.log(dados)

            // Mapeia os eventos 
            const eventosMapeados = dados.events.map(eventoAPI => {
                let precoFormatado = "Gratuito";
                if (eventoAPI.preco && eventoAPI.preco > 0) {
                    precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
                }

                const dataFormatada = new Date(eventoAPI.data).toLocaleDateString('pt-BR');

                let imagemUrl = eventoAPI.imagem ? eventoAPI.imagem.split('|')[0] : ""; 
                if (imagemUrl.startsWith('file://') || !imagemUrl) {
                    imagemUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }

                let localFormatado = eventoAPI.localizacao.split(' | ')[0];

                return {
                    id: eventoAPI.id,
                    titulo: eventoAPI.titulo,
                    categoria: eventoAPI.categoria,
                    data: dataFormatada,
                    local: localFormatado,
                    preco: precoFormatado,
                    imagem: imagemUrl
                };
            });

            // RETORNA AGORA A LISTA E O TOTAL!
            return {
                lista: eventosMapeados,
                totalGeral: dados.pagination.total,
                paginaAtual: dados.pagination.page,
                totalPaginas: dados.pagination.pages
            };

        } catch (erro) {
            console.error("Falha na comunicação com a API: ", erro);
            // Em caso de erro, retorna tudo zerado
            return { lista: [], totalGeral: 0 };
        }
    },

     async buscarEventoPorId(id) {
        try {
            //a rota geral que funciona perfeitamente
            const resposta = await fetch(`${API_BASE}/events`);
            
            if (!resposta.ok) {
                throw new Error('Erro ao buscar a lista de eventos');
            }

            const dados = await resposta.json();

  
            const eventoAPI = dados.events.find(evento => evento.id == id);

            if (!eventoAPI) {
                throw new Error('Evento não encontrado na lista');
            }

            //Formatação do Preço
            let precoFormatado = "Gratuito";
            if (eventoAPI.preco && eventoAPI.preco > 0) {
                precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
            }

            const dataObj = new Date(eventoAPI.data);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR');
            
            const horaFormatada = new Date(eventoAPI.hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            //Tratando a localização
            let localText = eventoAPI.localizacao;
            let latLng = "";
            if (localText && localText.includes('|')) {
                const partes = localText.split('|');
                localText = partes[0].trim();
                latLng = partes[1].trim(); 
            }

            return {
                id: eventoAPI.id,
                titulo: eventoAPI.titulo,
                descricao: eventoAPI.descricao || "Sem descrição disponível.",
                dataCompleta: `${dataFormatada} às ${horaFormatada}`,
                localizacao: localText,
                coordenadas: latLng,
                preco: precoFormatado,
                organizador: eventoAPI.creator || { nome: "Não informado", email: "-", telefone: "-" },
                imagem: eventoAPI.imagem 
            };

        } catch (erro) {
            console.error("Erro ao buscar detalhes do evento:", erro);
            return null;
        }
    },

    //Tentando o cadastro 
     async criarEvento(payload) {
        try {
            // Pega o token salvo no login
            const token = localStorage.getItem('token'); 
            console.log(token);

            const resposta = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!resposta.ok) {
                const erroData = await resposta.json();
                throw new Error(erroData.message || 'Erro ao criar evento na API');
            }

            return await resposta.json();
        } catch (erro) {
            console.error("Erro no POST:", erro);
            throw erro; 
        }
    }
}