import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function register({username, email, password}){
    try{
        const response = await axios.post(`${API_URL}/api/auth/register`,{
            username,
            email,
            password
        },{ withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function login({email, password}){
    try{
        const response = await axios.post(`${API_URL}/api/auth/login`,{
            email,
            password
        },{ withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function logout(){
    try{
        const response = await axios.get(`${API_URL}/api/auth/logout`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe(){ 
    try{
        const response = await axios.get(`${API_URL}/api/auth/get-me`, { withCredentials: true });
        return response.data;   
    }
    catch (error) { 
        throw error;
    }
}
