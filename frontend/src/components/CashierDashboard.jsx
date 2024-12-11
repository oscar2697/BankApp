import Deposit from './Deposit';
import Loan from './Loan';
import bank from '../assets/bank.jpg';
import ClientBalances from './ClientBalances';
import { IoIosLogOut } from 'react-icons/io';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Interest from './Interest';
import { FaUser } from 'react-icons/fa';

const CashierDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img 
                                className="h-12 w-auto" 
                                src={bank} 
                                alt="Bank Logo" 
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Dashboard del Cajero
                                </h1>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaUser className="text-indigo-500" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 
                            hover:bg-red-600 text-white rounded-lg transition-all duration-200 
                            transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                        >
                            <IoIosLogOut className="text-xl" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Operations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <Deposit />
                    </div>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <Interest />
                    </div>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <Loan />
                    </div>
                </div>

                {/* Client Balances Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Balances de Clientes
                    </h2>
                    <div className="overflow-hidden">
                        <ClientBalances />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashierDashboard;
