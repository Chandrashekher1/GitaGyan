import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ThemeProvider } from './components/ui/theme-provider'
import { Chat } from './pages/Chat'

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Router>
          <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='/chat' element = {<Chat/>}/>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
