import { useState } from 'react';
import axios from 'axios';
import { FaPercent } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Interest = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');

    const handleInterest = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://bankapp-f4r4.onrender.com/api/transactions/interest', 
                { to, amount }, 
                { headers: { Authorization: `Bearer ${token}` }}
            );
            toast.success('Interés aplicado exitosamente');
            setTo('');
            setAmount('');
        } catch (err) {
            toast.error('Error al aplicar el interés');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
                <FaPercent className="text-2xl text-indigo-500" />
                <h2 className="text-xl font-bold text-gray-800">Interés</h2>
            </div>

            <form className="space-y-4" onSubmit={handleInterest}>
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
                        Monto del Interés
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
                    <FaPercent />
                    <span>Aplicar Interés</span>
                </button>
            </form>
        </div>
    );
};

export default Interest;
