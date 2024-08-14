import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        enabled: {
            type: Boolean,
            default: true,
        },
        guildID: {
            type: String,
            required: true,
        },
        channelid: {
            type: String,
            default: '',
        },
        template: {
            type: String,
            default: '[+] {{USERNAME}}',
        },
    },
    { collection: 'privateVoices' },
);

export default mongoose.model('privateVoices', schema);
