const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Remote', 'Full-Time', 'Part-Time', 'Contract', 'Internship'],
        required: true
    },
    remote: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    info: {
        type: String,
        required: true
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model('JobSchema', jobSchema)