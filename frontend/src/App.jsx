import { useState, useEffect } from 'react'
import './App.css'
import ChatBox from './components/ChatBot'
import Auth from './components/Auth'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('aibuddy_user');
    const savedToken = localStorage.getItem('aibuddy_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('aibuddy_user');
        localStorage.removeItem('aibuddy_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('aibuddy_user');
    localStorage.removeItem('aibuddy_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='App'>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className='App'>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">🎓 AI Buddy</h1>
            <p className="app-subtitle">Your intelligent study companion</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">👋 {user.name}</span>
              <div className="usage-info">
                {user.is_superuser ? (
                  <span className="usage-unlimited">♾️ Unlimited</span>
                ) : (
                  <span className="usage-count">
                    {user.prompts_used || 0}/{user.prompts_limit || 5} queries
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <ChatBox user={user} onUserUpdate={setUser} />
    </div>
  )
}

export default App
