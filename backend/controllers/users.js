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
            res.json({
                token,
                user: {
                    _id: user._id,
                    role: user.role,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
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

// Delete user (Cashier)
exports.deleteUser = async (req, res) => {
    try {
        // Verificar si el usuario que hace la petición es un cajero
        if (req.user.role !== 'cashier') {
            return res.status(403).json({ msg: 'Access denied. Only cashiers can delete users.' });
        }

        const userId = req.params.id;
        const user = await User.findById(userId);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verificar que no se intente eliminar a otro cajero
        if (user.role === 'cashier') {
            return res.status(403).json({ msg: 'Cannot delete other cashiers' });
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(userId);
        
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
