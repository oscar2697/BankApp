import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import bank  from '../assets/bank.png'
import { FaHome } from "react-icons/fa";

const Transfer = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);

    const handleTransfer = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://bankapp-b5kg.onrender.com/api/transactions/transfer', { from: user._id, to, amount }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Transfer successful');
        } catch (err) {
            setError(err.response.data.message || 'Transfer failed');
        }

        //Reinicio del formulario
        setTo('')
        setAmount('')
    };

    if (!user) return <div>Loading...</div>;

    return (
        <section className='flex min-h-full flex-col justify-center px-11 py-10'>
            <div className="sm:mx-auto sm:w-full sm:max-w-40 ">
                <img className="mx-auto h-4.5 w-auto" src={bank} alt="Your Company"/>
                <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-2xl dark:text-black uppercase">
                    Transferencias
                </h2>
            </div>

            <form className='space-y-6 md:space-y-6 max-w-sm mx-auto w-full' onSubmit={handleTransfer}>
                {error && <p>{error}</p>}

                <label className='block text-sm font-medium leading-6 text-gray-500'>
                    Desde: 
                </label>
                
                <input 
                    type="text" 
                    value={user._id} 
                    readOnly 
                    placeholder="Desde: " 
                    className="mb-4 w-full border-0 py-1.5 text-gray-900 shadow-sm  
                            sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl" 
                />

                <label className='block text-sm font-medium leading-6 text-gray-500'>
                    Benficiario:
                </label>

                <input 
                    type="text" 
                    value={to} 
                    onChange={(e) => setTo(e.target.value)} 
                    placeholder="ID del Beneficiario" 
                    required 
                    className="mb-4 w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl" 
                />

                <label className='block text-sm font-medium leading-6 text-gray-500'>
                    Monto: 
                </label>

                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Monto" 
                    required 
                    className="mb-4 w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl" 
                />

                <button 
                    className='flex w-full justify-center rounded-md 
                        bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600' 
                        type="submit"
                    >
                        Transferencia
                </button>

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
            </form>

        </section>
        
    );
};

export default Transfer;
