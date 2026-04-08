import React from 'react';

export default function RegistroView({ estados, acoes }) {
    return (
        <div className="bg-light min-vh-100">
            <nav className="navbar navbar-light bg-white shadow-sm mb-4">
                <div className="container">
                    <a className="navbar-brand fw-bold text-dark" href="/"> Voltar</a>
                    <span className="navbar-text fw-bold">Criar Novo Evento</span>
                </div>
            </nav>

            <div className="container pb-5" style={{ maxWidth: '800px' }}>
                <div className="card border-0 shadow-sm p-4 rounded-4">
                    <form onSubmit={acoes.salvarEvento}>
                        
                        <h5 className="mb-3 fw-bold">Informações Básicas</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <label>Título do Evento *</label>
                                <input type="text" className="form-control" required 
                                       value={estados.titulo} onChange={e => acoes.setTitulo(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label>Categoria *</label>
                                <select className="form-select" required 
                                        value={estados.categoria} onChange={e => acoes.setCategoria(e.target.value)}>
                                    <option value="Palestra">Palestra</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Show">Show</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label>Descrição *</label>
                                <textarea className="form-control" rows="3" required 
                                          value={estados.descricao} onChange={e => acoes.setDescricao(e.target.value)}></textarea>
                            </div>
                        </div>

                        <h5 className="mb-3 mt-4 fw-bold">Imagens do Evento</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-12">
                                <label>Selecione até 4 imagens (A primeira será a capa) *</label>
                                <input type="file" className="form-control" accept="image/png, image/jpeg, image/jpg" 
                                       multiple required onChange={acoes.handleImagens} />
                                
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    {estados.previews.map((src, index) => (
                                        <img key={index} src={src} alt={`Preview ${index}`} className="rounded border shadow-sm" 
                                             style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <h5 className="mb-3 fw-bold">Data, Hora e Ingresso</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label>Data *</label>
                                <input type="date" className="form-control" required 
                                       value={estados.data} onChange={e => acoes.setData(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label>Hora Início *</label>
                                <input type="time" className="form-control" required 
                                       value={estados.horaInicio} onChange={e => acoes.setHoraInicio(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label>Hora Fim *</label>
                                <input type="time" className="form-control" required 
                                       value={estados.horaFim} onChange={e => acoes.setHoraFim(e.target.value)} />
                            </div>
                            <div className="col-md-4 mt-3">
                                <label>Preço (R$) *</label>
                                <input type="number" className="form-control" step="0.01" min="0" required 
                                       value={estados.preco} onChange={e => acoes.setPreco(e.target.value)} />
                                <small className="text-muted">Deixe 0 para Gratuito</small>
                            </div>
                        </div>

                        <h5 className="mb-3 fw-bold">Localização (ViaCEP)</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label>CEP *</label>
                                <input type="text" className="form-control" placeholder="00000-000" required 
                                       value={estados.cep} onChange={e => acoes.setCep(e.target.value)} onBlur={acoes.buscarCep} />
                            </div>
                            <div className="col-md-6">
                                <label>Rua/Avenida</label>
                                <input type="text" className="form-control" required 
                                       value={estados.rua} onChange={e => acoes.setRua(e.target.value)} />
                            </div>
                            <div className="col-md-2">
                                <label>Número *</label>
                                <input type="text" className="form-control" required 
                                       value={estados.numero} onChange={e => acoes.setNumero(e.target.value)} />
                            </div>
                            <div className="col-md-5">
                                <label>Bairro</label>
                                <input type="text" className="form-control" required 
                                       value={estados.bairro} onChange={e => acoes.setBairro(e.target.value)} />
                            </div>
                            <div className="col-md-5">
                                <label>Cidade</label>
                                <input type="text" className="form-control" required 
                                       value={estados.cidade} onChange={e => acoes.setCidade(e.target.value)} />
                            </div>
                            <div className="col-md-2">
                                <label>UF</label>
                                <input type="text" className="form-control" required 
                                       value={estados.uf} onChange={e => acoes.setUf(e.target.value)} maxLength="2" />
                            </div>
                        </div>

                        <button type="submit" className="btn w-100 fw-bold py-2 text-white" 
                                disabled={estados.salvando} style={{ backgroundColor: '#0b0080', borderRadius: '8px' }}>
                            {estados.salvando ? 'Salvando (Fazendo upload)...' : 'Salvar Evento'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}