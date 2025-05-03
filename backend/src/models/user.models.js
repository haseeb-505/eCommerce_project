import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
        trim: true,
    },
    coverPhoto: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    role: {
        type: String,
        ennum: ['user', 'admin'],
        default: 'user',
    }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema);