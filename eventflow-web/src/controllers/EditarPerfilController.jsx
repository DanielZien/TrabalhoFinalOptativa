import React, { useState, useEffect } from 'react';
import CadastroUsuarioView from '../views/CadastroUsuarioView';
import { useNavigate } from 'react-router-dom';

export default function EditarPerfilController() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [imagemArquivo, setImagemArquivo] = useState(null);

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    // Busca os dados do usuário ao abrir a tela
    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const resposta = await fetch('https://event-flow-vercel.vercel.app/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setNome(dados.nome || '');
                    setEmail(dados.email || '');
                    setTelefone(dados.telefone || '');
                }
            } catch (error) {
                setErro("Não foi possível carregar seus dados.");
            }
        };
        carregarDados();
    }, [navigate]);

    const lidarComImagem = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagemArquivo(e.target.files[0]);
        }
    };

    const lidarComSubmit = async (evento) => {
        evento.preventDefault();
        setErro('');

        // Se o usuário digitou algo na senha, obriga a confirmar
        if (senha && senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('telefone', telefone);
            
            // Só manda a senha se o usuário realmente preencheu o campo querendo trocar
            if (senha) formData.append('password', senha);
            if (imagemArquivo) formData.append('imagem', imagemArquivo);

            const token = localStorage.getItem('token');

            // Aqui precisaremos bater no nosso Java BFF que fará o UPDATE
            const resposta = await fetch('http://localhost:8080/api/bff/usuarios/perfil', {
                method: 'PUT', // Geralmente edição usa PUT ou PATCH
                headers: {
                    'Authorization': `Bearer ${token}` // Passando o token pro Java repassar pra Vercel
                },
                body: formData
            });

            if (resposta.ok) {
                alert(`Perfil atualizado com sucesso!`);
                navigate('/home');
            } else {
                setErro("Erro ao atualizar o perfil. Verifique os dados.");
            }
        } catch (erro) {
            setErro("Erro de conexão com o servidor.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <CadastroUsuarioView
            isEdicao={true} // <-- Ligando o "Modo de Edição"
            nome={nome} setNome={setNome}
            email={email} setEmail={setEmail}
            telefone={telefone} setTelefone={setTelefone}
            senha={senha} setSenha={setSenha}
            confirmarSenha={confirmarSenha} setConfirmarSenha={setConfirmarSenha}
            lidarComImagem={lidarComImagem}
            erro={erro}
            carregando={carregando}
            aoEnviarFormulario={lidarComSubmit}
        />
    );
}