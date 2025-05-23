import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ApiError} from '../utils/ApiError.js';

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
    refreshToken: {
        type: String,
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
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isLoggedIn: { type: Boolean, default: false },
}, {timestamps: true});

// indexing
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

// password encryption on every instance of a change in user credentials
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// is passwrod same method
userSchema.methods.isPasswordSame = async function(bodyPassword){
    if(!bodyPassword){
        throw new ApiError("req body password is missing", 400);
    }

    if(!this.password){
        throw new ApiError("db password is missing", 400);
    }

    // password comparison,
    return await bcrypt.compare(bodyPassword, this.password);
};

// generate accessToken method
userSchema.methods.generateAccessToken = function(){
    const payload ={
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        role: this.role,
        avatar: this.avatar,
        coverPhoto: this.coverPhoto,
        phone: this.phone,
        address: this.address
    }

    return jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

// generate refreshToken method
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    );
}


export const User = mongoose.model('User', userSchema);