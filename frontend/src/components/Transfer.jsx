import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaHome } from "react-icons/fa";

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('https://bankapp-b5kg.onrender.com/api/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al recuperar el historial de transacciones');
            }
        };

        if (user) {
            fetchTransactions();
        }
    }, [user]);

    if (!user) return <div>Loading...</div>;

    return (
        <section className='flex min-h-full flex-col justify-center px-11 py-10'>
            <div className="sm:mx-auto sm:w-full sm:max-w-40 ">
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-2xl dark:text-black uppercase">
                    Historial de Transacciones
                </h2>
            </div>

            {error && <p>{error}</p>}

            <ul className='mt-6 space-y-4'>
                {transactions.length === 0 ? (
                    <p>No hay transacciones disponibles.</p>
                ) : (
                    transactions.map((transaction) => (
                        <li key={transaction._id} className="p-4 border border-gray-200 rounded-lg">
                            <p><strong>De:</strong> {transaction.from.username}</p>
                            <p><strong>A:</strong> {transaction.to.username}</p>
                            <p><strong>Monto:</strong> ${transaction.amount}</p>
                            <p><strong>Fecha:</strong> {new Date(transaction.date).toLocaleString()}</p>
                        </li>
                    ))
                )}
            </ul>

            <button 
                className='flex mt-4 w-full justify-center rounded-md 
                    bg-gray-500 px-3 py-1 text-sm font-semibold leading-6 text-white shadow-sm 
                    hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    focus-visible:outline-gray-600'
                onClick={() => window.location.href = '/dashboard'}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <FaHome style={{ marginRight: 8 }} />
                Home
            </button>
        </section>
    );
};

export default History;
