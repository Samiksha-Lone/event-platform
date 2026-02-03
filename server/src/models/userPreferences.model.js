const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  interests: [{
    type: String,
    enum: ['tech', 'music', 'sports', 'food', 'health', 'education', 'workshop', 'social', 'other']
  }],
  notifications: {
    email: {
      newEvents: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true },
      rsvpConfirmations: { type: Boolean, default: true },
      eventUpdates: { type: Boolean, default: true }
    },
    push: {
      enabled: { type: Boolean, default: false },
      newEvents: { type: Boolean, default: false },
      eventReminders: { type: Boolean, default: false }
    }
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    showEmail: { type: Boolean, default: false },
    showEventsAttending: { type: Boolean, default: true }
  },
  location: {
    city: String,
    country: String,
    radius: { type: Number, default: 50 } 
  }
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
