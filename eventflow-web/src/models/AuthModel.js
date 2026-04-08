import { API_BASE } from "../config/api";


export const AuthModel = {
    async fazerLogin(email, senha) {
        try {
            const resposta = await fetch(API_BASE+"/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: senha 
                })
            });

            //Se não der
            if (!resposta.ok) {
                const erroData = await resposta.json().catch(() => ({}));
                return { sucesso: false, mensagem: erroData.message || "E-mail ou senha incorretos."};
            }

            const dados = await resposta.json();

            //Pegando esse token e role
            if (dados.access_toekn) {
                localStorage.setItem('token', dados.access_toekn);
                
                // Salvar Role se vier no objeto de usuário (padrão 'USER' caso não exista)
                if (dados.user && dados.user.role) {
                    localStorage.setItem('role', dados.user.role);
                } else {
                    localStorage.setItem('role', 'USER');
                }
                console.log("Aqui o o token: "+dados.access_toekn);
            }

            return { sucesso: true, usuario: dados.user.email, mensagem: "Login efetuado!"};

        } catch (erro) {
            console.error("Erro no login:", erro);
            return { sucesso: false, mensagem: "Erro ao conectar com o servidor."}
        }
    },

    async fazerCadastro(email, senha, nome, telefone) {
        try {
            const resposta = await fetch(API_BASE+"/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    password: senha,
                    nome: nome,
                    telefone: telefone
                })
            });

            if (!resposta.ok) {
                const erroData = await resposta.json().catch(() => ({}));
                return { sucesso: false, mensagem: erroData.message || "Erro ao registrar o usuário."};
            }

            return { sucesso: true, mensagem: "Usuário registrado com sucesso!"};

        } catch (erro) {
            console.error("Erro no registro:", erro);
            return { sucesso: false, mensagem: "Erro ao conectar com o servidor."}
        }
    }
}