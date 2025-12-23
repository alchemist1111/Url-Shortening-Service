import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UrlProvider } from './context/AppContext.jsx';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UrlProvider>
        <App />
      </UrlProvider>
    </BrowserRouter>
  </StrictMode>,
)
