import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Verses from './pages/Verses'
import { Header } from './components/Header'
import Meditation from './pages/Meditations'
import { LanguageProvider } from './context/Language'
import { Toaster } from 'sonner'
import Profile from './pages/Profile'
import Yoga from './pages/Yoga'

function App() {

  return (
      <div>
        <LanguageProvider>
            <Router>
          <Header/>
          <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='/profile' element = {<Profile/>}/>
            <Route path='/chat' element = {<Chat/>}/>
            <Route path='/login' element = {<Login/>}/>
            <Route path='/signup' element = {<SignUp/>}/>
            <Route path='/about' element = {<About/>}/>
            <Route path='/chapters' element = {<Chapters/>}/>
            <Route path='/verses' element = {<Verses/>}/>
            <Route path='/meditation' element = {<Meditation/>}/>
            <Route path='/yoga' element = {<Yoga/>}/>
            

          </Routes>
          <Toaster duration={5000} position='top-center'/>
        </Router>
        
        </LanguageProvider>
      </div>
  )
}

export default App
