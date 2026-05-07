import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/login/Login.jsx';
import Cadastro from './pages/cadastro/Cadastro.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Cadastro/>
  </StrictMode>,
)
