import React from 'react';
import { Link } from 'react-router-dom';
import HomeMap from './HomeMap';

export default function DetalhesView({ evento, carregando, erro }) {
    // Se estiver carregando, mostra o spinner
    if (carregando) {
        return (
            <div className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Carregando detalhes...</p>
            </div>
        );
    }

    // Se deu erro ou evento não existe, mostra aviso
    if (erro || !evento) {
        return (
            <div className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h4 className="text-danger">{erro || "Evento não encontrado."}</h4>
                <Link to="/home" className="btn btn-primary mt-3">Voltar para a Home</Link>
            </div>
        );
    }

    // Tratamento das imagens do carrossel (separando pelo |)
    const imagens = evento.imagem ? evento.imagem.split('|').filter(url => url.trim() !== "") : [];

    // Tratamento do Iframe do Mapa (corrigindo a URL original do seu código)
    const queryMapa = evento.coordenadas ? evento.coordenadas : evento.localizacao;
    const urlIframe = `http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(queryMapa)}&t=m&z=15&output=embed`;

    return (
        <div className="bg-light pb-5 rounded-4 overflow-hidden">
            <nav className="navbar navbar-light bg-white shadow-sm mb-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-dark d-flex align-items-center" to="/home">
                         Voltar
                    </Link>
                    <span className="navbar-text fw-bold">Sobre o Evento</span>
                </div>
            </nav>

            <div className="container">
                <div className="row g-4">
                    
                    {/* Coluna da Esquerda (Imagens e Detalhes) */}
                    <div className="col-lg-8">
                        {/* Carrossel do Bootstrap */}
                        {imagens.length > 0 && (
                            <div id="evento-carrossel" className="carousel slide mb-4 rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {imagens.map((url, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img src={url} className="d-block w-100" alt={`Imagem ${index + 1}`} 
                                                 style={{ height: '400px', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                                {imagens.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#evento-carrossel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Anterior</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#evento-carrossel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Próximo</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="card border-0 shadow-sm p-4 mb-4 rounded-4">
                            <h2 className="fw-bold mb-3">{evento.titulo}</h2>
                            <p className="text-muted mb-4">
                                <span className="me-2">📅</span> {evento.dataCompleta}
                            </p>
                            
                            <h5 className="fw-bold border-bottom pb-2 mb-3">Descrição</h5>
                            {/* Usando a descrição tratada que vem do Controller */}
                            <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                                {evento.descricaoExibicao || evento.descricao}
                            </p>
                            
                            {/* Botão de Download do Manual (Só aparece se houver link) */}
                            {evento.linkManual && (
                                <div className="mt-4 mb-2">
                                    <a 
                                        href={evento.linkManual} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn btn-outline-primary d-inline-flex align-items-center gap-2 fw-bold px-4 py-2"
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                                            <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z"/>
                                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                                        </svg>
                                        Baixar Material de Apoio
                                    </a>
                                </div>
                            )}
                            
                            <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">Informações do Organizador</h5>
                            <ul className="list-unstyled text-muted">
                                <li className="mb-2"><span className="text-primary me-2">👤</span> {evento.organizador?.nome || '--'}</li>
                                <li className="mb-2"><span className="text-primary me-2">✉️</span> {evento.organizador?.email || '--'}</li>
                                <li className="mb-2"><span className="text-primary me-2">📞</span> {evento.organizador?.telefone || '--'}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Coluna da Direita (Mapa e Ingresso) */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '20px' }}>
                            <div className="w-100" style={{ height: '250px', backgroundColor: '#eee', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', overflow: 'hidden' }}>
                                <HomeMap eventos={[evento]} />
                            </div>
                            
                            <div className="card-body p-4">
                                <p className="text-muted small mb-1"><span className="text-danger">📍</span> Localização:</p>
                                <p className="fw-bold small mb-4">{evento.localizacao}</p>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">Valor Ingresso</span>
                                    <h4 className="fw-bold text-dark mb-0">{evento.preco}</h4>
                                </div>
                                <button className="btn w-100 fw-bold py-2 text-white" style={{ backgroundColor: '#0b0080', borderRadius: '20px' }}>
                                    Obter Ingresso
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}