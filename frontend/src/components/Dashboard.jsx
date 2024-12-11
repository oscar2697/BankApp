import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import History from './History';
import { IoIosLogOut } from "react-icons/io";
import { FaUser, FaIdCard, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-full md:w-80 p-6 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            Bienvenido,
                        </h1>
                        <p className="text-lg text-indigo-600 font-semibold">
                            {user.name}
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="space-y-6 bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <FaUser className="text-indigo-500 text-xl" />
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-medium text-gray-800">{user.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <FaIdCard className="text-indigo-500 text-xl" />
                            <div>
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="font-medium text-gray-800">{user._id}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <FaMoneyBillWave className="text-indigo-500 text-xl" />
                            <div>
                                <p className="text-sm text-gray-500">Saldo</p>
                                <p className="font-medium text-gray-800">${user.balance}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex-grow">
                        {user.role === 'client' && (
                            <Link
                                to="/transfer"
                                className="block w-full px-4 py-3 text-center bg-indigo-600 hover:bg-indigo-700 
                                text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                                shadow-md hover:shadow-lg"
                            >
                                Realizar Transferencia
                            </Link>
                        )}

                        {user.role === 'cashier' && (
                            <Link
                                to="/cashier"
                                className="block w-full px-4 py-3 text-center bg-indigo-600 hover:bg-indigo-700 
                                text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                                shadow-md hover:shadow-lg"
                            >
                                Realizar Operaciones
                            </Link>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="mt-auto flex items-center justify-center space-x-2 w-full px-4 py-3 
                        bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 
                        transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                    >
                        <IoIosLogOut className="text-xl" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Historial de Transacciones
                    </h2>
                    <div className="overflow-hidden">
                        <History />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
