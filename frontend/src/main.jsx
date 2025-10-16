import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

// Configure axios base URL for production
// In development, Vite proxy handles /api requests
// In production (Vercel), requests go to the same origin
axios.defaults.baseURL = import.meta.env.PROD ? window.location.origin : ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
