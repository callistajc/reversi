import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainMenu from './pages/MainMenu'
import Game from "./pages/Game"
import HowToPlay from "./pages/HowToPlay"
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/how-to-play" element={<HowToPlay />}/>
      </Routes>
    </Router>
  </React.StrictMode>,
)