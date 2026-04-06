import React, { useState, useEffect } from 'react';
import { EventModel } from '../models/EventModel';
import HomeView from '../views/HomeView';

export default function HomeController() {
    const [eventosObtidos, setEventosObtidos] = useState([]);
    const [eventosExibidos, setEventosExibidos] = useState([]);
    const [totalGeral, setTotalGeral] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    
    // Novos estados de Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // O useEffect agora observa a variável 'paginaAtual'
    useEffect(() => {
        async function carregarDados() {
            setCarregando(true);
            // Passa a página atual para o Model
            const resultado = await EventModel.buscarEventos(paginaAtual);
            
            if (resultado && resultado.lista) {
                setEventosObtidos(resultado.lista);
                setEventosExibidos(resultado.lista);
                setTotalGeral(resultado.totalGeral);
                
                // Salva a página atual e o limite que a API devolveu
                setPaginaAtual(resultado.paginaAtual);
                setTotalPaginas(resultado.totalPaginas);
            }
            setCarregando(false);
        }

        carregarDados();
    }, [paginaAtual]); // <-- Toda vez que a página mudar, a API será chamada novamente

    useEffect(() => {
        if (termoPesquisa === '') {
            setEventosExibidos(eventosObtidos);
        } else {
            const filtrados = eventosObtidos.filter(ev => 
                ev.titulo.toLowerCase().includes(termoPesquisa.toLowerCase()) 
            );
            setEventosExibidos(filtrados);
        }
    }, [termoPesquisa, eventosObtidos]);

    return (
        <HomeView 
            eventos={eventosExibidos} 
            totalGeral={totalGeral}
            carregando={carregando} 
            termoPesquisa={termoPesquisa}
            setTermoPesquisa={setTermoPesquisa}
            // Passamos as propriedades de paginação para a View
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            setPaginaAtual={setPaginaAtual}
        />
    );
}