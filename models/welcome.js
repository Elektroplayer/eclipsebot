const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    channelID: String,
    embed: Boolean,
    message: String
})

module.exports = mongoose.model("welcome", xpSchema)