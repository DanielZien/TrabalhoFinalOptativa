import React, { useEffect } from 'react';
import RegistroView from '../views/RegistroView';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EventModel } from '../models/EventModel';
import { useEventoForm } from '../hooks/useEventoForm';

export default function EditarEventoController() {
    const { estados, acoes } = useEventoForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    // Carrega e desmembra os dados do evento
    useEffect(() => {
        if (!editId) return;

        async function carregar() {
            const ev = await EventModel.buscarEventoPorId(editId);
            if (!ev) return;

            acoes.setTitulo(ev.titulo);
            if (ev.categoria) acoes.setCategoria(ev.categoria);
            
            if (ev.descricao && ev.descricao !== "Sem descrição disponível.") {
                let descLimpa = ev.descricao;
                if (descLimpa.includes("||MANUAL||")) {
                    descLimpa = descLimpa.split("||MANUAL||")[0].trim();
                }
                acoes.setDescricao(descLimpa);
            }
            
            if (ev.preco && ev.preco !== 'Gratuito') acoes.setPreco(ev.preco.replace('R$ ', '').replace(',', '.'));

            if (ev.dataBruta) {
                try { acoes.setData(new Date(ev.dataBruta).toISOString().split('T')[0]); } catch (e) { }
            }
            if (ev.horaInicioBruta) {
                try { acoes.setHoraInicio(new Date(ev.horaInicioBruta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); } catch (e) { }
            }
            if (ev.horaFimBruta) {
                try { acoes.setHoraFim(new Date(ev.horaFimBruta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); } catch (e) { }
            }

            // Desmembrando a String Maluca do Endereço
            if (ev.localizacao) {
                let enderecoCompleto = ev.localizacao;

                if (enderecoCompleto.includes('|')) {
                    enderecoCompleto = enderecoCompleto.split('|')[0].trim();
                }

                const partes = enderecoCompleto.split(',').map(p => p.trim());

                if (partes.length >= 4) {
                    acoes.setUf(partes.pop());
                    acoes.setCidade(partes.pop());
                    acoes.setBairro(partes.pop());

                    const ruaENumero = partes.join(', ');
                    const pedacosRua = ruaENumero.split(' ');
                    const possivelNumero = pedacosRua.pop(); 

                    if (!isNaN(possivelNumero) || possivelNumero.toLowerCase() === 's/n') {
                        acoes.setNumero(possivelNumero);
                        acoes.setRua(pedacosRua.join(' '));
                    } else {
                        acoes.setRua(ruaENumero);
                    }
                } else {
                    acoes.setRua(enderecoCompleto);
                }
            }
            
            if (ev.coordenadas) acoes.setCoordenadas(ev.coordenadas);
            if (ev.imagem) acoes.setImagemAntiga(ev.imagem);
        }
        carregar();
    }, [editId]);

    const salvarEdicao = async (e) => {
        e.preventDefault();
        acoes.setSalvando(true);

        try {
            // 1. DELETA O ANTIGO (Sua regra de negócio necessária)
            const resultadoDelete = await EventModel.excluirEvento(editId);
            if (!resultadoDelete.sucesso) {
                throw new Error(`Falha ao substituir o evento: ${resultadoDelete.mensagem}`);
            }

            // 2. RECIA O NOVO
            const dataIso8601 = new Date(`${estados.data}T${estados.horaInicio}:00`).toISOString();

            let localizacaoString = '';
            if (estados.cep || estados.numero) {
                localizacaoString = `${estados.rua} ${estados.numero}, ${estados.bairro}, ${estados.cidade}, ${estados.uf}`;
            } else {
                localizacaoString = estados.rua;
            }

            if (estados.coordenadas) {
                localizacaoString += ` | ${estados.coordenadas[0]},${estados.coordenadas[1]}`;
            }

            const formData = new FormData();
            formData.append('titulo', estados.titulo);
            formData.append('descricao', estados.descricao);
            formData.append('data', dataIso8601);
            formData.append('localizacao', localizacaoString);
            formData.append('hora_inicio', estados.horaInicio);
            formData.append('hora_fim', estados.horaFim);
            formData.append('categoria', estados.categoria);
            formData.append('preco', parseFloat(estados.preco));

            if (estados.arquivosImagem.length === 0 && estados.imagemAntiga) {
                formData.append('imagem_antiga', estados.imagemAntiga);
            } else {
                estados.arquivosImagem.forEach(arquivo => {
                    formData.append('imagens', arquivo);
                });
            }

            if (estados.arquivoManual) {
                formData.append('manual', estados.arquivoManual);
            }

            const token = localStorage.getItem('token') || '';
            const resposta = await fetch('http://localhost:8080/api/bff/eventos', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!resposta.ok) {
                const erroTxt = await resposta.text();
                throw new Error(erroTxt);
            }

            // alert("Evento editado com sucesso!");
            navigate('/home');

        } catch (erro) {
            alert("Erro ao salvar: " + erro.message);
        } finally {
            acoes.setSalvando(false);
        }
    };

    return (
        <RegistroView
            isEdicao={true}
            estados={estados}
            acoes={{ ...acoes, salvarEvento: salvarEdicao }}
        />
    );
}