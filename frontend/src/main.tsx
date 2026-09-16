import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './Home'
import { LocaleProvider } from './context/LocaleContext'
import { IdentityProvider } from './context/IdentityContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <IdentityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/f/:formId" element={<App />} />
          </Routes>
        </BrowserRouter>
      </IdentityProvider>
    </LocaleProvider>
  </React.StrictMode>,
)
