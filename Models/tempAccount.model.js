const { required, string } = require('joi');
const mongoose = require('mongoose');

const tempSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    email: {
        type: String,

        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    bloodgroup: {
        type: String,

    },
    loginAttempts: {
        type: Number,
    },
    city: {
        type:String,


    },
    contact: {
        type:String,
        

    },
    gender: {
        type: String,

    },
    age: {
        type: Number,

    },
    isdonor: {
        type: Boolean,

    },
    otp:{
        type: String,
    },
    image: 
        {
            url: String,
            id: String
        },
    deviceToken:{
        type: String,
     }
}, {timestamps: true});


module.exports = mongoose.model('Temp', tempSchema);