import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
    login,
    register,
    logout,
    getMe
} from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading
    } = context;

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
            const data = await register({
                username,
                email,
                password,
            });

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
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                // User not logged in
                if (error.response?.status === 401) {
                    setUser(null);
                } else {
                    console.error("Get Me Error:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};