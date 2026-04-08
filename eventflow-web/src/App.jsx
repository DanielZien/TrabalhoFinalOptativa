// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginController from './controllers/LoginController';
import HomeController from './controllers/HomeController'; // Importamos a Home
import './index.css'; 
import  RegistrarEventoController  from './controllers/RegistrarEventoController';
import DetalhesController from './controllers/DetalhesController';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Se a pessoa acessar localhost:5173 vazio, manda pro /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rota do Login */}
        <Route path="/login" element={<LoginController />} />
        
        {/* Rota da Listagem de Eventos */}
        <Route path="/home" element={<HomeController />} />

        {/** Rota para novo Regitro */}
        <Route path="/registro" element={<RegistrarEventoController/>}></Route>

        {/** Agora a rota de detalhes */}
        {<Route path='/detalhes' element={<DetalhesController></DetalhesController>}></Route>}
      </Routes>
    </BrowserRouter>
  )
}

export default App;