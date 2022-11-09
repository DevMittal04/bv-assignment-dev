const mongoose = require('mongoose')

const feedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content_url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Feed', feedSchema)