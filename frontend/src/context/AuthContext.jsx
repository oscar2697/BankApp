import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://bankapp-f4r4.onrender.com/api/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    setUser(res.data);
                    setAuth(true);
                })
                .catch(err => {
                    localStorage.removeItem('token');
                    setAuth(false);
                });
        }
    }, []);
    
    const login = async (email, password) => {
        try {
            const response = await axios.post('https://bankapp-f4r4.onrender.com/api/users/login', {
                email,
                password
            });
            
            if (response.data && response.data.token) {
                setAuth(true);
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
                return { success: true };
            }
        } catch (error) {
            return { error: true, message: error.response?.data?.message || 'Error al iniciar sesión' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setAuth(false);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, auth, login, logout, useAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
