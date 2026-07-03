import React from 'react'
import {useNavigate,Link} from 'react-router'
import {useState} from 'react'
import {useAuth} from '../hooks/useAuth.js'

export const Register = () => {

    const navigate = useNavigate();
    const {loading, handleRegister} = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleRegister({username, email, password});
        navigate('/');
    }

    if(loading) return (
        <main className="h-screen flex justify-center items-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-[50px] h-[50px] border-[5px] border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
                <h3 className="m-0 font-sans text-gray-800">Loading...</h3>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1746003288323-89dba68721f6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">
            <div className="w-full max-w-md rounded-[32px] bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-12">
                <h1 className="text-center text-3xl font-bold text-gray-900 mb-10 tracking-tight">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-semibold text-gray-800">Username:</label>
                        <input
                            className="w-full rounded-full border border-gray-300/70 bg-white/40 backdrop-blur-sm px-5 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white/60 transition-all"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-800">Email:</label>
                        <input
                            className="w-full rounded-full border border-gray-300/70 bg-white/40 backdrop-blur-sm px-5 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white/60 transition-all"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-800">Password:</label>
                        <input
                            className="w-full rounded-full border border-gray-300/70 bg-white/40 backdrop-blur-sm px-5 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white/60 transition-all"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="mt-4 w-full rounded-full bg-gray-900 hover:bg-black text-white font-medium py-3.5 shadow-lg shadow-gray-900/20 transition-all active:scale-[0.98] cursor-pointer">
                        Register
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-700 px-4">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-black">Login</Link>
                </p>
            </div>
        </main>
    )
}
export default Register