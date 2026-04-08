import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    const token = localStorage.getItem('token');

    // Se o token não existir, o usuário não tem permissão de ver essa página
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container-fluid bg-white" style={{ minHeight: '100vh' }}>
            <div className="row">
                {/* A Barra Lateral Fixed */}
                <Sidebar />

                {/* Área Dinâmica do Router (Home, Registro, Detalhes etc) */}
                <main className="col-md-9 col-lg-8 mx-auto p-3 p-md-2" style={{ minHeight: '100vh' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
