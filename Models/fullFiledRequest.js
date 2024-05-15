const mongoose = require('mongoose');
const fullFiledRequestSchema = new mongoose.Schema({
    Request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

module.exports = mongoose.model('FullFiledRequest', fullFiledRequestSchema);