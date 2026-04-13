import React from 'react';
import { Link } from 'react-router-dom';

export default function CadastroUsuarioView({ 
    nome, setNome, email, setEmail, telefone, setTelefone,
    senha, setSenha, confirmarSenha, setConfirmarSenha, lidarComImagem, 
    erro, carregando, aoEnviarFormulario,
    isEdicao // <-- A mágica acontece aqui
}) {

    const lidarComTelefone = (evento) => {
        let valor = evento.target.value;
        
        // Remove tudo que não for número
        valor = valor.replace(/\D/g, ''); 
        
        // Aplica a formatação: (XX) XXXXX-XXXX
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d{1,4})/, '$1-$2');
        
        // Impede que o usuário digite mais do que 11 números (DDD + 9 dígitos)
        valor = valor.replace(/(-\d{4})\d+?$/, '$1');

        // Salva no estado
        setTelefone(valor);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: '20px 0' }}>
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '450px', borderRadius: '10px' }}>
                
                {/* Título Dinâmico */}
                <h3 className="text-center mb-4 text-primary fw-bold" style={{ color: '#0056b3' }}>
                    {isEdicao ? 'Editar Perfil' : 'Novo Usuário'}
                </h3>
                
                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={aoEnviarFormulario}>
                    {/* NOME */}
                    <div className="mb-3">
                        <label className="form-label text-muted fw-bold small mb-1">Nome Completo</label>
                        <input 
                            type="text" className="form-control" 
                            placeholder="João das Neves" value={nome} 
                            onChange={(e) => setNome(e.target.value)} required 
                        />
                    </div>

                    {/* E-MAIL */}
                    <div className="mb-3">
                        <label className="form-label text-muted fw-bold small mb-1">E-mail</label>
                        <input 
                            type="email" className="form-control" 
                            placeholder="exemplo@email.com" value={email} 
                            onChange={(e) => setEmail(e.target.value)} required 
                        />
                    </div>

                    {/* TELEFONE */}
                    <div className="mb-3">
                        <label className="form-label text-muted fw-bold small mb-1">Telefone</label>
                        <input 
                            type="text" className="form-control" 
                            placeholder="(11) 98000-0000" 
                            value={telefone} 
                            onChange={lidarComTelefone} // <-- Usando a nova função aqui!
                            required 
                        />
                    </div>

                    {/* FOTO */}
                    <div className="mb-3">
                        <label className="form-label text-muted fw-bold small mb-1">
                            Foto de Perfil {isEdicao ? '(Nova)' : '(Opcional)'}
                        </label>
                        <input 
                            type="file" className="form-control" 
                            onChange={lidarComImagem} accept="image/*" 
                        />
                    </div>

                    {/* SENHA */}
                    <div className="mb-3">
                        <label className="form-label text-muted fw-bold small mb-1">
                            Senha {isEdicao && <span className="fw-normal text-info" style={{fontSize: '0.8em'}}>(Deixe em branco para manter a atual)</span>}
                        </label>
                        <input 
                            type="password" className="form-control" 
                            placeholder="******" value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                            required={!isEdicao} // Só é obrigatória se NÃO for edição
                        />
                    </div>

                    {/* CONFIRMAR SENHA */}
                    <div className="mb-4">
                        <label className="form-label text-muted fw-bold small mb-1">Confirmar Senha</label>
                        <input 
                            type="password" className="form-control" 
                            placeholder="******" value={confirmarSenha} 
                            onChange={(e) => setConfirmarSenha(e.target.value)} 
                            required={!isEdicao && senha.length > 0} 
                        />
                    </div>

                    {/* BOTÃO DINÂMICO */}
                    <button 
                        type="submit" 
                        className={`btn w-100 fw-bold py-2 text-white`}
                        style={{ backgroundColor: isEdicao ? '#ffc107' : '#000080', borderRadius: '8px' }}
                        disabled={carregando}
                    >
                        {carregando ? 'Processando...' : (isEdicao ? 'Salvar Alterações' : 'Criar Conta')}
                    </button>
                </form>

                {/* LINK DE LOGIN (Escondido na edição) */}
                {!isEdicao && (
                    <div className="text-center mt-3">
                        <small>Já tem uma conta? <Link to="/login" className="text-primary fw-bold text-decoration-none">Entre aqui</Link></small>
                    </div>
                )}
            </div>
        </div>
    );
}