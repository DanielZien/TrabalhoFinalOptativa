class RegistroController {

    //Variavel pra guardar as imagens
    static imagensBase64 = []; //Em base64 por questões de não quero pertubar meu amigo com questões minhas. Tive que fazer minha propria API que Usa A API dele


    static inicializar() {
        //Configura a busca do ViaCEP
        const campoCep = document.getElementById('reg-cep');
        campoCep.addEventListener('blur', this.buscarCep);

        //Configura o envio do formulário
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
        evento.preventDefault(); 
        const btnSalvar = document.getElementById('btn-salvar');
        btnSalvar.innerText = "Salvando (Fazendo upload)...";
        btnSalvar.disabled = true;

        try {
    
            const formData = new FormData();

            const dataInvertida = document.getElementById('reg-data').value;
            const horaInicio = document.getElementById('reg-hora-inicio').value;
            const dataIso8601 = new Date(`${dataInvertida}T${horaInicio}:00`).toISOString();

            // 3. Monta o endereço
            const rua = document.getElementById('reg-rua').value;
            const num = document.getElementById('reg-numero').value;
            const cidade = document.getElementById('reg-cidade').value;
            const uf = document.getElementById('reg-uf').value;
            const localizacaoString = `${rua} ${num}, ${cidade}, ${uf}`;

            // 4. Coloca os textos no FormData
            formData.append('titulo', document.getElementById('reg-titulo').value);
            formData.append('descricao', document.getElementById('reg-descricao').value);
            formData.append('data', dataIso8601);
            formData.append('localizacao', localizacaoString);
            formData.append('hora_inicio', horaInicio);
            formData.append('hora_fim', document.getElementById('reg-hora-fim').value);
            formData.append('categoria', document.getElementById('reg-categoria').value);
            formData.append('preco', parseFloat(document.getElementById('reg-preco').value));

            // 5. Coloca OS ARQUIVOS REAIS no FormData
            const inputImagens = document.getElementById('reg-imagens');
            if (inputImagens.files.length > 0) {
                // Pega no máximo 4 arquivos do input
                const arquivos = Array.from(inputImagens.files).slice(0, 4);
                arquivos.forEach(arquivo => {
                    // O nome 'imagens' tem que ser EXATAMENTE o mesmo do @RequestParam no Java
                    formData.append('imagens', arquivo); 
                });
            }

            const token = localStorage.getItem('token') || ''; 

            // 7. Manda a requisição para o nosso Java BFF na porta 8080!
            const resposta = await fetch('http://localhost:8080/api/bff/eventos', {
                method: 'POST',
                headers: {
                    // Manda o token para o Java repassar pro Node
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            if (!resposta.ok) {
                const erroTxt = await resposta.text();
                throw new Error(erroTxt);
            }

            alert("Sucesso! Imagens enviadas pro Cloudinary e Evento salvo!");
            window.location.href = "index.html"; 

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