// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginController from './controllers/LoginController';
import HomeController from './controllers/HomeController'; // Importamos a Home
import CadastroUsuarioController from './controllers/CadastroUsuarioController';
import './index.css'; 

import DetalhesController from './controllers/DetalhesController';
import Layout from './views/Layout';
import CriarEventoController from './controllers/CriarEventoController';
import EditarEventoController from './controllers/EditarEventoController';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Se a pessoa acessar localhost:5173 vazio, manda pro /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginController />} />
        <Route path="/cadastro" element={<CadastroUsuarioController />} />
        
        {/* Rotas Agrupadas no Layout (Para O Sidebar não piscar) */}
        <Route element={<Layout />}>
          {/* Rota da Listagem de Eventos */}
          <Route path="/home" element={<HomeController />} />

          {/** Rota para novo Regitro */}
          <Route path="/registro" element={<CriarEventoController />} />

          {/* Criando a rota para edicao */}
          <Route path="/editar" element={<EditarEventoController/>}></Route>

          {/** Agora a rota de detalhes */}
          <Route path='/detalhes' element={<DetalhesController />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;