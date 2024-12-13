import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import bank  from '../assets/bank.jpg'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas del lado del cliente
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!email.includes('@')) {
            toast.error('Por favor ingresa un email válido');
            return;
        }

        if (name.length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }

        try {
            const res = await axios.post('https://bankapp-f4r4.onrender.com/api/users/register', {
                name,
                email,
                password,
                role
            });

            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                await login(email, password);
                toast.success('¡Cuenta creada exitosamente!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Manejamos diferentes tipos de errores
            if (error.response) {
                // El servidor respondió con un estado de error
                switch (error.response.status) {
                    case 400:
                        if (error.response.data.message) {
                            toast.error(error.response.data.message);
                        } else {
                            toast.error('Error en los datos proporcionados');
                        }
                        break;
                    case 409:
                        toast.error('El email ya está registrado');
                        break;
                    default:
                        toast.error('Error al crear la cuenta');
                }
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta
                toast.error('No se pudo conectar con el servidor');
            } else {
                // Error al configurar la petición
                toast.error('Error al procesar la solicitud');
            }
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
                        Crear Cuenta
                    </h2>
                    <p className="text-sm text-gray-600 mb-8">
                        Ingresa tus datos para registrarte
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="name"
                        >
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                            focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                            placeholder-gray-400 bg-white text-gray-900"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="email"
                        >
                            Correo Electrónico
                        </label>
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

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>
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

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="role"
                        >
                            Tipo de Usuario
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 
                            focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
                            bg-white text-gray-900"
                        >
                            <option value="client">Cliente</option>
                            <option value="cashier">Cajero</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent 
                            rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 
                            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                            focus:ring-indigo-500 transition-all duration-200"
                        >
                            Crear Cuenta
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-sm">
                        <span className="text-gray-500">¿Ya tienes una cuenta?</span>
                        <Link 
                            to="/" 
                            className="font-medium text-indigo-600 hover:text-indigo-500 
                            transition-colors duration-200"
                        >
                            Inicia sesión aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
