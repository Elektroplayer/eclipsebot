import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    type: {
        type: String, // Welcome, Goodbye
        required: true
    }, 
    enabled: {
        type: Boolean,
        default: true,
    },
    channelID: {
        type: String,
        default: null
    },
    message: {
        content: {
            type: String,
            default: '**{{USERNAME}}**, добро пожаловать на сервер {{GUILDNAME}}!'
        },
        embeds: {
            type: [Object],
            default: []
        }
    }
}, { collection: 'messages' })

export default mongoose.model('messages', schema)