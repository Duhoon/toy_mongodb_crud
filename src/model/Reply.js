const mongoose = require("mongoose");
const db = require("./index.js")

const replySchema = new mongoose.Schema({
    userId : String,
    content : String,
    image : String,
    createdAt : Date,
})

const Reply = db.model("reply", replySchema);

module.exports = Reply;