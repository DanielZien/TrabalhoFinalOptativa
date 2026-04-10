import { API_BASE } from "../config/api";

export const EventModel = {
     async buscarEventos(pagina) {
        try {
            // Adicionando o ?page= no final da URL
            const resposta = await fetch(`${API_BASE}/events?page=${pagina}&limit=6`);
            const token = localStorage.getItem('token');
            console.log(token);

            if (!resposta.ok) {
                throw new Error('Mermão deu erro ao buscar eventos da API');
            }

            const dados = await resposta.json();
            console.log(dados)

            // Mapeia os eventos utilizando Promise.all para permitir await interno
            const eventosMapeados = await Promise.all(dados.events.map(async eventoAPI => {
                let precoFormatado = "Gratuito";
                if (eventoAPI.preco && eventoAPI.preco > 0) {
                    precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
                }

                const dataFormatada = new Date(eventoAPI.data).toLocaleDateString('pt-BR');

                let imagemUrl = eventoAPI.imagem ? eventoAPI.imagem.split('|')[0] : ""; 
                if (imagemUrl.startsWith('file://') || !imagemUrl) {
                    imagemUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }

                let localText = eventoAPI.localizacao || "";
                let latLngStr = "";
                if (localText.includes('|')) {
                    const partes = localText.split('|');
                    localText = partes[0].trim();
                    latLngStr = partes[1].trim(); 
                }

                let coordenadas = null;
                if (latLngStr) {
                    const coords = latLngStr.split(',');
                    if (coords.length >= 2) {
                        coordenadas = [parseFloat(coords[0]), parseFloat(coords[1])];
                    }
                } else if (localText) {
                    // Fallback: Busca as coordenadas na API Nominatim caso só haja o texto
                    try {
                        const query = `${localText}, Brazil`;
                        const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                        const dataGeo = await resGeo.json();
                        if (dataGeo && dataGeo.length > 0) {
                            coordenadas = [parseFloat(dataGeo[0].lat), parseFloat(dataGeo[0].lon)];
                        }
                    } catch(e) {
                        console.error("Erro no Geocoding Fallback", e);
                    }
                }

                return {
                    id: eventoAPI.id,
                    titulo: eventoAPI.titulo,
                    categoria: eventoAPI.categoria,
                    data: dataFormatada,
                    local: localText,
                    preco: precoFormatado,
                imagem: imagemUrl,
                coordenadas: coordenadas
            };
        }));

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
            // Busca DIRETAMENTE o evento pelo ID na API (muito mais rápido e seguro)
            const resposta = await fetch(`${API_BASE}/events?id=${id}`);
            
            if (!resposta.ok) {
                throw new Error('Erro ao buscar o evento na API');
            }

            const dados = await resposta.json();

            // Como vimos no Swagger, a API devolve um array "events". 
            // Se vier vazio, o evento não existe.
            if (!dados.events || dados.events.length === 0) {
                throw new Error('Evento não encontrado');
            }

            // Pega o primeiro e único evento desse array
            const eventoAPI = dados.events[0];

            // Formatação do Preço
            let precoFormatado = "Gratuito";
            if (eventoAPI.preco && eventoAPI.preco > 0) {
                precoFormatado = `R$ ${eventoAPI.preco.toFixed(2).replace('.', ',')}`;
            }

            // Formatação de Data e Hora
            const dataObj = new Date(eventoAPI.data);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR');
            const horaFormatada = (eventoAPI.hora_inicio);

            let localText = eventoAPI.localizacao || "";
            let latLngStr = "";
            if (localText.includes('|')) {
                const partes = localText.split('|');
                localText = partes[0].trim();
                latLngStr = partes[1].trim(); 
            }

            let coordenadasArray = null;
            if (latLngStr) {
                const coords = latLngStr.split(',');
                if (coords.length >= 2) {
                    coordenadasArray = [parseFloat(coords[0]), parseFloat(coords[1])];
                }
            } else if (localText) {
                // Fallback: Busca as coordenadas na API Nominatim caso só haja o texto
                try {
                    const query = `${localText}, Brazil`;
                    const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                    const dataGeo = await resGeo.json();
                    if (dataGeo && dataGeo.length > 0) {
                        coordenadasArray = [parseFloat(dataGeo[0].lat), parseFloat(dataGeo[0].lon)];
                    }
                } catch(e) {
                    console.error("Erro no Geocoding Fallback", e);
                }
            }

            return {
                id: eventoAPI.id,
                titulo: eventoAPI.titulo,
                descricao: eventoAPI.descricao || "Sem descrição disponível.",
                dataCompleta: `${dataFormatada} às ${horaFormatada}`,
                dataBruta: eventoAPI.data,
                horaInicioBruta: eventoAPI.hora_inicio,
                horaFimBruta: eventoAPI.hora_fim,
                categoria: eventoAPI.categoria,
                localizacao: localText,
                coordenadas: coordenadasArray,
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
    },

    // Funções Administrativas
    async excluirEvento(id) {
        try {
            const token = localStorage.getItem('token'); 
            const resposta = await fetch(`${API_BASE}/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!resposta.ok) {
                throw new Error('Erro ao deletar o evento. Você tem permissão de Admin?');
            }
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro no DELETE:", erro);
            return { sucesso: false, mensagem: erro.message };
        }
    },

    async editarEvento(id, payload) {
        try {
            const token = localStorage.getItem('token'); 
            const resposta = await fetch(`${API_BASE}/events/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!resposta.ok) {
                const erroData = await resposta.json().catch(() => ({}));
                throw new Error(erroData.message || 'Erro ao editar evento na API');
            }

            return { sucesso: true };
        } catch (erro) {
            console.error("Erro no PATCH:", erro);
            return { sucesso: false, mensagem: erro.message };
        }
    }
}