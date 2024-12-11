import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaMoneyBillWave, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ClientBalances = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(6); // Número de clientes por página

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://bankapp-b5kg.onrender.com/api/users/clients', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClients(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error('Error al cargar los clientes');
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    // Obtener clientes actuales
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(clients.length / clientsPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Balance de Clientes</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentClients.map(client => (
                    <div 
                        key={client._id} 
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg 
                        transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-indigo-100 rounded-full">
                                <FaUser className="text-xl text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {client.name}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <FaEnvelope className="text-indigo-500" />
                                <span>{client.email}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <FaMoneyBillWave className="text-green-500" />
                                <span className="text-lg font-medium text-gray-800">
                                    ${client.balance.toLocaleString('es-ES')}
                                </span>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    ID: <span className="font-mono text-gray-600">{client._id}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {clients.length > 0 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full ${
                            currentPage === 1 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                    >
                        <FaChevronLeft />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => paginate(idx + 1)}
                                className={`w-8 h-8 rounded-full ${
                                    currentPage === idx + 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full ${
                            currentPage === totalPages 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}

            {clients.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No hay clientes registrados</p>
                </div>
            )}
        </div>
    );
};

export default ClientBalances;
