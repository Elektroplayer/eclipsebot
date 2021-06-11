const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    guildID: String,
    memberRoles: [String],
    botRoles: [String]
})

module.exports = mongoose.model("defaultRole", xpSchema)