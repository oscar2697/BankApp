const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, password, role });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { userId: user.id, role: user.role };
        jwt.sign(payload, 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            console.log('Login successful, token: ', token)
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get balance (Client)
exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ balance: user.balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all client balances (Cashier)
exports.getAllBalances = async (req, res) => {
    try {
        console.log('Role: ', req.user.role)

        if (req.user.role !== 'cashier') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const clients = await User.find({role: 'client'});
        console.log('Clients: ', clients)
        const balances = clients.map(client => ({ username: client.username, balance: client.balance }));
        res.json(balances);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
