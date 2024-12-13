const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    clientName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);