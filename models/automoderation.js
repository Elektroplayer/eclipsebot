const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    exceptions: {
        roles: [String],
        members: [String],
        channels: [String]
    },
    logs: {
        enabled: Boolean,
        entry: String
    }
})

module.exports = mongoose.model("autoModeration", xpSchema)