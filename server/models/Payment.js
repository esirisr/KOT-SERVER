import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    isPaid: { type: Boolean, default: false },
    expiryDate: { type: Date },
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
