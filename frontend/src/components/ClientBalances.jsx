import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaMoneyBillWave, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ClientBalances = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(6); // Número de clientes por página
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filtrar clientes basado en la búsqueda
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Obtener clientes actuales
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Reset página cuando se busca
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                    Balance de Clientes
                </h1>
                
                {/* Barra de búsqueda */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                        w-full md:w-64 transition-all duration-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

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

            {filteredClients.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron clientes</p>
                </div>
            )}

            {/* Paginación */}
            {filteredClients.length > 0 && (
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
        </div>
    );
};

export default ClientBalances;
