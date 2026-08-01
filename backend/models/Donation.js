const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    donationType: {
        type: String,
        default: 'cash'
    },
    amount: {
        type: Number,
        required: function () { return this.donationType === 'cash'; },
        min: 0
    },
    purpose: {
        type: String,
        required: function () { return this.donationType === 'cash'; }
    },
    paymentMethod: {
        type: String,
        required: function () { return this.donationType === 'cash'; }
    },
    itemCategory: { type: String },
    itemName: { type: String },
    itemQuantity: { type: String },
    deliveryMethod: { type: String },
    transactionId: { type: String },
    receiptNumber: { type: String },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

donationSchema.pre('save', function () {
    if (!this.receiptNumber) {
        this.receiptNumber = 'KCT-' + Date.now() + '-' + Math.floor(100000 + Math.random() * 900000);
    }
    if (!this.transactionId && this.donationType === 'cash') {
        this.transactionId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    }
});

module.exports = mongoose.model('Donation', donationSchema);
