import React from 'react';
import { Link } from 'react-router-dom';

export default function CadastroUsuarioView({ 
    nome, setNome,
    email, setEmail, 
    telefone, setTelefone,
    senha, setSenha, 
    erro, 
    carregando, 
    aoEnviarFormulario 
}) {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '450px' }}>
                <h3 className="text-center mb-4 text-primary fw-bold">Novo Usuário</h3>
                
                {/* Exibe mensagem de erro se houver */}
                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={aoEnviarFormulario}>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label text-muted fw-bold small mb-1">Nome Completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nome" 
                            placeholder="João das Neves"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-muted fw-bold small mb-1">E-mail</label>
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
                        <label htmlFor="telefone" className="form-label text-muted fw-bold small mb-1">Telefone</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="telefone" 
                            placeholder="(11) 98000-0000"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="senha" className="form-label text-muted fw-bold small mb-1">Senha</label>
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
                        className="btn w-100 fw-bold py-2 text-white"
                        style={{ backgroundColor: '#000080', borderRadius: '8px' }}
                        disabled={carregando}
                    >
                        {carregando ? 'Registrando...' : 'Criar Conta'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <small>Já tem uma conta? <Link to="/login" className="text-primary fw-bold text-decoration-none">Entre aqui</Link></small>
                </div>
            </div>
        </div>
    );
}
