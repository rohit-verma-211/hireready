import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Type is required"]
    }
}, {
    timestamps: true
});

const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

export default blacklistModel;