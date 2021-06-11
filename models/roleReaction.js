const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
    messageID: String,
    entry: [Object]
})

module.exports = mongoose.model("roleReaction", xpSchema)