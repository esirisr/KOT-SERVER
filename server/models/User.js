import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deviceId: { type: String }, // To track unique hardware
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
