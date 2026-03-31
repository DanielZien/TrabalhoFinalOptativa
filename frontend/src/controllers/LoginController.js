// src/controllers/LoginController.js
class LoginController {
    static iniciar() {
        const form = document.getElementById('form-login');
        const msgErro = document.getElementById('msg-erro');

        // Escuta o evento de 'submit' do formulário
        form.addEventListener('submit', async (evento) => {
            evento.preventDefault(); // Impede a página de recarregar, achei brabo

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            //VALIDAÇÃO BÁSICA
            if (!email || !senha) {
                this.mostrarErro("Por favor, preencha e-mail e senha.");
                return;
            }

            if (senha.length < 6) {
                this.mostrarErro("A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            msgErro.classList.add('d-none');
            const btnSubmit = form.querySelector('button');
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Entrando...';
            btnSubmit.disabled = true;

            //CHAMA O MODEL PARA AUTENTICAR
            const resposta = await UserModel.autenticar(email, senha);

            //TRATA A RESPOSTA
            if (resposta.sucesso) {
                // Se deu certo, redireciona para a Home
                window.location.href = 'index.html';
            } else {
                // Se deu erro, mostra a mensagem, restaura o botão
                this.mostrarErro(resposta.mensagem);
                btnSubmit.innerHTML = 'Entrar';
                btnSubmit.disabled = false;
            }
        });
    }

    static mostrarErro(mensagem) {
        const msgErro = document.getElementById('msg-erro');
        msgErro.innerText = mensagem;
        msgErro.classList.remove('d-none'); // Tira a classe que esconde a div
    }
}

// Inicia o Controller quando a página carregar
window.onload = () => {
    LoginController.iniciar();
};