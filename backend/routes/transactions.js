const express = require('express');
const Transaction = require('../models/Transaction');
const BigNumber = require('bignumber.js');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Transferir dinero
router.post('/transfer', async (req, res) => {
    const { from, to, amount } = req.body;

    try {
        const sender = await User.findById(from);
        const receiver = await User.findById(to);
        
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asegúrate de que amount es un número válido
        const numericAmount = new BigNumber(amount);
        if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });
        
        // Asegúrate de que los balances sean numéricos y no undefined o null
        const senderBalance = new BigNumber(sender.balance || 0); 
        const receiverBalance = new BigNumber(receiver.balance || 0);

        // Verifica que el remitente tenga suficientes fondos
        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Fondos insuficientes' });
        }

        // Actualiza los balances
        sender.balance = senderBalance.minus(numericAmount).toFixed(2);
        receiver.balance = receiverBalance.plus(numericAmount).toFixed(2);

        // Guarda la transacción
        const transaction = new Transaction({ from, to, amount: numericAmount.toFixed(2) });
        await transaction.save();
        
        await sender.save();
        await receiver.save();

        res.status(201).json({ message: 'Transferencia realizada' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Realizar depósito
router.post('/deposit', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });

    const receiverBalance = new BigNumber(receiver.balance);
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Actualiza el balance con BigNumber
    
    // Guardar transacción en la base de datos
    const transaction = new Transaction({
        from: null, // Si es un depósito del cajero, no hay un 'from' explícito
        to: receiver._id,
        amount: numericAmount
    });

    await receiver.save();
    await transaction.save(); // Guardar la transacción
    
    res.status(201).json({ message: 'Depósito hecho!' });
});

// Interes
router.post('/interest', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });

    const receiverBalance = new BigNumber(receiver.balance);
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Actualiza el balance con BigNumber
    
    // Guardar transacción en la base de datos
    const transaction = new Transaction({
        from: null, // Si es una agregación de interés del cajero, no hay un 'from' explícito
        to: receiver._id,
        amount: numericAmount
    });

    await receiver.save();
    await transaction.save(); // Guardar la transacción
    
    res.status(201).json({ message: 'Interés agregado!' });
});

// Realizar préstamo
router.post('/loan', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });

    const receiverBalance = new BigNumber(receiver.balance);
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Actualiza el balance con BigNumber
    
    // Guardar transacción en la base de datos
    const transaction = new Transaction({
        from: null, // Si es un préstamo del cajero, no hay un 'from' explícito
        to: receiver._id,
        amount: numericAmount
    });

    await receiver.save();
    await transaction.save(); // Guardar la transacción
    
    res.status(201).json({ message: 'Préstamo hecho!' });
});

//Historial
router.get('/history', async (req, res) => {
    try {
        // Verificar si el usuario que solicita es un cliente
        if (req.user.role === 'client') {
            // Obtener las transacciones donde el 'to' es el usuario actual
            const transactions = await Transaction.find({ to: req.user.id })
                .populate('from', 'username') // Para obtener el nombre del banquero
                .populate('to', 'username'); // Para obtener el nombre del cliente

            res.json(transactions);
        } else if (req.user.role === 'cashier') {
            // Si es un banquero, obtener todas las transacciones que ha realizado
            const transactions = await Transaction.find({ from: req.user.id })
                .populate('from', 'username') // Para obtener el nombre del banquero
                .populate('to', 'username'); // Para obtener el nombre del cliente

            res.json(transactions);
        } else {
            return res.status(403).json({ msg: 'Acceso Denegado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al recuperar el historial de transacciones', error: err.message });
    }
});

// Ruta para realizar retiros
router.post('/withdraw', authMiddleware, async (req, res) => {
    try {
        const { clientId, amount } = req.body;
        
        // Verificar el cliente y su balance
        const client = await User.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        if (client.balance < amount) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        // Crear la transacción
        const transaction = new Transaction({
            clientId,
            type: 'withdrawal',
            amount,
            date: new Date(),
            clientName: client.name // Guardamos el nombre para referencia
        });

        // Actualizar el balance del cliente
        client.balance -= amount;

        // Guardar ambos cambios
        await Promise.all([
            transaction.save(),
            client.save()
        ]);

        res.json({ 
            message: 'Retiro exitoso',
            newBalance: client.balance,
            transaction
        });
    } catch (error) {
        console.error('Error en retiro:', error);
        res.status(500).json({ message: 'Error al procesar el retiro' });
    }
});

// Obtener movimientos de un cliente específico
router.get('/client/:clientId', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ 
            clientId: req.params.clientId 
        }).sort({ date: -1 });
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los movimientos' });
    }
});

// Obtener todos los movimientos (solo para admin/cajero)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Verificar si es admin/cajero
        if (req.user.role !== 'cashier') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const transactions = await Transaction.find()
            .sort({ date: -1 })
            .limit(100); // Limitamos a los últimos 100 movimientos
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los movimientos' });
    }
});

module.exports = router;