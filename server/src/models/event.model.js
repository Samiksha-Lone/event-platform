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
    location: {
        type: String,
        required: function() {
            return this.eventType === 'offline';
        }
    },
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
    }],
    attendees: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'attended'],
            default: 'pending'
        },
        rsvpDate: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    auditLog: [{
        action: {
            type: String,
            enum: ['created', 'updated', 'deleted', 'restored']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        changes: mongoose.Schema.Types.Mixed
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

eventSchema.index({ date: 1 }); 
eventSchema.index({ category: 1 }); 
eventSchema.index({ owner: 1 }); 
eventSchema.index({ createdAt: -1 }); 
eventSchema.index({ date: 1, category: 1 }); 
eventSchema.index({ owner: 1, createdAt: -1 }); 
eventSchema.index({ tags: 1 }); 
eventSchema.index({ isDeleted: 1 }); 
eventSchema.index({ averageRating: -1 });

eventSchema.methods.addAuditLog = function(action, userId, changes = {}) {
    this.auditLog.push({
        action,
        user: userId,
        timestamp: new Date(),
        changes
    });
};

eventSchema.methods.softDelete = function(userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    this.addAuditLog('deleted', userId);
};

eventSchema.methods.restore = function(userId) {
    this.isDeleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    this.addAuditLog('restored', userId);
};

module.exports = mongoose.model('Event', eventSchema);


