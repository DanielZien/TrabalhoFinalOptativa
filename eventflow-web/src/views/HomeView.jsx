import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HomeMap from './HomeMap';

export default function HomeView({
    eventos,
    totalGeral,
    carregando,
    termoPesquisa,
    setTermoPesquisa,
    categoriaSelecionada,
    setCategoriaSelecionada,
    categoriasDisponiveis,
    paginaAtual,
    totalPaginas,
    setPaginaAtual,
    habilitarModoAdmin,
    aoDeletarEvento
}) {
    const navigate = useNavigate();

    const irParaDetalhes = (evento) => {
        navigate(`/detalhes?id=${evento.id}`);
    };

    return (
        <>
            <h5 className="text-center mb-3">
                <strong>Explore</strong> <span className="fw-normal text-muted">os Eventos</span>
            </h5>

            {/* Barra de Pesquisa e Filtro de Categoria */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-8">
                    <div className="input-group shadow-sm border rounded-pill overflow-hidden h-100">
                        <span className="input-group-text bg-white border-0 d-flex align-items-center">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none py-2"
                            placeholder="Pesquise Eventos, Show e etc.."
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <select 
                        className="form-select shadow-sm border rounded-pill h-100 py-2 px-4"
                        value={categoriaSelecionada}
                        onChange={(e) => setCategoriaSelecionada(e.target.value)}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="">Todas as Categorias</option>
                        {categoriasDisponiveis.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <hr style={{ borderTop: '2px solid #eee' }} />

            {/* Mapa de Eventos */}
            <div className="mb-4 shadow-sm rounded-4 overflow-hidden border">
                <HomeMap eventos={eventos} />
            </div>

            {/* Contadores */}
            <p className="text-center text-muted small mb-2">
                Mostrando <strong className="text-dark">{eventos.length}</strong> de <strong className="text-dark">{totalGeral}</strong> Eventos
            </p>

            {/* Lista de Cards */}
            <div className="row g-4">
                {carregando ? (
                    <div className="col-12 text-center mt-5">
                        <div className="spinner-border text-primary mb-2" role="status"></div>
                        <p className="text-muted">Carregando eventos...</p>
                    </div>
                ) : eventos.length === 0 ? (
                    <div className="col-12 text-center mt-5">
                        <p className="text-muted">Nenhum evento encontrado para essa pesquisa ou filtro.</p>
                    </div>
                ) : (
                    eventos.map((evento) => (
                        <div className="col-12 col-md-6 col-lg-4" key={evento.id}>
                            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative">
                                
                                {habilitarModoAdmin && (
                                    <button 
                                        className="btn btn-sm btn-danger position-absolute fw-bold shadow" 
                                        style={{ top: '10px', right: '10px', borderRadius: '20px', zIndex: 10 }}
                                        onClick={() => aoDeletarEvento(evento.id)}
                                    >
                                        Excluir Evento <i className="bi bi-x ms-1"></i>
                                    </button>
                                )}

                                <img
                                    src={evento.imagem}
                                    className="card-img-top"
                                    alt={evento.titulo}
                                    style={{ height: '140px', objectFit: 'cover' }}
                                />

                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <h6 className="card-title fw-bold text-dark text-truncate mb-1">{evento.titulo}</h6>
                                        <span className="text-muted small d-block">{evento.data}</span>
                                        <span className="badge bg-light text-dark border mt-2 mb-3">{evento.categoria}</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-end mt-2">
                                        <div>
                                            <span className="d-block text-muted small mb-0" style={{ lineHeight: 1 }}>Ingresso</span>
                                            <strong className="text-dark">{evento.preco}</strong>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {habilitarModoAdmin && (
                                                <button
                                                    className="btn px-3 py-1 text-white fw-semibold shadow-sm"
                                                    style={{ backgroundColor: '#ffc107', borderRadius: '8px', fontSize: '0.9rem' }}
                                                    onClick={() => navigate(`/registro?edit=${evento.id}`)}
                                                >
                                                    Editar
                                                </button>
                                            )}
                                            <button
                                                className="btn px-3 py-1 text-white fw-semibold shadow-sm"
                                                style={{ backgroundColor: '#000080', borderRadius: '8px', fontSize: '0.9rem' }}
                                                onClick={() => irParaDetalhes(evento)}
                                            >
                                                Ver <i className="bi bi-caret-right-fill small"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Controles de Paginação Estilizados */}
            {!carregando && totalPaginas > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4 pb-2 gap-3">
                    {/* Botão Anterior */}
                    <button
                        className="btn d-flex align-items-center rounded-pill px-4 py-2 fw-bold transition-all"
                        onClick={() => setPaginaAtual(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        style={{
                            minWidth: '130px',
                            justifyContent: 'center',
                            color: paginaAtual === 1 ? '#6c757d' : '#000080',
                            borderColor: paginaAtual === 1 ? '#dee2e6' : '#000080',
                            backgroundColor: 'transparent'
                        }}
                    >
                        <i className="bi bi-chevron-left me-2"></i> Anterior
                    </button>

                    {/* Indicador de Página */}
                    <div
                        className="text-white rounded-pill px-4 py-2 fw-bold shadow-sm"
                        style={{ backgroundColor: '#000080' }}
                    >
                        {paginaAtual} <span className="fw-normal opacity-75">de</span> {totalPaginas}
                    </div>

                    {/* Botão Próxima */}
                    <button
                        className="btn d-flex align-items-center rounded-pill px-4 py-2 fw-bold transition-all"
                        onClick={() => setPaginaAtual(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        style={{
                            minWidth: '130px',
                            justifyContent: 'center',
                            color: paginaAtual === totalPaginas ? '#6c757d' : '#000080',
                            borderColor: paginaAtual === totalPaginas ? '#dee2e6' : '#000080',
                            backgroundColor: 'transparent'
                        }}
                    >
                        Próxima <i className="bi bi-chevron-right ms-2"></i>
                    </button>
                </div>
            )}
        </>
    );
}