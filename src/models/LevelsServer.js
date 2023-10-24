import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    guildID: String,
    enabled: {
        type: Boolean,
        default: true
    },
    onNewLevel: {
        mode: {
            type: [String], 
            default: ['msg'] // msg, react
        },
        message: {
            content: {
                type: String,
                default: '**{{MENTION}}**, поздравляю с повышением до **{{LEVEL}}** уровня!'
            },
            embeds: {
                type: [Object],
                default: []
            }
        },
        deleteTimeout: {
            type: Number,
            default: 5
        },
        reaction: {
            type: String,
            default: null
        }
    },
    exceptions: {
        roles: {
            type: [String],
            default: []
        },
        channels: {
            type: [String],
            default: []
        }
    },
    transfer: {
        type: Boolean,
        default: true
    },
}, { collection: 'levelsS' })

export default mongoose.model('levelsS', schema)

