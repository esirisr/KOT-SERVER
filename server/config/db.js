import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://esirsir123_db_user:Abc12355@cluster0.viqfgnh.mongodb.net/autoSender');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Database Error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
