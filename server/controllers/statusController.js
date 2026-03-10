import Payment from '../models/Payment.js';

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
