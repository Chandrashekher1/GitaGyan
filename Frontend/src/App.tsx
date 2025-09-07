import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'

function App() {

  return (
      <div>
        <Router>
          <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='/chat' element = {<Chat/>}/>
            <Route path='/login' element = {<Login/>}/>
            <Route path='/signup' element = {<SignUp/>}/>

          </Routes>
        </Router>
      </div>
  )
}

export default App
