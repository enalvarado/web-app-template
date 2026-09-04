import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './Home'
import { LocaleProvider } from './context/LocaleContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LocaleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/f/:formId" element={<App />} />
        </Routes>
      </BrowserRouter>
    </LocaleProvider>
  </React.StrictMode>,
)
