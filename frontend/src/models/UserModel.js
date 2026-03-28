
class UserModel {
    static async autenticar(email, senha) {
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

            //Pegando esse token
            if (dados.access_token) {
                localStorage.setItem('token', dados.access_token);
            }

            return { sucesso: true, mensagem: "Login efetuado!"};

        } catch (erro) {
            console.error("Erro no login:", erro);
            return { sucesso: false, mensagem: "Erro ao conectar com o servidor."}
        }
    }
}