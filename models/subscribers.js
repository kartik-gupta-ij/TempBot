const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var subscriberSchema = new Schema({
    chatId:  {
        type: Number,
        required: true
    },
    firstName:  {
        type: String,

    },
    lastName: {
        type: String,

    },
    username: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
        default: "Delhi"
    }
}, {
    timestamps: true
});

var Subscribers = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscribers;