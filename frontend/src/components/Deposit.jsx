import { useState } from 'react';
import axios from 'axios';

const Deposit = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');

    const handleDeposit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://bankapp-1-byfe.onrender.com/api/transactions/deposit', { to, amount }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Deposit successful');
        } catch (err) {
            console.error(err);
        }

        //Reiniciar formulario
        setTo('');
        setAmount('')
    };

    return (
        <section className='flex-grow bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md'>
            <h2 className="text-xl font-bold text-center mb-4 dark:text-white">Depósito</h2>

            <form  className='space-y-4' onSubmit={handleDeposit}>
                <label className='block text-sm font-medium leading-6 text-gray-500'>
                    Beneficiario
                </label>
                <input 
                    type="text" 
                    value={to} onChange={(e) => setTo(e.target.value)} 
                    placeholder="ID del Beneficiario" 
                    required 
                    className='w-full border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl' 
                />

                <label className='block text-sm font-medium leading-6 text-gray-500'>
                    Monto
                </label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Monto" 
                    required 
                    className='w-full border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-100/5 outline-none rounded-xl' 
                    />

                <button 
                    className='flex w-full justify-center rounded-md 
                        bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600'
                    type="submit"
                >
                        Depósito
                </button>
            </form>
        </section>
    );
};

export default Deposit;
