import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { Startup } from './pages/startup'

function App() {
  const [showStartup, setShowStartup] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowStartup(false)
    }, 5000)

    return () => clearTimeout(timer)
  },[])

  if(showStartup){
    return <Startup/>
  }

  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path='/' element={<Home/>}/> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
