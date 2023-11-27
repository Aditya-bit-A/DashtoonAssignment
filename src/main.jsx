import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <p style={{color: "while"}}><b> Left side contains list of generated images and Right page of the comic where you can merge images generated in a page by moving images on canvas (Not working properly). </b></p>
    <App />
  </React.StrictMode>,
)
