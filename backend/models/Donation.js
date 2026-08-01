const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    donationType: {
        type: String,
        enum: ['cash', 'item'],
        default: 'cash'
    },
    amount: {
        type: Number,
        required: function () { return this.donationType === 'cash'; },
        min: 0
    },
    purpose: {
        type: String,
        required: function () { return this.donationType === 'cash'; },
        enum: ['general', 'education', 'medical', 'food', 'blood_camp', 'other', 'blood']
    },
    paymentMethod: {
        type: String,
        required: function () { return this.donationType === 'cash'; },
        enum: ['upi', 'netbanking', 'debit_card', 'credit_card', 'wallet', 'debit', 'credit']
    },
    itemCategory: { type: String },
    itemName: { type: String },
    itemQuantity: { type: String },
    deliveryMethod: { type: String },
    transactionId: { type: String },
    receiptNumber: { type: String, unique: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
    createdAt: { type: Date, default: Date.now }
});

donationSchema.pre('save', function (next) {
    if (!this.receiptNumber) {
        this.receiptNumber = 'KCT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Donation', donationSchema);
