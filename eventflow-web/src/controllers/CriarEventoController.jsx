import React from 'react';
import RegistroView from '../views/RegistroView';
import { useNavigate } from 'react-router-dom';
import { useEventoForm } from '../hooks/useEventoForm'; // Ajuste o caminho conforme sua pasta

export default function CriarEventoController() {
    const { estados, acoes } = useEventoForm();
    const navigate = useNavigate();

    const salvarEvento = async (e) => {
        e.preventDefault();
        acoes.setSalvando(true);

        try {
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

            estados.arquivosImagem.forEach(arquivo => {
                formData.append('imagens', arquivo);
            });

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

            // alert("Sucesso! Evento salvo no sistema!");
            navigate('/home');

        } catch (erro) {
            alert("Erro ao salvar: " + erro.message);
        } finally {
            acoes.setSalvando(false);
        }
    };

    return (
        <RegistroView
            isEdicao={false}
            estados={estados}
            acoes={{ ...acoes, salvarEvento }}
        />
    );
}