import { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://bankapp-b5kg.onrender.com/api/transactions/history', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTransactions(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
                setTransactions([]);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className='p-4'>
            <div className='font-black text-3xl text-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 uppercase">Historial de Transacciones</h1>
            </div>

            <div className='flex-1 p-4 flex items-center'>
                <div className='w-full max-w-5xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800 text-white'>
                    <ul className='space-y-4'>
                        {transactions.map(tx => (
                            <li key={tx._id} className="p-6 bg-gray-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <p>
                                    <strong className='text-gray-300'>Desde: </strong> 
                                    {tx.from}
                                </p>

                                <p>
                                    <strong className='text-gray-300'>Beneficiario: </strong> 
                                    {tx.to.name}
                                </p>

                                <p>
                                    <strong className='text-gray-300'>Monto: </strong> 
                                    ${tx.amount}
                                </p>

                                <p>
                                    <strong className='text-gray-300'>Fecha: </strong> 
                                    {new Date(tx.date).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default History;
