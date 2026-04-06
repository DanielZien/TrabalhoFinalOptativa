import React, { useState, useEffect } from 'react';
import { EventModel } from '../models/EventModel';
import HomeView from '../views/HomeView';

export default function HomeController() {
    const [eventos, setEventos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            setCarregando(true);
            const resultado = await EventModel.buscarEventos();
            
            // Agora o Controller lê a propriedade 'lista' que o seu Model retorna
            if (resultado && resultado.lista) {
                setEventos(resultado.lista);
            }
            setCarregando(false);
        }

        carregarDados();
    }, []); 

    return (
        <HomeView 
            eventos={eventos} 
            carregando={carregando} 
        />
    );
}