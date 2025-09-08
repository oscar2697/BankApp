import { useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const WithdrawalForm = ({ clientId, currentBalance, onWithdrawal, onBalanceUpdate }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!amount || amount <= 0) {
            toast.error('Por favor ingrese un monto válido');
            setLoading(false);
            return;
        }

        if (amount > currentBalance) {
            toast.error('Saldo insuficiente');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://bankapp-f4r4.onrender.com/api/transactions/withdraw',
                {
                    clientId,
                    amount: Number(amount)
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onBalanceUpdate(response.data.newBalance);
            onWithdrawal(response.data.transaction);
            
            toast.success('Retiro realizado con éxito');
            setAmount('');
        } catch (error) {
            toast.error('Error al realizar el retiro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-indigo-600" />
                Realizar Retiro
            </h3>
            <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto a retirar
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full pl-7 pr-12 py-2 rounded-lg border border-gray-300 
                                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                     transition-all duration-200"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                        Balance disponible: <span className="font-semibold text-gray-800">
                            ${currentBalance.toLocaleString('es-ES')}
                        </span>
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm 
                              text-sm font-medium text-white bg-indigo-600 
                              hover:bg-indigo-700 focus:outline-none focus:ring-2 
                              focus:ring-offset-2 focus:ring-indigo-500 
                              transition-colors duration-200
                              ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Procesando...
                        </div>
                    ) : (
                        'Realizar Retiro'
                    )}
                </button>
            </form>
        </div>
    );
};

export default WithdrawalForm; 