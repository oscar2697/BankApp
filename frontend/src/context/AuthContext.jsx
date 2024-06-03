import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error(err);
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            if (res.data.user.role === 'cashier') {
                navigate('/cashier');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
