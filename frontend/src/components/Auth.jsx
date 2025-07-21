import React, { useState, useEffect } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const endpoint = isLogin ? '/login' : '/register';
      
      const payload = isLogin 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('aibuddy_user', JSON.stringify(data.user));
        localStorage.setItem('aibuddy_token', data.token);
        onLogin(data.user);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // For now, we'll implement a simple mock Google login
    // In production, you'd integrate with Google OAuth
    const googleUser = {
      id: 'google_' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google',
      promptsUsed: 0,
      promptsLimit: 5
    };
    
    localStorage.setItem('aibuddy_user', JSON.stringify(googleUser));
    localStorage.setItem('aibuddy_token', 'google_token_' + Date.now());
    onLogin(googleUser);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back!' : 'Join AI Buddy'}
          </h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to continue your learning journey' 
              : 'Create an account to get started'
            }
          </p>
        </div>

        <div className="auth-form">
          <button 
            className="google-login-btn"
            onClick={handleGoogleLogin}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="form-input"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="auth-switch-btn"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="usage-info">
            <p className="usage-text">
              🎁 <strong>Free Plan:</strong> 5 AI queries per account
            </p>
            <p className="usage-text">
              💎 <strong>Super User:</strong> teamaibuddy@gmail.com (Unlimited)
            </p>
            <p className="contact-text">
              Need more queries? <a href="https://linkedin.com/in/jitesh-kumar05" target="_blank" rel="noopener noreferrer">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
