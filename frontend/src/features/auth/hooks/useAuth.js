import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout } from "../services/auth.api.js";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (error) {
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (error) {
            console.error("Register Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            navigate("/"); // ← home pe bhejo, login pe nahi
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout };
};