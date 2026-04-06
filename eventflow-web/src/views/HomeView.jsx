// src/views/HomeView.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomeView({ 
    eventos, 
    totalGeral, 
    carregando, 
    termoPesquisa, 
    setTermoPesquisa,
    paginaAtual,
    totalPaginas,
    setPaginaAtual
}) {
    const navigate = useNavigate();

    // A Solução para o bug do Backend!
    const irParaDetalhes = (evento) => {
        // Redireciona e leva o objeto evento inteiro na bagagem!
        navigate(`/detalhes`, { state: { eventoCompleto: evento } });
    };

    return (
        <div className="container-fluid bg-white" style={{ minHeight: '100vh' }}>
            <div className="row">
                
                {/* Menu Lateral (Sidebar) */}
                <nav className="col-md-3 col-lg-2 d-none d-md-block border-end p-3" style={{ minHeight: '100vh' }}>
                    <h4 className="mb-4 text-center mt-2 fw-bold text-dark">EventFlow</h4>
                    <div className="d-flex flex-column gap-2">
                        <Link to="/home" className="btn btn-light text-start fw-bold">
                            <i className="bi bi-house-door me-2"></i> Home
                        </Link>
                        <Link to="/registro" className="btn text-start text-dark text-decoration-none">
                            <i className="bi bi-calendar-event me-2"></i> Novo Evento
                        </Link>
                        <Link to="/login" className="btn text-start text-dark text-decoration-none">
                            <i className="bi bi-box-arrow-in-right me-2"></i> Sair
                        </Link>
                    </div>
                </nav>

                {/* Área Principal */}
                <main className="col-md-9 col-lg-8 mx-auto p-3 p-md-5">
                    
                    <h5 className="text-center mb-3">
                        <strong>Explore</strong> <span className="fw-normal text-muted">os Eventos</span>
                    </h5>

                    {/* Barra de Pesquisa */}
                    <div className="input-group mb-4 shadow-sm border rounded-pill overflow-hidden">
                        <span className="input-group-text bg-white border-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-0 shadow-none" 
                            placeholder="Pesquise Eventos, Show e etc.."
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                    </div>

                    <hr style={{ borderTop: '2px solid #eee' }} />

                    {/* Banner do Mapa */}
                    <div className="map-banner mb-4 d-flex justify-content-center align-items-center bg-light rounded-4 shadow-sm py-3 border">
                        <button className="btn btn-white shadow-sm px-4 py-2 bg-white rounded-pill border fw-semibold">
                            Explore pelo Mapa <i className="bi bi-geo-alt-fill text-danger ms-1"></i>
                        </button>
                    </div>

                    {/* Contadores */}
                    <p className="text-center text-muted small mb-4">
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
                                <p className="text-muted">Nenhum evento encontrado para essa pesquisa.</p>
                            </div>
                        ) : (
                            eventos.map((evento) => (
                                <div className="col-12 col-md-6 col-lg-4" key={evento.id}>
                                    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                                        <img 
                                            src={evento.imagem} 
                                            className="card-img-top" 
                                            alt={evento.titulo} 
                                            style={{ height: '180px', objectFit: 'cover' }}
                                        />
                                        
                                        <div className="card-body p-3 d-flex flex-column justify-content-between">
                                            <div>
                                                <h6 className="card-title fw-bold text-dark text-truncate mb-1">{evento.titulo}</h6>
                                                <span className="text-muted small d-block">{evento.data}</span>
                                                <p className="text-muted small mb-3">{evento.categoria}</p>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between align-items-end mt-2">
                                                <div>
                                                    <span className="d-block text-muted small mb-0" style={{ lineHeight: 1 }}>Ingresso</span>
                                                    <strong className="text-dark">{evento.preco}</strong>
                                                </div>
                                                <button 
                                                    className="btn px-3 py-1 text-white fw-semibold shadow-sm" 
                                                    style={{ backgroundColor: '#000080', borderRadius: '8px', fontSize: '0.9rem' }}
                                                    onClick={() => irParaDetalhes(evento)}
                                                >
                                                    Mais Detalhes <i className="bi bi-caret-right-fill small"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Controles de Paginação (Só aparecem se tiver mais de 1 página) */}
                    {!carregando && totalPaginas > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            {/* Controles de Paginação Estilizados */}
{!carregando && totalPaginas > 1 && (
    <div className="d-flex justify-content-center align-items-center mt-5 mb-5 gap-3">
        
        {/* Botão Anterior */}
        <button 
            className="btn btn-outline-primary d-flex align-items-center rounded-pill px-4 py-2 fw-bold transition-all" 
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{ minWidth: '130px', justifyContent: 'center' }}
        >
            <i className="bi bi-chevron-left me-2"></i> Anterior
        </button>
        
        {/* Indicador de Página */}
        <div className="bg-primary text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
            {paginaAtual} <span className="fw-normal opacity-75">de</span> {totalPaginas}
        </div>
        
        {/* Botão Próxima */}
        <button 
            className="btn btn-outline-primary d-flex align-items-center rounded-pill px-4 py-2 fw-bold transition-all" 
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            style={{ minWidth: '130px', justifyContent: 'center' }}
        >
            Próxima <i className="bi bi-chevron-right ms-2"></i>
        </button>

    </div>
)}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}