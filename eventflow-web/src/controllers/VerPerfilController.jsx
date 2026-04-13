import React, { useState, useEffect } from 'react';
import VerPerfilView from '../views/VerPerfilView';
import { useNavigate } from 'react-router-dom';

export default function VerPerfilController() {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const carregarPerfil = async () => {
            const token = localStorage.getItem('token');
            
            // Se não tem token, joga pro login
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Bate direto na API original para ler os dados
                const resposta = await fetch('https://event-flow-vercel.vercel.app/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    setUsuario(dados);
                } else {
                    setErro('Não foi possível carregar as informações do perfil.');
                }
            } catch (error) {
                setErro('Erro de conexão com o servidor.');
            } finally {
                setCarregando(false);
            }
        };

        carregarPerfil();
    }, [navigate]);

    return (
        <VerPerfilView 
            usuario={usuario} 
            carregando={carregando} 
            erro={erro} 
        />
    );
}