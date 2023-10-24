import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        default: true
    },
    guildID: String,
    channelID: {
        type: String,
        default: ''
    },
    template: {
        type: String,
        default: '[+] {{TAG}}'
    },
}, { collection: 'privateVoices' })

export default mongoose.model('privateVoices', schema)
