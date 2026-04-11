import { useState } from 'react';

export function useEventoForm() {
    // 1. Estados do Formulário
    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState('Palestra');
    const [descricao, setDescricao] = useState('');

    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');
    const [preco, setPreco] = useState('0');

    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');

    const [arquivosImagem, setArquivosImagem] = useState([]);
    const [previews, setPreviews] = useState([]);
    
    const [imagemAntiga, setImagemAntiga] = useState('');
    const [arquivoManual, setArquivoManual] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [coordenadas, setCoordenadas] = useState(null);

    // 2. Lógica do ViaCEP
    const buscarCep = async () => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const dados = await resposta.json();

            if (!dados.erro) {
                setRua(dados.logradouro);
                setBairro(dados.bairro);
                setCidade(dados.localidade);
                setUf(dados.uf);

                try {
                    const query = `${dados.logradouro}, ${dados.localidade}, ${dados.uf}, Brazil`;
                    const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                    const dataGeo = await resGeo.json();
                    if (dataGeo && dataGeo.length > 0) {
                        setCoordenadas([parseFloat(dataGeo[0].lat), parseFloat(dataGeo[0].lon)]);
                    }
                } catch (e) {
                    console.error("Erro no Geocoding:", e);
                }
            }
        } catch (erro) {
            console.error("Erro no ViaCEP:", erro);
        }
    };

    // 3. Lógica de Arquivos
    const handleImagens = (e) => {
        const arquivos = Array.from(e.target.files).slice(0, 4);
        setArquivosImagem(arquivos);
        const urlsPreview = arquivos.map(arq => URL.createObjectURL(arq));
        setPreviews(urlsPreview);
    };

    const handleManual = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setArquivoManual(e.target.files[0]);
        }
    };

    // Retornamos tudo empacotado para facilitar o uso nos Controllers
    return {
        estados: {
            titulo, categoria, descricao, data, horaInicio, horaFim, preco,
            cep, rua, numero, bairro, cidade, uf, previews, salvando, coordenadas,
            imagemAntiga, arquivoManual, arquivosImagem
        },
        acoes: {
            setTitulo, setCategoria, setDescricao, setData, setHoraInicio, setHoraFim, setPreco,
            setCep, setRua, setNumero, setBairro, setCidade, setUf, setCoordenadas, setImagemAntiga, setSalvando,
            buscarCep, handleImagens, handleManual
        }
    };
}