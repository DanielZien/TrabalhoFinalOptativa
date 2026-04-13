import React, { useState } from 'react';
import { AuthModel } from '../models/AuthModel';
import LoginView from '../views/LoginView';
import { useNavigate } from 'react-router-dom';

export default function LoginController() {
    // 1. Nossos Hooks de Estado (Memória)
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    // 2. Função que roda quando o usuário clica em "Entrar"
    const lidarComSubmit = async (evento) => {
        evento.preventDefault(); // Evita que a página recarregue (padrão do HTML)
        setErro('');

        // Validação Básica de Formulário (Garante nota na Parte 2 da prova)
        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        // 3. Chama o Model para tentar logar
        setCarregando(true);
        const resposta = await AuthModel.fazerLogin(email, senha);
        setCarregando(false);

        if (resposta.sucesso) {
            // alert(`Bem-vindo, ${resposta.usuario}! Login efetuado com sucesso.`);
            
            //Redirecionamento 
            navigate('/home');
        } else {
            setErro(resposta.mensagem);
        }
    };

    // 4. Renderiza a View passando os estados e funções
    return (
        <LoginView 
            email={email}
            setEmail={setEmail}
            senha={senha}
            setSenha={setSenha}
            erro={erro}
            carregando={carregando}
            aoEnviarFormulario={lidarComSubmit}
        />
    );
}