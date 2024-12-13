const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/users');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('Request body:', req.body);
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'PPor favor llena todos los espacios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(400).json({ message: 'Error al crear usuario', error: err.message });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
    res.json({ token, user });
});

// Middleware de autenticación
router.use(authMiddleware);

// Obtener datos del usuario
router.get('/me', async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
});

// Obtener todos los clientes con información completa
router.get('/clients', async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Error al recuparar los clientes', error: err.message });
    }
});

// Agregar la ruta para eliminar usuarios
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;