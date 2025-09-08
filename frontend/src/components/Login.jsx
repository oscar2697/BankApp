import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bank from '../assets/bank.jpg';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result && result.error) {
                toast.error(result.message);
            } else if (result && result.success) {
                toast.success('¡Inicio de sesión exitoso!');
            }
        } catch (error) {
            toast.error('Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <img 
                        className="mx-auto h-16 w-auto mb-6" 
                        src={bank} 
                        alt="Logo Banco"
                    />
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Bienvenido
                    </h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Ingresa tus credenciales para acceder
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="email"
                        >
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                                focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                                placeholder-gray-400 bg-white text-gray-900"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                                focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                                placeholder-gray-400 bg-white text-gray-900"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent 
                            rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 
                            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-indigo-500 transition-all duration-200"
                        >
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <span className="text-gray-500">¿No tienes una cuenta?</span>
                        <Link 
                            to="/register" 
                            className="font-medium text-indigo-600 hover:text-indigo-500 
                            transition-colors duration-200"
                        >
                            Regístrate aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
