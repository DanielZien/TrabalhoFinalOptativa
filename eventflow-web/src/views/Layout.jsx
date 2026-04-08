import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
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
