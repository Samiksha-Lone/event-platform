const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: { 
        type: String, 
        enum: ['tech', 'music', 'sports', 'food', 'other'], 
        default: 'other' 
    },
    eventType: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: false,
        default: '09:00'
    },
    // Offline event fields
    location: {
        type: String,
        required: function() {
            return this.eventType === 'offline';
        }
    },
    // Online event fields
    meetingPlatform: {
        type: String,
        enum: ['zoom', 'google-meet', 'microsoft-teams', 'webex', 'other'],
        required: function() {
            return this.eventType === 'online';
        }
    },
    meetingLink: {
        type: String,
        required: function() {
            return this.eventType === 'online';
        }
    },
    meetingPassword: {
        type: String,
        required: false
    },
    capacity: {
        type: Number,
        required: true
    },
    image: String,
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    rsvps: [{  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
