import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import History from './History';
import { IoIosLogOut } from "react-icons/io";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="flex h-screen">
            <div className="w-1/4 p-6 border-r border-gray-200 dark:border-gray-800 bg-gray-800 dark:bg-gray-900 text-white flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-6 uppercase text-gray-300">
                        Bienvenido, {user.name}
                    </h1>

                    <div className="space-y-4">
                        <h3>
                            <strong className="text-gray-300">Role: </strong>
                            {user.role}
                        </h3>

                        <h3>
                            <strong className="text-gray-300">Id: </strong>
                            {user._id}
                        </h3>

                        <p>
                            <strong className="text-gray-300">Saldo: </strong>
                            ${user.balance}
                        </p>
                    </div>

                    {user.role === 'client' && (
                        <nav className="mt-8">
                            <Link
                                to="/transfer"
                                className="block py-2 px-4 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 text-center mb-4"
                            >
                                Realiza una Transferencia
                            </Link>
                        </nav>
                    )}

                    {user.role === 'cashier' && (
                        <nav className="mt-8">
                            <Link
                                to="/cashier"
                                className="block py-2 px-4 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 text-center"
                            >
                                Realizar Operaciones
                            </Link>
                        </nav>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={logout}
                        className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-2"
                    >
                        <IoIosLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            
            <div className="flex-grow p-6 bg-white overflow-y-auto">
                <History />
            </div>
        </div>
    );
};

export default Dashboard;
