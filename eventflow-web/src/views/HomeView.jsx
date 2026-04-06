import React from 'react';

export default function HomeView({ eventos, carregando }) {
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Eventos Disponíveis</h2>

            {carregando ? (
                <div className="text-center">
                    <p>Carregando eventos...</p>
                </div>
            ) : (
                <div className="row">
                    {eventos.map((evento) => (
                        <div className="col-md-4 mb-4" key={evento.id}>
                            <div className="card shadow-sm h-100">
                                <img 
                                    src={evento.imagem} 
                                    className="card-img-top" 
                                    alt={evento.titulo} 
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{evento.titulo}</h5>
                                    
                                    <p className="card-text text-muted mb-1">
                                        <small>📅 {evento.data}</small>
                                    </p>
                                    <p className="card-text text-muted mb-3">
                                        <small>📍 {evento.local}</small>
                                    </p>
                                    
                                    <h5 className="mt-auto fw-bold text-success">
                                        {evento.preco}
                                    </h5>
                                    
                                    <button className="btn btn-primary mt-3 w-100">
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {eventos.length === 0 && !carregando && (
                        <div className="col-12">
                            <div className="alert alert-warning text-center">
                                Nenhum evento encontrado.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}