import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaExchangeAlt, FaUser, FaMoneyBillWave, FaHome } from "react-icons/fa";
import toast from 'react-hot-toast';

const Transfer = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const { user } = useContext(AuthContext);

    const handleTransfer = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://bankapp-f4r4.onrender.com/api/transactions/transfer', 
                { from: user._id, to, amount }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            toast.success('Transferencia realizada con éxito');
            setTo('');
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al realizar la transferencia');
        }
    };

    if (!user) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <FaExchangeAlt className="text-2xl text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Realizar Transferencia
                    </h2>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <form className="space-y-6" onSubmit={handleTransfer}>
                        {/* From Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Desde
                            </label>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <FaUser className="text-gray-400" />
                                <input 
                                    type="text" 
                                    value={user._id} 
                                    readOnly 
                                    className="bg-transparent flex-1 text-gray-600 outline-none" 
                                />
                            </div>
                        </div>

                        {/* To Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID del Beneficiario
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={to} 
                                    onChange={(e) => setTo(e.target.value)} 
                                    placeholder="Ingrese el ID del beneficiario" 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                    transition-all duration-200 bg-gray-50 hover:bg-white
                                    placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Amount Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Monto a Transferir
                            </label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    placeholder="Ingrese el monto" 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                    transition-all duration-200 bg-gray-50 hover:bg-white
                                    placeholder-gray-400"
                                />
                                <FaMoneyBillWave className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <button 
                                type="submit"
                                className="w-full flex justify-center items-center space-x-2 px-4 py-3 
                                bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                                transition-all duration-200 transform hover:scale-[1.02] 
                                shadow-md hover:shadow-lg font-medium"
                            >
                                <FaExchangeAlt />
                                <span>Realizar Transferencia</span>
                            </button>

                            <button 
                                type="button"
                                onClick={() => window.location.href = '/dashboard'}
                                className="w-full flex justify-center items-center space-x-2 px-4 py-3 
                                bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg 
                                transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <FaHome />
                                <span>Volver al Inicio</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transfer;
