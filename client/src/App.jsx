import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AiAssistant from './pages/AiAssistant'
import Markets from './pages/Markets'
import Settings from './pages/Settings'

function App() {
  const [count, setCount] = useState(0)

  return (<BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/ai-assistant' element={< AiAssistant/>} />
      <Route path='/markets' element={<Markets />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  </BrowserRouter>)

}

export default App
