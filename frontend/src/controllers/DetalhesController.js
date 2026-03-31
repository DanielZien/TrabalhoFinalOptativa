class DetalhesController {
    static async carregarDetalhes() {
        const params = new URLSearchParams(window.location.search);
        const idEvento = params.get('id');

        if (!idEvento) {
            alert("Evento não encontrado!");
            window.location.href = 'index.html';
            return;
        }

        try {
            const evento = await EventModel.buscarEventoPorId(idEvento);

            if (!evento) {
                alert("Erro ao carregar o evento. Ele pode ter sido excluído.");
                window.location.href = 'index.html';
                return;
            }
            // CARROSSEL DE IMAGENS (Ia pra ajudar nissso aqui)
            const carrosselContainer = document.getElementById('evento-carrossel');
            const carrosselInner = document.getElementById('carrossel-inner');

            if (evento.imagem) {
                // Separa as imagens pelo "|" (pipe)
                const urlsImagens = evento.imagem.split('|').filter(url => url.trim() !== "");
                
                if (urlsImagens.length > 0) {
                    let htmlImagens = '';
                    urlsImagens.forEach((url, index) => {
                        htmlImagens += `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${url}" class="d-block w-100" alt="Imagem do Evento ${index + 1}">
                            </div>
                        `;
                    });
                    if (carrosselInner) carrosselInner.innerHTML = htmlImagens;
                    if (carrosselContainer) carrosselContainer.classList.remove('d-none');
                }
            }

            // INJETANDO TEXTOS 
            document.getElementById('detalhe-titulo').innerText = evento.titulo;
            document.getElementById('detalhe-descricao').innerText = evento.descricao;
            document.getElementById('detalhe-data').innerText = evento.dataCompleta;
            document.getElementById('detalhe-local').innerText = evento.localizacao;
            document.getElementById('detalhe-preco').innerText = evento.preco;

            // ORGANIZADOR
            document.getElementById('org-nome').innerText = evento.organizador.nome;
            document.getElementById('org-email').innerText = evento.organizador.email;
            document.getElementById('org-telefone').innerText = evento.organizador.telefone;

            // MAPA 
            const mapaContainer = document.getElementById('mapa-container');
            if (mapaContainer) {
                // Se o evento tem coordenadas reais do JSON, usamos elas, senão usamos o texto da rua
                const queryMapa = evento.coordenadas ? evento.coordenadas : evento.localizacao;
                
                // URL oficial e garantida do Google Maps Iframe
                const urlIframe = `https://maps.google.com/maps?q=${encodeURIComponent(queryMapa)}&t=m&z=15&output=embed`;
                
                mapaContainer.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        style="border:0;" 
                        src="${urlIframe}">
                    </iframe>
                `;
            }

            //EXIBIÇÃO
            document.getElementById('loader').classList.add('d-none');
            document.getElementById('conteudo-evento').classList.remove('d-none');

        } catch (erro) {
            console.error("Erro na tela de detalhes:", erro);
            alert("Ocorreu um erro ao montar a tela de detalhes.");
        }
    }
}

window.onload = () => {
    DetalhesController.carregarDetalhes();
};