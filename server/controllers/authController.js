import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

export const register = async (req, res) => {
    try {
        const { phone, password, storeNumber, deviceId } = req.body;
        if (!phone || !password || !storeNumber) {
            return res.status(400).send({ message: 'Phone, Password, and Store Number are required' });
        }

        // Check if phone or storeNumber already exists
        const existingByPhone = await User.findOne({ phone });
        if (existingByPhone) {
            return res.status(400).send({ message: 'Phone number already registered' });
        }

        const existingByStore = await User.findOne({ storeNumber });
        if (existingByStore) {
            return res.status(400).send({ message: 'PLEASE CREATE YOUR OWN ACOUNT. Store already taken.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            phone,
            password: hashedPassword,
            storeNumber,
            deviceId: deviceId?.trim()
        });
        await user.save();

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

        res.send({
            message: 'Login successful',
            storeNumber: user.storeNumber
        });
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
