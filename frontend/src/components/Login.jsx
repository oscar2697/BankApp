import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import bank  from '../assets/bank.png'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <section className='flex min-h-full flex-col justify-center bg-gray-50 px-11 py-0 lg:px-8'>
            <div className='w-full h-screen xl:p-0 '>
                <div className="sm:mx-auto sm:w-full sm:max-w-40">
                    <img className="mx-auto h-4.5 w-auto" src={bank} alt="Your Company"/>
                    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-2xl dark:text-black">
                        Login
                    </h2>
                </div>

                <form className='space-y-6 md:space-y-6 max-w-sm mx-auto w-full' onSubmit={handleSubmit}>
                    <label className='block text-sm font-medium leading-6 text-gray-500'>
                            Correo
                    </label>

                    <div>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required 
                            className='w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl' 
                        />
                    </div>

                    <label className='block text-sm font-medium leading-6 text-gray-500'>
                            Contraseña
                    </label>

                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" required 
                            className='w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                            focus:ring-indigo-600 sm:text-sm sm:leading-6 h-14 pl-5 bg-slate-900/5 outline-none rounded-xl'
                        />
                    </div>

                    <button 
                        className='flex w-full justify-center rounded-md 
                        bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600'
                        type="submit"
                    >
                        Login
                    </button>

                    <p className="text-black font-bold"> 
                        No tienes una cuenta?
                        <Link 
                            to="/register" 
                            className="text-indigo-700 underline "
                        >
                            Registrate Aquí
                        </Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login;
