const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://oscar97:asgeirr@cluster0.m3tfq3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.get('/', (req, res) => {
    res.send('Express App is running')
})

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
    if(!error) {
        console.log('Corriendo en el serividor ' + PORT)
    } else {
        console.log('Error: ' + error)
    }
})
