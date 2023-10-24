import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    guildID: String,
    enabled: {
        type: Boolean,
        default: true
    },
    roles: {
        type: [String],
        default: []
    }
}, { collection: 'defaultRoles' })

export default mongoose.model('defaultRoles', schema)