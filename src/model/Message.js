const mongoose = require('mongoose');
const db = require("./index");

const messageSchema = new mongoose.Schema({
    userId : String,
    content : String,
    createdAt : Date,
})

const Message = db.model('messages', messageSchema);

Message.createCollection()

module.exports = Message;