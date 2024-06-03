import { useState, useEffect } from 'react';
import axios from 'axios';

const ClientBalances = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:5000/api/users/clients', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClients(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClients();
    }, []);

    return (
        <div className='flex-1 p-4 h-full'>
            <div className='w-full h-full p-8 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800 text-gray-200 overflow-y-auto'>
                <h1 className='text-3xl font-bold mb-6 text-center uppercase'>Balance de Clientes</h1>
                <ul className='space-y-6'>
                    {clients.map(client => (
                        <li key={client._id} className="p-8 bg-gray-100 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <p className='text-xl'>
                                <strong className='text-gray-400'>ID: </strong>
                                {client._id}
                            </p>

                            <p>
                                <strong className='text-gray-500'>Nombre: </strong>
                                {client.name}
                            </p>

                            <p>
                                <strong className='text-gray-500'>Correo: </strong>
                                {client.email}
                            </p>
                            
                            <p>
                                <strong className='text-gray-500'>Balance: </strong>
                                ${client.balance}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClientBalances;
