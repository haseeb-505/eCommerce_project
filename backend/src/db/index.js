import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const dbConnectionInstance = await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected!!! \n DB_HOST/ ${DB_NAME}: ${dbConnectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MongoDB connection error: ${error || error.message}`);
        // exit the process with failure
        process.exit(1); 
    }
}

export default connectDB;