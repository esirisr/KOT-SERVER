import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deviceId: { type: String },
    storeNumber: { type: String, sparse: true }, // Store number linked to this account
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
