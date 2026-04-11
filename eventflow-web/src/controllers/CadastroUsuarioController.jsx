import React, { useState } from 'react';
import CadastroUsuarioView from '../views/CadastroUsuarioView';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuarioController() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [imagemArquivo, setImagemArquivo] = useState(null); // Estado da imagem

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    // Captura o arquivo do input
    const lidarComImagem = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagemArquivo(e.target.files[0]);
        }
    };

    const lidarComSubmit = async (evento) => {
        evento.preventDefault();
        setErro('');

        if (!nome || !email || !telefone || !senha) {
            setErro('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem. Tente novamente.");
            return; 
        }

        setCarregando(true);

        try {
            // Empacota tudo em FormData porque tem arquivo envolvido
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('telefone', telefone);
            formData.append('senha', senha);
            
            if (imagemArquivo) {
                formData.append('imagem', imagemArquivo);
            }

            // Manda para o nosso Java BFF
            const resposta = await fetch('http://localhost:8080/api/bff/usuarios/registro', {
                method: 'POST',
                body: formData
            });

            if (resposta.ok) {
                alert(`Sua conta foi criada com sucesso! Faça login para continuar.`);
                navigate('/login');
            } else {
                const erroTxt = await resposta.text();
                // Tenta extrair a mensagem de erro se a API original retornar um JSON
                try {
                    const erroJson = JSON.parse(erroTxt);
                    setErro(erroJson.mensagem || erroJson.message || "Erro no cadastro.");
                } catch {
                    setErro(erroTxt || "Erro no cadastro.");
                }
            }
        } catch (erro) {
            setErro("Erro de conexão com o servidor. Verifique se o backend Java está rodando.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <CadastroUsuarioView
            nome={nome} setNome={setNome}
            email={email} setEmail={setEmail}
            telefone={telefone} setTelefone={setTelefone}
            senha={senha} setSenha={setSenha}
            confirmarSenha={confirmarSenha} setConfirmarSenha={setConfirmarSenha}
            lidarComImagem={lidarComImagem} // Repassa a função para a View
            erro={erro}
            carregando={carregando}
            aoEnviarFormulario={lidarComSubmit}
        />
    );
}