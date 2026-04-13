import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    // Busca os dados do usuário logado assim que a barra é montada
    useEffect(() => {
        const carregarPerfil = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Usando a URL que estava no seu print do Swagger
                const resposta = await fetch('https://event-flow-vercel.vercel.app/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    setUsuario(dados);
                }
            } catch (erro) {
                console.error("Erro ao buscar dados do perfil:", erro);
            }
        };

        carregarPerfil();
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        // Adicionamos flexbox para conseguir empurrar o rodapé para o final
        <nav className="col-md-3 col-lg-2 d-none d-md-flex flex-column border-end p-3" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            
            {/* Agrupamos o menu principal em uma div */}
            <div>
                <h4 className="mb-4 text-center mt-2 fw-bold text-dark">EventFlow</h4>
                <div className="d-flex flex-column gap-2">
                    <Link to="/home" className="btn btn-light text-start fw-bold">
                        <i className="bi bi-house-door me-2"></i> Home
                    </Link>
                    <Link to="/registro" className="btn text-start text-dark text-decoration-none hover-light">
                        <i className="bi bi-calendar-event me-2"></i> Novo Evento
                    </Link>
                    <a href="#" onClick={handleLogout} className="btn text-start text-dark text-decoration-none hover-light">
                        <i className="bi bi-box-arrow-in-right me-2"></i> Sair
                    </a>
                </div>
            </div>

            {/* mt-auto empurra esta div para o limite inferior da tela */}
            {usuario && (
                <div className="mt-auto pt-3 border-top d-flex align-items-center gap-2">
                    {/* Renderiza a imagem, ou um círculo com a inicial se for null */}
                    {usuario.imagem ? (
                        <img 
                            src={usuario.imagem} 
                            alt="Foto de perfil" 
                            className="rounded-circle object-fit-cover"
                            style={{ width: '45px', height: '45px' }}
                        />
                    ) : (
                        <div 
                            className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center fw-bold"
                            style={{ width: '45px', height: '45px', fontSize: '1.2rem', flexShrink: 0 }}
                        >
                            {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                    
                    <div style={{ overflow: 'hidden' }}>
                        <p className="mb-0 fw-bold text-truncate" style={{ fontSize: '0.95rem' }}>
                            {usuario.nome}
                        </p>
                        <p className="mb-0 text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
                            {usuario.email}
                        </p>
                    </div>

                    {/* --- NOVO: Botão de 3 pontinhos e Menu Dropdown --- */}
                    <div className="dropdown ms-auto"> {/* ms-auto empurra pro canto direito */}
                        <button className="btn btn-sm btn-light border-0 rounded-circle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2" to="/perfil">
                                    <i className="bi bi-person text-primary"></i> Ver Perfil
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item d-flex align-items-center gap-2" to="/editar-perfil">
                                    <i className="bi bi-pencil text-warning"></i> Editar Conta
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <style>{`
                .hover-light:hover {
                    background-color: #f8f9fa;
                    border-radius: 0.375rem;
                }
            `}</style>
        </nav>
    );
}