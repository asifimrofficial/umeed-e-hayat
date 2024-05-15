/*write a mongoose schema for the Request which includes
bloodgroup, location, contact, isactive, isfulfilled,hb, user,note, date, time
*/
const { boolean } = require('joi');
const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    bloodgroup: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    hospital: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    isactive: {
        type: Boolean,
        default: true,
        required: true,
    },
    isfulfilled: {
        type: Boolean,
        default: false,
        required: true,
    },
    hb: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    note: {
        type: String,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);