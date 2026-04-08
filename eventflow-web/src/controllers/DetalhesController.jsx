import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EventModel } from '../models/EventModel';
import DetalhesView from '../views/DetalhesView';

export default function DetalhesController() {
    // Tenta pegar o ID do formato /detalhes/3
    const { id: idParam } = useParams(); 
    
    // Tenta pegar o ID do formato antigo /detalhes?id=3
    const [searchParams] = useSearchParams();
    const idQuery = searchParams.get('id'); 

    // Define qual ID usar (o que estiver disponível)
    const id = idParam || idQuery;

    const [evento, setEvento] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregar() {
            setCarregando(true);
            setErro('');

            try {
                const dadosEvento = await EventModel.buscarEventoPorId(id);
                
                if (!dadosEvento) {
                    setErro("Erro ao carregar o evento. Ele pode ter sido excluído.");
                } else {
                    setEvento(dadosEvento);
                }
            } catch (error) {
                setErro("Ocorreu um erro ao conectar com o servidor.");
            } finally {
                // Isso garante que o spinner vai sumir, dando certo ou errado
                setCarregando(false);
            }
        }

        // Só dispara a busca se o React conseguiu achar um ID na URL
        if (id) {
            carregar();
        } else {
            // Se não tem ID na URL, tira o carregamento e avisa o erro
            setCarregando(false);
            setErro("Nenhum evento foi selecionado.");
        }
    }, [id]);

    return (
        <DetalhesView 
            evento={evento} 
            carregando={carregando} 
            erro={erro} 
        />
    );
}