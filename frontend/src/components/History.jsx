import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaUser, FaCalendarAlt, FaMoneyBillWave, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(5);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://bankapp-f4r4.onrender.com/api/transactions/history', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            } catch (error) {
                toast.error('Error al cargar el historial de transacciones');
                setTransactions([]);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Paginación
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-full">
                    <FaHistory className="text-xl text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Movimientos Recientes
                </h2>
            </div>

            <div className="space-y-4">
                {currentTransactions.map(tx => (
                    <div 
                        key={tx._id} 
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg 
                        transition-all duration-300 transform hover:scale-[1.01] border border-gray-100"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <FaUser className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Desde</p>
                                    <p className="font-medium text-gray-800">{tx.from}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <FaExchangeAlt className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Beneficiario</p>
                                    <p className="font-medium text-gray-800">{tx.to.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <FaMoneyBillWave className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Monto</p>
                                    <p className="font-medium text-gray-800">${tx.amount.toLocaleString('es-ES')}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <FaCalendarAlt className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fecha</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(tx.date).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {transactions.length > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx + 1}
                            onClick={() => paginate(idx + 1)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                currentPage === idx + 1
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {transactions.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No hay transacciones registradas</p>
                </div>
            )}
        </div>
    );
};

export default History;
