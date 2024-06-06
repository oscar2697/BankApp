import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import bank  from '../assets/bank.png'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://bank-app-back.vercel.app/api/users/register', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            login(email, password);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className='flex min-h-full flex-col justify-center bg-gray-50 px-10 py-0 lg:px-8'>
            <div className='w-full h-screen xl:p-0 '>
                <div className="sm:mx-auto sm:w-full sm:max-w-40">
                    <img className="mx-auto h-4.5 w-auto" src={bank} alt="Your Company"/>
                    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-2xl dark:text-black">
                        Sign Up
                    </h2>
                </div>
                
                <form  className='space-y-6 md:space-y-6 max-w-sm mx-auto w-full' onSubmit={handleSubmit}>
                    <label className='block text-sm font-medium leading-5 text-gray-500'>
                            Nombre
                    </label>

                    <div className='mt-1'>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Nombre" 
                            required 
                            className='w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'
                        />
                    </div>

                    <label className='block text-sm font-medium leading-6 text-gray-500'>
                            Correo
                    </label>

                    <div className='mt-2'>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Correo" 
                            required 
                            className='w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'
                        />
                    </div>

                    <label className='block text-sm font-medium leading-6 text-gray-500'>
                            Contraseña
                    </label>

                    <div className='mt-2'>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Contraseña" 
                            required 
                            className='w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'
                        />
                    </div>

                    <label className='block text-sm font-medium leading-6 text-gray-500'>
                            Rol:
                    </label>

                    <div>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            className='w-full flex border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-13 pl-5 bg-slate-900/5 outline-none rounded-xl'
                        >
                            <option value="client">Cliente</option>
                            <option value="cashier">Cajero</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className='flex w-full justify-center rounded-md 
                        bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600'
                    >
                        Register
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Register;
