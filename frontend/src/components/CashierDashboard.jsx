import Deposit from './Deposit';
import Loan from './Loan';
import bank from '../assets/bank.jpg';
import ClientBalances from './ClientBalances';
import { IoIosLogOut } from 'react-icons/io';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Interest from './Interest';

const CashierDashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-40 my-4">
                <img className="mx-auto h-25 w-auto" src={bank} alt="Your Company" />
                <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 uppercase">
                    Dashboard Del Cajero
                </h1>

                <p className="mt-4 text-center leading-9 tracking-tight text-gray-900 md:text-1xl dark:text-black uppercase">
                    Hola <span className='font-bold'>{user.name}</span> 
                </p>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-6xl px-4">
                <Deposit />
                <Interest/>
                <Loan />
            </div>

            <div className="flex-grow w-full max-w-7xl mt-4 h-96 rounded-lg shadow-md">
                <ClientBalances />
            </div>

            <div className='mt-4 mb-4'>
                <button
                    onClick={logout}
                    className="py-2 px-6 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-2"
                >
                    <IoIosLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default CashierDashboard;
