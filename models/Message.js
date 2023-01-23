// Packages
const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const messageSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});


const Message = mongoose.model('Message', messageSchema);


module.exports = Message;