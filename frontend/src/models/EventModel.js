class EventModel {
    static async buscarEventos() {
        try {
            const resposta = await fetch(API_BASE + '/events');

            if (!resposta.ok) {
                throw new Error('Mermão deu erro ao buscar eventos da API');
            }

            const dados = await resposta.json();

            // O SEGREDO ESTÁ AQUI: dados.events.map em vez de dados.map
            return dados.events.map(eventoAPI => {
                
                // Formatação do Preço
                let precoFormatado = "Gratuito";
                if (eventoAPI.preco && eventoAPI.preco > 0) {
                    precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
                }

                // Formatação da Data (de 2025-11-15T20... para DD/MM/YYYY)
                const dataFormatada = new Date(eventoAPI.data).toLocaleDateString('pt-BR');

                // Ajuste da Imagem (Trata os caminhos file:// do React Native)
                let imagemUrl = eventoAPI.imagem ? eventoAPI.imagem.split('|')[0] : ""; 
                if (imagemUrl.startsWith('file://') || !imagemUrl) {
                    imagemUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }

                // Limpando o endereço (Tirando a latitude/longitude do final)
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
        } catch (erro) {
            console.error("Falha na comunicação com a API: ", erro);
            return [];
        }
    }
}