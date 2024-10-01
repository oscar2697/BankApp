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
    const sender = await User.findById(from);
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber para manejar decimales

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });
    const senderBalance = new BigNumber(sender.balance); // Convierte el balance del remitente a BigNumber
    const receiverBalance = new BigNumber(receiver.balance); // Convierte el balance del receptor a BigNumber
    
    if (senderBalance.isLessThan(numericAmount)) return res.status(400).json({ message: 'Fondos Insuficientes' });

    sender.balance = senderBalance.minus(numericAmount).toFixed(2); // Restar el monto al remitente
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Sumar el monto al receptor

    const transaction = new Transaction({ from, to, amount: numericAmount });
    await transaction.save();
    await sender.save();
    await receiver.save();

    res.status(201).json(transaction);
});

// Realizar depósito
router.post('/deposit', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });

    const receiverBalance = new BigNumber(receiver.balance);
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Actualiza el balance con BigNumber
    await receiver.save();
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
    await receiver.save();
    res.status(201).json({ message: 'Interés hecho!' });
});

// Realizar préstamo
router.post('/loan', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = new BigNumber(amount); // Usa BigNumber

    if (numericAmount.isNaN()) return res.status(400).json({ message: 'Monto no válido' });

    const receiverBalance = new BigNumber(receiver.balance);
    receiver.balance = receiverBalance.plus(numericAmount).toFixed(2); // Actualiza el balance con BigNumber
    await receiver.save();
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

module.exports = router;