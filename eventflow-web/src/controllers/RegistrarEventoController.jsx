import React, { useState } from 'react';
import RegistroView from '../views/RegistroView';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EventModel } from '../models/EventModel';

export default function RegistrarEventoController() {
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
    const [salvando, setSalvando] = useState(false);
    
    // Estado para o Mapa
    const [coordenadas, setCoordenadas] = useState(null);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    // Se estiver no Modo Edição, carrega os dados atuais
    React.useEffect(() => {
        if (editId) {
            async function carregar() {
                const ev = await EventModel.buscarEventoPorId(editId);
                if (ev) {
                    setTitulo(ev.titulo);
                    if (ev.categoria) setCategoria(ev.categoria);
                    if (ev.descricao && ev.descricao !== "Sem descrição disponível.") setDescricao(ev.descricao);
                    if (ev.preco && ev.preco !== 'Gratuito') setPreco(ev.preco.replace('R$ ', '').replace(',', '.'));
                    
                    if (ev.dataBruta) {
                        try { setData(new Date(ev.dataBruta).toISOString().split('T')[0]); } catch(e){}
                    }
                    if (ev.horaInicioBruta) {
                        try { setHoraInicio(new Date(ev.horaInicioBruta).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})); } catch(e){}
                    }
                    if (ev.horaFimBruta) {
                        try { setHoraFim(new Date(ev.horaFimBruta).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})); } catch(e){}
                    }
                    if (ev.localizacao) setRua(ev.localizacao);
                    if (ev.coordenadas) setCoordenadas(ev.coordenadas);
                }
            }
            carregar();
        }
    }, [editId]);

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

                // Geocode da localização para o mapa
                try {
                    const query = `${dados.logradouro}, ${dados.localidade}, ${dados.uf}, Brazil`;
                    const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                    const dataGeo = await resGeo.json();
                    if (dataGeo && dataGeo.length > 0) {
                        setCoordenadas([parseFloat(dataGeo[0].lat), parseFloat(dataGeo[0].lon)]);
                    }
                } catch(e) {
                    console.error("Erro no Geocoding:", e);
                }
            }
        } catch (erro) {
            console.error("Erro no ViaCEP:", erro);
        }
    };

    // 3. Lógica de Processamento de Imagens
    const handleImagens = (e) => {
        const arquivos = Array.from(e.target.files).slice(0, 4);
        setArquivosImagem(arquivos);

        const urlsPreview = arquivos.map(arq => URL.createObjectURL(arq));
        setPreviews(urlsPreview);
    };

    // 4. Lógica de Salvar (Comunicação com o BFF)
    const salvarEvento = async (e) => {
        e.preventDefault();
        setSalvando(true);

        try {
            const dataIso8601 = new Date(`${data}T${horaInicio}:00`).toISOString();
            
            // Formatando endereço completo com coordenadas
            let localizacaoString = '';
            if (cep || numero) {
                localizacaoString = `${rua} ${numero}, ${bairro}, ${cidade}, ${uf}`;
            } else {
                localizacaoString = rua; // Fallback se tiver editando e não colocou CEP de novo
            }

            if (coordenadas) {
                localizacaoString += ` | ${coordenadas[0]},${coordenadas[1]}`;
            }

            // Modo Edição (PATCH Pura via API NODE)
            if (editId) {
                let payload = {
                    titulo,
                    descricao,
                    data: dataIso8601,
                    localizacao: localizacaoString,
                    hora_inicio: new Date(`${data}T${horaInicio}:00`).toISOString(),
                    hora_fim: new Date(`${data}T${horaFim}:00`).toISOString(),
                    categoria,
                    preco: parseFloat(preco)
                };
                
                const resultadoEdicao = await EventModel.editarEvento(editId, payload);
                if (resultadoEdicao.sucesso) {
                    alert('Evento atualizado com sucesso!');
                    navigate('/home');
                } else {
                    alert(resultadoEdicao.mensagem);
                }
                setSalvando(false);
                return;
            }

            // Modo Criação (Via BFF com upload de Imagem)
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descricao', descricao);
            formData.append('data', dataIso8601);
            formData.append('localizacao', localizacaoString);
            formData.append('hora_inicio', horaInicio);
            formData.append('hora_fim', horaFim);
            formData.append('categoria', categoria);
            formData.append('preco', parseFloat(preco));

            arquivosImagem.forEach(arquivo => {
                formData.append('imagens', arquivo);
            });

            const token = localStorage.getItem('token') || '';

            const resposta = await fetch('http://localhost:8080/api/bff/eventos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!resposta.ok) {
                const erroTxt = await resposta.text();
                throw new Error(erroTxt);
            }

            alert("Sucesso! Imagens enviadas pro Cloudinary e Evento salvo!");
            navigate('/home'); // Redireciona usando react-router-dom de forma suave

        } catch (erro) {
            alert("Erro ao salvar: " + erro.message);
        } finally {
            setSalvando(false);
        }
    };

    // 5. Renderiza a View e injeta os estados e ações
    return (
        <RegistroView 
            isEdicao={!!editId}
            estados={{
                titulo, categoria, descricao, data, horaInicio, horaFim, preco,
                cep, rua, numero, bairro, cidade, uf, previews, salvando, coordenadas
            }}
            acoes={{
                setTitulo, setCategoria, setDescricao, setData, setHoraInicio, setHoraFim, setPreco,
                setCep, setRua, setNumero, setBairro, setCidade, setUf,
                buscarCep, handleImagens, salvarEvento
            }}
        />
    );
}