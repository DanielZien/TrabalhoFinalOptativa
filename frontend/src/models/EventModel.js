class EventModel {
    static async buscarEventos() {
        try {
            const resposta = await fetch(API_BASE + '/events');

            if (!resposta.ok) {
                throw new Error('Mermão deu erro ao buscar eventos da API');
            }

            const dados = await resposta.json();

            // Mapeia os eventos (igualzinho a gente já fez)
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
                totalGeral: dados.pagination.total
            };

        } catch (erro) {
            console.error("Falha na comunicação com a API: ", erro);
            // Em caso de erro, retorna tudo zerado
            return { lista: [], totalGeral: 0 };
        }
    }

    static async buscarEventoPorId(id) {
        try {
            // 1. Drible da vaca: chamamos a rota geral que sabemos que funciona perfeitamente
            const resposta = await fetch(`${API_BASE}/events`);
            
            if (!resposta.ok) {
                throw new Error('Erro ao buscar a lista de eventos');
            }

            const dados = await resposta.json();

            // 2. Procuramos o evento específico pelo ID na lista
            // Usamos == em vez de === porque o id da URL é texto e o da API é número
            const eventoAPI = dados.events.find(evento => evento.id == id);

            if (!eventoAPI) {
                throw new Error('Evento não encontrado na lista');
            }

            // 3. Formatação do Preço
            let precoFormatado = "Gratuito";
            if (eventoAPI.preco && eventoAPI.preco > 0) {
                precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
            }

            // 4. Formatação da Data e Hora (Usando os campos que você mostrou no JSON)
            const dataObj = new Date(eventoAPI.data);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR');
            
            // Note que usei a hora_inicio aqui para ficar bem preciso
            const horaFormatada = new Date(eventoAPI.hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // 5. Tratando a localização
            let localText = eventoAPI.localizacao;
            let latLng = "";
            if (localText && localText.includes('|')) {
                const partes = localText.split('|');
                localText = partes[0].trim();
                latLng = partes[1].trim(); 
            }

            // 6. Retorna tudo mastigadinho pro Controller
            return {
                id: eventoAPI.id,
                titulo: eventoAPI.titulo,
                descricao: eventoAPI.descricao || "Sem descrição disponível.",
                dataCompleta: `${dataFormatada} às ${horaFormatada}`,
                localizacao: localText,
                coordenadas: latLng,
                preco: precoFormatado,
                organizador: eventoAPI.creator || { nome: "Não informado", email: "-", telefone: "-" }
            };

        } catch (erro) {
            console.error("Erro ao buscar detalhes do evento:", erro);
            return null;
        }
    }
}