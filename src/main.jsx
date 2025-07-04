import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ServicioProvider } from './context/ServicioContext.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ServicioProvider>
    <App />
    <Toaster position="top-right" reverseOrder={false} />
    </ServicioProvider>
  </React.StrictMode>,
)
