import React from 'react';
import { Link } from 'react-router-dom';

export default function VerPerfilView({ usuario, carregando, erro }) {
    if (carregando) {
        return <div className="text-center mt-5 fw-bold text-primary">Carregando perfil...</div>;
    }

    if (erro) {
        return <div className="alert alert-danger m-4 text-center">{erro}</div>;
    }

    if (!usuario) return null;

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4 text-center" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                <div className="mb-3">
                    <img
                        // Mostra a imagem do usuário ou um avatar genérico se ele não tiver foto
                        src={usuario.imagem || "https://ui-avatars.com/api/?name=" + usuario.nome + "&background=000080&color=fff"}
                        alt="Avatar"
                        className="rounded-circle border shadow-sm"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                </div>
                
                <h4 className="fw-bold text-primary mb-1">{usuario.nome}</h4>
                <span className="badge bg-secondary mb-3">{usuario.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</span>
                
                <p className="text-muted mb-2"><i className="bi bi-envelope me-2"></i>{usuario.email}</p>
                <p className="text-muted mb-4"><i className="bi bi-telephone me-2"></i>{usuario.telefone || 'Telefone não informado'}</p>

                <div className="d-flex justify-content-center gap-2">
                    <Link to="/editar-perfil" className="btn btn-warning fw-bold text-white px-4" style={{ borderRadius: '8px' }}>
                        <i className="bi bi-pencil me-1"></i> Editar
                    </Link>
                    <Link to="/home" className="btn btn-outline-secondary px-4" style={{ borderRadius: '8px' }}>
                        Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}