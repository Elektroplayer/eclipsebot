import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    guildID: String,
    memberID: String,
    xp: {
        type: Number,
        default: 0
    }
}, { collection: 'levelsM' })

export default mongoose.model('levelsM', schema)
