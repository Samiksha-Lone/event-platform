const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    twoFactorSecret: {
        type: String,
        default: undefined
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    bio: {
        type: String,
        maxlength: 500
    },
    profilePicture: {
        type: String
    },
    interests: [{
        type: String,
        enum: ['tech', 'music', 'sports', 'food', 'health', 'education', 'workshop', 'social', 'other']
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    favoriteEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
},
{ timestamps: true });

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual('followerCount').get(function() {
    return this.followers ? this.followers.length : 0;
});

userSchema.virtual('followingCount').get(function() {
    return this.following ? this.following.length : 0;
});

userSchema.methods.incLoginAttempts = function() {
    
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; 
    
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }
    return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

module.exports = mongoose.model('User', userSchema);