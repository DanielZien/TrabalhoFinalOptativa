// src/controllers/HomeController.jsx
import React, { useState, useEffect } from 'react';
import { EventModel } from '../models/EventModel';
import HomeView from '../views/HomeView';

export default function HomeController() {
    // Estados para gerenciar as listas e a pesquisa
    const [eventosObtidos, setEventosObtidos] = useState([]); // A lista original da API
    const [eventosExibidos, setEventosExibidos] = useState([]); // A lista que muda com o filtro
    const [totalGeral, setTotalGeral] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [termoPesquisa, setTermoPesquisa] = useState('');

    // Busca os dados na API apenas quando a tela abre
    useEffect(() => {
        async function carregarDados() {
            setCarregando(true);
            const resultado = await EventModel.buscarEventos();
            
            if (resultado && resultado.lista) {
                setEventosObtidos(resultado.lista);
                setEventosExibidos(resultado.lista); // Começa mostrando todos
                setTotalGeral(resultado.totalGeral);
            }
            setCarregando(false);
        }

        carregarDados();
    }, []); 

    // Efeito Mágico do React: Roda sozinho toda vez que 'termoPesquisa' mudar
    useEffect(() => {
        if (termoPesquisa === '') {
            setEventosExibidos(eventosObtidos); // Se limpar a busca, volta tudo
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
        />
    );
}