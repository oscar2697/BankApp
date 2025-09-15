# BankApp

**BankApp** is a modern, secure, and efficient banking application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It provides a seamless banking experience with **role-based access control**, **secure transactions**, and **real-time updates**.

## Key Features

### Secure Authentication System
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
```

### Secure Fund Transfers
```javascript
exports.transferMoney = async (req, res) => {
    const { fromUsername, toUsername, amount } = req.body;

    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access Denied' });

        const fromUser = await User.findOne({ username: fromUsername });
        const toUser = await User.findOne({ username: toUsername });

        if (!fromUser || !toUser) return res.status(400).json({ msg: 'Invalid user' });
        if (fromUser.balance < amount) return res.status(400).json({ msg: 'Insufficient funds' });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            fromUser.balance -= amount;
            toUser.balance += amount;
            await fromUser.save({ session });
            await toUser.save({ session });

            const transaction = new Transaction({ from: fromUser._id, to: toUser._id, amount });
            await transaction.save({ session });
            await session.commitTransaction();
            
            res.json({ msg: 'Transfer successful!' });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
```

## Data Models
### User Model
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['client', 'cashier'] },
    balance: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('User', UserSchema);
    }
};
```

### Transaction Model
```javascript
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
```

## Technical Stack

### Frontend

- React.js with Hooks

- React Router

- Context API

- Axios

- React Hot Toast

- Tailwind CSS

### Backend

- Node.js & Express.js

- MongoDB & Mongoose

- JWT & Bcrypt

- CORS

### Security Features

- JWT-based authentication & role-based access control

- Secure password hashing with bcrypt

- Input validation & session security

- Atomic transactions & balance validation

- Comprehensive error handling

## API Documentation

### Authentication

POST /api/auth/register

POST /api/auth/login

### Transactions

POST /api/transactions/transfer

GET /api/transactions/history

### User Management

GET /api/users/me

GET /api/users/balance

GET /api/users/all (Admin only)

## Project Structure
```javascript
bankapp/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── utils/
        └── App.jsx
```
## Project Status

Currently in production, handling real financial transactions with emphasis on security and reliability.

## License

Proprietary software. All rights reserved.
