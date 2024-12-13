import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHistory, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AccountMovements = ({ clientId, isAdmin }) => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovements = async () => {
            const token = localStorage.getItem('token');
            try {
                const url = isAdmin 
                    ? 'http://localhost:5000/api/transactions/all'
                    : `http://localhost:5000/api/transactions/client/${clientId}`;
                
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMovements(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error al cargar los movimientos');
                setLoading(false);
            }
        };

        fetchMovements();
    }, [clientId, isAdmin]);

    if (loading) {
        return <div className="animate-spin">Cargando...</div>;
    }

    return (
        <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <FaHistory className="text-indigo-600 text-xl" />
                <h3 className="text-xl font-bold">Movimientos de Cuenta</h3>
            </div>

            <div className="space-y-2">
                {movements.map((movement) => (
                    <div 
                        key={movement._id} 
                        className={`p-3 rounded-lg ${
                            movement.type === 'deposit' 
                                ? 'bg-green-50' 
                                : 'bg-red-50'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <FaMoneyBillWave className="text-gray-600" />
                                    <span className="font-medium">
                                        {movement.type === 'deposit' ? 'Depósito' : 'Retiro'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <FaCalendar />
                                    <span>
                                        {new Date(movement.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <span className={`text-lg ${
                                movement.type === 'deposit' 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                            }`}>
                                {movement.type === 'deposit' ? '+' : '-'}
                                ${movement.amount.toLocaleString('es-ES')}
                            </span>
                        </div>
                    </div>
                ))}

                {movements.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        No hay movimientos registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountMovements; 