import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const getStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ phone: req.params.phone });
        if (!payment) return res.status(404).send({ message: 'User not found' });

        const now = new Date();
        const isActive = payment.isPaid && payment.expiryDate > now;

        res.send({
            phone: payment.phone,
            isPaid: payment.isPaid,
            expiryDate: payment.expiryDate,
            isActive: isActive,
            daysRemaining: Math.ceil((payment.expiryDate - now) / (1000 * 60 * 60 * 24))
        });
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};

// --- ADMIN FUNCTIONS ---

// Update Payment Status (e.g., extend subscription)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { phone } = req.params;
        const { isPaid, daysToAdd } = req.body;

        let payment = await Payment.findOne({ phone });
        if (!payment) return res.status(404).send({ message: 'Payment record not found' });

        if (isPaid !== undefined) payment.isPaid = isPaid;

        if (daysToAdd) {
            const currentExpiry = payment.expiryDate > new Date() ? payment.expiryDate : new Date();
            payment.expiryDate = new Date(currentExpiry.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
        }

        payment.lastUpdated = Date.now();
        await payment.save();

        res.send({ message: 'Payment status updated', payment });
    } catch (err) {
        res.status(500).send({ message: 'Error updating status' });
    }
};

// Get Analytics for Dashboard
export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await Payment.countDocuments({
            isPaid: true,
            expiryDate: { $gt: new Date() }
        });

        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.send({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            latestUsers
        });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching analytics' });
    }
};
