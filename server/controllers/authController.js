import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

export const register = async (req, res) => {
    try {
        const { phone, password, deviceId } = req.body;
        if (!phone || !password) return res.status(400).send({ message: 'Phone and Password are required' });

        // Improve duplicate check logic: Only check deviceId if it's actually provided
        const query = { $or: [{ phone }] };
        if (deviceId && deviceId.trim() !== "") {
            query.$or.push({ deviceId: deviceId.trim() });
        }

        let existingUser = await User.findOne(query);

        if (existingUser) {
            return res.status(400).send({ message: 'Account or device already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ phone, password: hashedPassword, deviceId: deviceId?.trim() });
        await user.save();

        // Server-side control: Grant 30 days trial automatically on first registration
        const payment = new Payment({
            phone,
            isPaid: true,
            expiryDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
        });
        await payment.save();

        res.status(201).send({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).send({ message: 'Server error', error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) return res.status(401).send({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send({ message: 'Invalid credentials' });

        res.send({ message: 'Login successful' });
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { phone } = req.params;
        await User.findOneAndDelete({ phone });
        await Payment.findOneAndDelete({ phone });
        res.send({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting user' });
    }
};
