import React from 'react'
import {useState} from 'react'
import '../auth.form.scss'
import {useNavigate,Link} from 'react-router'
import {useAuth} from '../hooks/useAuth.js'




export const Login = () => {
    const navigate = useNavigate();
    const {loading, handleLogin} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password});
        navigate('/');
    }
    if(loading) return <main
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #e5e5e5",
          borderTop: "5px solid #f8006b",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      <h3
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          color: "#333",
        }}
      >
        Loading...
      </h3>
    </div>

    <style>
      {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
  </main>


  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}   >
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input onChange={(e) => setEmail(e.target.value)}
                    type="email" id="email" name="email" placeholder="Enter your email" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input onChange={(e) => setPassword(e.target.value)}
                    type="password" id="password" name="password" placeholder="Enter your password" />
                </div>
                <button className="button primary-button">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link>  </p>
        </div>
    </main>
  )
}
export default Login