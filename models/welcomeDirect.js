const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    embed: Boolean,
    message: String
})

module.exports = mongoose.model("welcomeDirect", xpSchema)