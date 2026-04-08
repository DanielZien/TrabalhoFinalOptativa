import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="col-md-3 col-lg-2 d-none d-md-block border-end p-3" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
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
            <style>{`
                .hover-light:hover {
                    background-color: #f8f9fa;
                    border-radius: 0.375rem;
                }
            `}</style>
        </nav>
    );
}
