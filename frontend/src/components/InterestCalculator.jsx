import { useState } from 'react';
import { FaCalculator, FaPercentage, FaMoneyBillWave } from 'react-icons/fa';

const InterestCalculator = ({ balance }) => {
    const [months, setMonths] = useState(1);
    const annualRate = 0.12; // 12% anual

    const calculateInterest = () => {
        const monthlyRate = annualRate / 12;
        const interest = balance * monthlyRate * months;
        return interest;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalculator className="text-indigo-600" />
                Calculadora de Interés
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de meses
                    </label>
                    <input
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
                        className="block w-full px-3 py-2 rounded-lg border border-gray-300 
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                 transition-all duration-200"
                        min="1"
                    />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaPercentage className="text-indigo-500" />
                        <span>Tasa Anual: 12%</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMoneyBillWave className="text-green-500" />
                        <span>Balance Actual: ${balance.toLocaleString('es-ES')}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                        <div className="text-lg font-semibold text-indigo-600">
                            Interés Calculado: ${calculateInterest().toLocaleString('es-ES')}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Total con intereses: ${(balance + calculateInterest()).toLocaleString('es-ES')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestCalculator; 