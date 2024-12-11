import { useState } from 'react';
import axios from 'axios';
import { FaMoneyBillWave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Loan = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');

    const handleLoan = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://bankapp-b5kg.onrender.com/api/transactions/loan', 
                { to, amount }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            toast.success('Préstamo realizado con éxito');
            setTo('');
            setAmount('');
        } catch (err) {
            console.error(err);
            toast.error('Error al procesar el préstamo');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
                <FaMoneyBillWave className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-bold text-gray-800">Préstamo</h2>
            </div>

            <form className="space-y-4" onSubmit={handleLoan}>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        ID del Beneficiario
                    </label>
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

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Monto del Préstamo
                    </label>
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
                </div>

                <button 
                    type="submit"
                    className="w-full flex justify-center items-center space-x-2 px-4 py-3 
                    bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                    transition-all duration-200 transform hover:scale-[1.02] 
                    shadow-md hover:shadow-lg font-medium"
                >
                    <FaMoneyBillWave />
                    <span>Realizar Préstamo</span>
                </button>
            </form>
        </div>
    );
};

export default Loan;