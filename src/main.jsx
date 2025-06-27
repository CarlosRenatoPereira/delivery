import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Rotas from './Paginas/Rotas.jsx'
import { CarrinhoProvider } from './contexts/CarrinhoProvider.jsx';
import { ClienteProvider } from './contexts/ClienteProvider';

createRoot(document.getElementById('root')).render(
  
  <ClienteProvider>
    <CarrinhoProvider>
      <Rotas />
    </CarrinhoProvider>,
  </ClienteProvider>
)
