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
}