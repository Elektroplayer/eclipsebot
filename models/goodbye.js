const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    channelID: String,
    embed: Boolean,
    message: mongoose.Types.Mixed
})

module.exports = mongoose.model("goodbye", xpSchema)