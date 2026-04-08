import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginView({ 
    email, 
    setEmail, 
    senha, 
    setSenha, 
    erro, 
    carregando, 
    aoEnviarFormulario 
}) {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">EventFlow Login</h3>
                
                {/* Exibe mensagem de erro se houver */}
                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={aoEnviarFormulario}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="exemplo@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="senha" className="form-label">Senha</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="senha" 
                            placeholder="******"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 mt-3"
                        disabled={carregando}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>Não tem uma conta? <Link to="/cadastro" className="text-primary fw-bold text-decoration-none">Registre-se</Link></small>
                </div>
            </div>
        </div>
    );
}