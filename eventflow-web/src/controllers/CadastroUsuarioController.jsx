import React, { useState } from 'react';
import { AuthModel } from '../models/AuthModel';
import CadastroUsuarioView from '../views/CadastroUsuarioView';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuarioController() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    const lidarComSubmit = async (evento) => {
        evento.preventDefault();
        setErro('');

        if (!nome || !email || !telefone || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setCarregando(true);
        const resposta = await AuthModel.fazerCadastro(email, senha, nome, telefone);
        setCarregando(false);

        if (resposta.sucesso) {
            alert(`Sua conta foi criada com sucesso! Faça login para continuar.`);
            navigate('/login');
        } else {
            setErro(resposta.mensagem);
        }
    };

    return (
        <CadastroUsuarioView 
            nome={nome} setNome={setNome}
            email={email} setEmail={setEmail}
            telefone={telefone} setTelefone={setTelefone}
            senha={senha} setSenha={setSenha}
            erro={erro}
            carregando={carregando}
            aoEnviarFormulario={lidarComSubmit}
        />
    );
}
