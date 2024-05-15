const { required, string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    bloodgroup: {
        type: String,
        required: true,
    },
    loginAttempts: {
        type: Number,
    },
    city: {
        type:String,

        required: true,
    },
    contact: {
        type:String,
        
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    isdonor: {
        type: Boolean,
        required: true,
    },
    noOfDonations:{
        type: Number,
        default: 0
    },
    noOfRequests:{
        type: Number,
        default: 0
    },
    image: 
        {
            type: String,
        },

    deviceToken: {
        type: String,
    },
    
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema);