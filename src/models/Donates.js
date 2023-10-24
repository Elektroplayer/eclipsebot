import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: String,
    total: Number
}, { collection: 'donates' })

export default mongoose.model('donates', schema)
