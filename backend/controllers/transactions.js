const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Transfer money (Admin only)
exports.transferMoney = async (req, res) => {
    const { fromUsername, toUsername, amount } = req.body;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso Denegado' });
        }

        const fromUser = await User.findOne({ username: fromUsername });
        const toUser = await User.findOne({ username: toUsername });

        if (!fromUser || !toUser) {
            return res.status(400).json({ msg: 'Usuario Incorrecto' });
        }

        if (fromUser.balance < amount) {
            return res.status(400).json({ msg: 'Fondos Insuficientes' });
        }

        fromUser.balance -= amount;
        toUser.balance += amount;

        await fromUser.save();
        await toUser.save();

        const transaction = new Transaction({
            from: fromUser._id,
            to: toUser._id,
            amount
        });

        await transaction.save();
        res.json({ msg: 'Transferencia Hecho!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get transaction history (Admin only)
exports.getTransactionHistory = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso Denegado' });
        }

        const transactions = await Transaction.find().populate('from to', 'username');
        res.json(transactions);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
