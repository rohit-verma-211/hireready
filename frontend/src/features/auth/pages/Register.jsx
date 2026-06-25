import React from 'react'
import {useNavigate,Link} from 'react-router'
import {useState} from 'react'


export const Register = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleRegister({username, email, password});
        navigate('/');

        // Handle registration logic here
    }
    if(loading) return (
  <main
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
);

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}   >
                <div className="input-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Enter your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="button primary-button">Register</button>
            </form>

            <p>Already have an account? <Link to="/login">Login</Link>  </p>
        </div>
    </main>
  )
}
export default Register
