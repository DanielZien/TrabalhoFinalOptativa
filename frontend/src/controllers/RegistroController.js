class RegistroController {

    //Variavel pra guardar as imagens
    static imagensBase64 = []; //Em base64 por questões de não quero pertubar meu amigo com questões minhas.


    static inicializar() {
        // 1. Configura a busca do ViaCEP
        const campoCep = document.getElementById('reg-cep');
        campoCep.addEventListener('blur', this.buscarCep);

        // 2. Configura o envio do formulário
        const form = document.getElementById('form-registro-evento');
        form.addEventListener('submit', this.salvarEvento);

        //Colocando as imagens
        const inputImagens = document.getElementById('reg-imagens');
        if (inputImagens) {
            inputImagens.addEventListener('change', this.proces)
        }
    }

   static processarImagens(evento) {
        // Pega os arquivos e limita a no máximo 4
        const arquivos = Array.from(evento.target.files).slice(0, 4); 
        
        RegistroController.imagensBase64 = []; // Zera o array
        const previewContainer = document.getElementById('preview-imagens');
        previewContainer.innerHTML = ''; // Limpa as miniaturas

        arquivos.forEach(arquivo => {
            const reader = new FileReader();
            
            // Quando terminar de ler o arquivo...
            reader.onload = (e) => {
                const stringBase64 = e.target.result;
                RegistroController.imagensBase64.push(stringBase64); // Guarda no array

                // Cria uma miniatura na tela para o usuário ver
                const img = document.createElement('img');
                img.src = stringBase64;
                img.className = 'rounded border shadow-sm';
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                previewContainer.appendChild(img);
            };

            // Manda ler como Base64 (Data URL)
            reader.readAsDataURL(arquivo);
        });
    }

    static async buscarCep(evento) {
        let cep = evento.target.value.replace(/\D/g, ''); // Tira o traço
        if (cep.length !== 8) return;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (!dados.erro) {
                document.getElementById('reg-rua').value = dados.logradouro;
                document.getElementById('reg-bairro').value = dados.bairro;
                document.getElementById('reg-cidade').value = dados.localidade;
                document.getElementById('reg-uf').value = dados.uf;
                document.getElementById('reg-numero').focus(); // Joga o cursor pro número
            }
        } catch (erro) {
            console.error("Erro no ViaCEP:", erro);
        }
    }

    static async salvarEvento(evento) {
        evento.preventDefault(); // Impede a tela de recarregar
        
        const btnSalvar = document.getElementById('btn-salvar');
        btnSalvar.innerText = "Salvando...";
        btnSalvar.disabled = true;

        try {
            // FORMATANDO A DATA: O input type="date" devolve "YYYY-MM-DD"
            // A API quer "dd/mm/aaaa hh:mm"
            const dataInvertida = document.getElementById('reg-data').value; // ex: 2026-05-15
            
            const horaInicio = document.getElementById('reg-hora-inicio').value;
            const dataFormatada = new Date(`${dataInvertida}T${horaInicio}:00`).toISOString();

            // FORMATANDO ENDEREÇO
            const rua = document.getElementById('reg-rua').value;
            const num = document.getElementById('reg-numero').value;
            const cidade = document.getElementById('reg-cidade').value;
            const uf = document.getElementById('reg-uf').value;
            const localizacaoString = `${rua} ${num}, ${cidade}, ${uf}`;

            const stringImagensFinal = RegistroController.imagensBase64.join('|');

            // MONTANDO O PAYLOAD EXATO
            const payload = {
                titulo: document.getElementById('reg-titulo').value,
                descricao: document.getElementById('reg-descricao').value,
                data: dataFormatada,
                localizacao: localizacaoString,
                hora_inicio: horaInicio,
                hora_fim: document.getElementById('reg-hora-fim').value,
                categoria: document.getElementById('reg-categoria').value,
                imagem: stringImagensFinal, // Imagem padrão já que pulamos isso
                preco: parseFloat(document.getElementById('reg-preco').value)
            };

            // MANDANDO PRO MODEL
            await EventModel.criarEvento(payload);

            alert("Evento criado com sucesso!");
            window.location.href = "index.html"; // Volta pra home para ver o evento novo

        } catch (erro) {
            alert("Erro ao salvar: " + erro.message);
            btnSalvar.innerText = "Salvar Evento";
            btnSalvar.disabled = false;
        }
    }
}

window.onload = () => {
    RegistroController.inicializar();
};