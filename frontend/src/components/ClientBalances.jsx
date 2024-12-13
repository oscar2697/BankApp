import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaMoneyBillWave, FaChevronLeft, FaChevronRight, FaSearch, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import WithdrawalForm from './WithdrawalForm';
import AccountMovements from './AccountMovements';
import InterestCalculator from './InterestCalculator';

const ClientBalances = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(6); // Número de clientes por página
    const [searchTerm, setSearchTerm] = useState('');
    const movementRefs = useRef({});

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('https://bankapp-f4r4.onrender.com/api/users/clients', {
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

    const handleDeleteClient = async (clientId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            const token = localStorage.getItem('token');
            console.log('Intentando eliminar cliente:', clientId);
            
            try {
                const response = await axios.delete(
                    `https://bankapp-f4r4.onrender.com/api/users/${clientId}`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Respuesta del servidor:', response);

                if (response.status === 200) {
                    setClients(prevClients => prevClients.filter(client => client._id !== clientId));
                    toast.success('Cliente eliminado exitosamente');
                }
            } catch (err) {
                console.error('Error completo:', err);
                toast.error(err.response?.data?.message || 'Error al eliminar el cliente');
            }
        }
    };

    // Función para actualizar el balance de un cliente específico
    const updateClientBalance = (clientId, newBalance) => {
        setClients(prevClients => 
            prevClients.map(client => 
                client._id === clientId 
                    ? { ...client, balance: newBalance }
                    : client
            )
        );
    };

    // Función para agregar un nuevo movimiento a un cliente específico
    const addClientMovement = (clientId, movement) => {
        // Esta función será pasada al componente AccountMovements
        // para actualizar los movimientos en tiempo real
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
            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                                 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {currentClients.map(client => (
                    <div key={client._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        {/* Información del cliente */}
                        <div className="flex flex-col md:flex-row justify-between mb-6">
                            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <FaUser className="text-xl text-indigo-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {client.name}
                                </h2>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
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
                            </div>

                            <button
                                onClick={() => handleDeleteClient(client._id)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                title="Eliminar cliente"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* ID del cliente */}
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <p className="text-sm text-gray-500">
                                ID: <span className="font-mono text-gray-600">{client._id}</span>
                            </p>
                        </div>

                        {/* Componentes de operaciones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Retiro */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Realizar Retiro
                                </h3>
                                <WithdrawalForm 
                                    clientId={client._id}
                                    currentBalance={client.balance}
                                    onWithdrawal={(transaction) => addClientMovement(client._id, transaction)}
                                    onBalanceUpdate={(newBalance) => updateClientBalance(client._id, newBalance)}
                                />
                            </div>

                            {/* Calculadora de Interés */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Calcular Interés
                                </h3>
                                <InterestCalculator balance={client.balance} />
                            </div>

                            {/* Movimientos */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                                    Movimientos
                                </h3>
                                <AccountMovements 
                                    clientId={client._id} 
                                    isAdmin={false} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensaje cuando no hay clientes */}
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
