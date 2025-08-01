import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    // ✅ Connect to bookify database
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    await mongoose.connect(`${mongoUrl}/bookify`);
};

export default connectDB;
