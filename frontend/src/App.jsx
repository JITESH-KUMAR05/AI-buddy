import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatBox from './combonents/ChatBot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <header className="app-header">
        <h1 className="app-title">🎓 AI Buddy</h1>
        <p className="app-subtitle">Your intelligent study companion</p>
      </header>
      <ChatBox />
    </div>
  )
}

export default App
