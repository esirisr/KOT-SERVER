import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

export const register = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) return res.status(400).send({ message: 'Phone and Password are required' });

        let user = await User.findOne({ phone });
        if (user) return res.status(400).send({ message: 'User already registered' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ phone, password: hashedPassword });
        await user.save();

        const payment = new Payment({
            phone,
            isPaid: true,
            expiryDate: new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))
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
