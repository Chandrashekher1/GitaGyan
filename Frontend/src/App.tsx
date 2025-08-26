import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Startup } from './pages/startup'
import { Home } from './pages/Home'
import { ThemeProvider } from './components/ui/theme-provider'
import { Header } from './components/Header'
import { Chat } from './pages/Chat'
import LoginPage from './pages/Login'
import SignUpPage from './pages/Signup'

function App() {
  const [showStartup, setShowStartup] = useState(true)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //       setShowStartup(false)
  //   }, 5000)

  //   return () => clearTimeout(timer)
  // },[])

  // if(showStartup){
  //   return <Startup/>
  // }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='bg-black'>
        <Router>
          <Header/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/signIn' element={<LoginPage/>}/>
            <Route path='/register' element={<SignUpPage/>}/>


          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
