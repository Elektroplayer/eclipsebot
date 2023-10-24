import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    guildID: String,
    messageID: String,
    entry: [{
        emoji: String,
        role: String
    }]
}, { collection: 'roleReaction' })

export default mongoose.model('roleReaction', schema)