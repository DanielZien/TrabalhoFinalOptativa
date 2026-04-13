import React, { useState, useEffect } from 'react';
import { EventModel } from '../models/EventModel';
import HomeView from '../views/HomeView';

export default function HomeController() {
    const [eventosObtidos, setEventosObtidos] = useState([]);
    const [eventosExibidos, setEventosExibidos] = useState([]);
    const [totalGeral, setTotalGeral] = useState(0);
    const [carregando, setCarregando] = useState(true);
    
    // Estados de Filtro
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
    
    // Estados de Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // O useEffect agora observa a variável 'paginaAtual'
    useEffect(() => {
        async function carregarDados() {
            setCarregando(true);
            const resultado = await EventModel.buscarEventos(paginaAtual);
            
            if (resultado && resultado.lista) {
                setEventosObtidos(resultado.lista);
                setEventosExibidos(resultado.lista);
                setTotalGeral(resultado.totalGeral);
                
                // Extrai as categorias únicas dos eventos carregados para montar o filtro
                const categoriasUnicas = [...new Set(resultado.lista.map(ev => ev.categoria).filter(Boolean))];
                setCategoriasDisponiveis(categoriasUnicas);

                setPaginaAtual(resultado.paginaAtual);
                setTotalPaginas(resultado.totalPaginas);
            }
            setCarregando(false);
        }

        carregarDados();
    }, [paginaAtual]); 

    // Efeito unificado: Filtra por texto e por categoria ao mesmo tempo no Front-end!
    useEffect(() => {
        let filtrados = eventosObtidos;

        // 1. Aplica o filtro de texto (se houver)
        if (termoPesquisa !== '') {
            filtrados = filtrados.filter(ev => 
                ev.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) 
            );
        }

        // 2. Aplica o filtro de categoria (se houver)
        if (categoriaSelecionada !== '') {
            filtrados = filtrados.filter(ev => ev.categoria === categoriaSelecionada);
        }

        setEventosExibidos(filtrados);
    }, [termoPesquisa, categoriaSelecionada, eventosObtidos]);

    const habilitarModoAdmin = localStorage.getItem('role')?.toUpperCase() === 'ADMIN';

    const aoDeletarEvento = async (id) => {
        if (window.confirm("Você tem certeza que deseja excluir esse evento permanentemente?")) {
            const resposta = await EventModel.excluirEvento(id);
            if (resposta.sucesso) {
                // alert("Evento excluído com sucesso!");
                setEventosObtidos(prev => prev.filter(e => e.id !== id));
            } else {
                alert(resposta.mensagem);
            }
        }
    };

    return (
        <HomeView 
            eventos={eventosExibidos} 
            totalGeral={totalGeral}
            carregando={carregando} 
            termoPesquisa={termoPesquisa}
            setTermoPesquisa={setTermoPesquisa}
            
            // Novas propriedades do filtro de categoria
            categoriaSelecionada={categoriaSelecionada}
            setCategoriaSelecionada={setCategoriaSelecionada}
            categoriasDisponiveis={categoriasDisponiveis}

            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            setPaginaAtual={setPaginaAtual}
            
            habilitarModoAdmin={habilitarModoAdmin}
            aoDeletarEvento={aoDeletarEvento}
        />
    );
}