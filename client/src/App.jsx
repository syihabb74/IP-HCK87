import './App.css'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AiAssistant from './pages/AiAssistant'
import Markets from './pages/Markets'
import Settings from './pages/Settings'
import Portofolio from './pages/Portofolio'
import store from './store/store'
import { Provider } from 'react-redux'
import AuthLayout from './layouts/AuthLayout'

function App() {

  return <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='' element={<AuthLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/ai-assistant' element={< AiAssistant />} />
          <Route path='/markets' element={<Markets />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/portofolio' element={<Portofolio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>




}

export default App
