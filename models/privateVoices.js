const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    channelID: String,
    template: String
})

module.exports = mongoose.model("privateVoice", xpSchema)