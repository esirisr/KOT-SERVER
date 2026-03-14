import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const getStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ phone: req.params.phone });
        if (!payment) return res.status(404).send({ message: 'User not found' });

        const now = new Date();
        const isActive = payment.isPaid && !payment.isSuspended && payment.expiryDate > now;

        res.send({
            phone: payment.phone,
            isPaid: payment.isPaid,
            isSuspended: payment.isSuspended,
            expiryDate: payment.expiryDate,
            isActive: isActive,
            daysRemaining: Math.ceil((payment.expiryDate - now) / (1000 * 60 * 60 * 24)),
            message: payment.isSuspended ? "Your account has been suspended" : null
        });
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { phone } = req.params;
        const { isPaid, isSuspended, daysToAdd } = req.body;

        let payment = await Payment.findOne({ phone });
        if (!payment) return res.status(404).send({ message: 'Payment record not found' });

        if (isPaid !== undefined) payment.isPaid = isPaid;
        if (isSuspended !== undefined) payment.isSuspended = isSuspended;

        if (daysToAdd) {
            payment.expiryDate = new Date(Date.now() + (daysToAdd * 24 * 60 * 60 * 1000));
        }

        payment.lastUpdated = Date.now();
        await payment.save();

        res.send({ message: 'Status updated', payment });
    } catch (err) {
        res.status(500).send({ message: 'Error updating status' });
    }
};

/**
 * NEW: Checks if a store number is unique or already bound to the requesting phone.
 */
export const checkStoreUnique = async (req, res) => {
    try {
        const { phone, store } = req.query;
        if (!phone || !store) return res.status(400).send({ message: 'Missing parameters' });

        // Find if ANY user has this store number
        const existingOwner = await User.findOne({ storeNumber: store });

        if (!existingOwner) {
            // Store is brand new, let them have it (Update DB)
            await User.findOneAndUpdate({ phone }, { storeNumber: store });
            return res.send({ isActive: true, message: "Store assigned" });
        }

        if (existingOwner.phone === phone) {
            // User already owns this store, it's fine
            return res.send({ isActive: true, message: "Owner verified" });
        }

        // Someone else owns this store number
        res.status(403).send({ isActive: false, message: "PLEASE CREATE YOUR OWN ACOUNT" });
    } catch (err) {
        res.status(500).send({ message: 'Server error' });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await Payment.countDocuments({
            isPaid: true,
            isSuspended: false,
            expiryDate: { $gt: new Date() }
        });
        const suspendedUsers = await Payment.countDocuments({ isSuspended: true });

        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.send({
            totalUsers,
            activeUsers,
            suspendedUsers,
            inactiveUsers: totalUsers - activeUsers - suspendedUsers,
            latestUsers
        });
    } catch (err) {
        res.status(500).send({ message: 'Error' });
    }
};
