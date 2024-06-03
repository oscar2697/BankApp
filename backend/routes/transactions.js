const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Transferir dinero
router.post('/transfer', async (req, res) => {
    const { from, to, amount } = req.body;
    const sender = await User.findById(from);
    const receiver = await User.findById(to);
    const numericAmount = parseFloat(amount); 

    if (isNaN(numericAmount)) return res.status(400).json({ message: 'Monto no válido' });
    if (sender.balance < numericAmount) return res.status(400).json({ message: 'Fondos Insuficientes' });

    sender.balance = +sender.balance - numericAmount;
    receiver.balance = +receiver.balance + numericAmount;

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
    const numericAmount = parseFloat(amount); 

    if (isNaN(numericAmount)) return res.status(400).json({ message: 'Monto no válido' });

    receiver.balance = +receiver.balance + numericAmount;
    await receiver.save();
    res.status(201).json({ message: 'Depósito hecho!' });
});

// Realizar préstamo
router.post('/loan', async (req, res) => {
    const { to, amount } = req.body;
    const receiver = await User.findById(to);
    const numericAmount = parseFloat(amount); 

    if (isNaN(numericAmount)) return res.status(400).json({ message: 'Monto no válido' });

    receiver.balance = +receiver.balance + numericAmount;
    await receiver.save();
    res.status(201).json({ message: 'Préstamo hecho!' });
});

//Historial
router.get('/history', async (req, res) => {
    try {
        const transactions = await Transaction.find({ from: req.user.id }).populate('to', 'name email');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error al recuperar el historial de transacciones', error: err.message });
    }
});
module.exports = router;
