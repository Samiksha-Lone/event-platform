const User = require('../models/user.model');
const UserPreferences = require('../models/userPreferences.model');
const Event = require('../models/event.model');
const { logError } = require('../middlewares/logger.middleware');

async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -twoFactorSecret -loginAttempts -lockUntil')
      .populate('favoriteEvents', 'title date location category image');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User profile fetched successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        interests: user.interests,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        favoriteEvents: user.favoriteEvents,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.user._id;
    const { name, bio, profilePicture, interests } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (interests) user.interests = interests;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        interests: user.interests
      }
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getUserPreferences(req, res) {
  try {
    const userId = req.user._id;

    let preferences = await UserPreferences.findOne({ user: userId });
 
    if (!preferences) {
      preferences = await UserPreferences.create({ user: userId });
    }

    res.json({
      message: 'Preferences fetched successfully',
      preferences
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateUserPreferences(req, res) {
  try {
    const userId = req.user._id;
    const updates = req.body;

    let preferences = await UserPreferences.findOne({ user: userId });
    
    if (!preferences) {
      preferences = await UserPreferences.create({ user: userId, ...updates });
    } else {
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          preferences[key] = updates[key];
        }
      });
      await preferences.save();
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function followUser(req, res) {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyFollowing = user.following.some(id => id.toString() === targetUserId);
    
    if (alreadyFollowing) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function unfollowUser(req, res) {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId.toString());

    await user.save();
    await targetUser.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function addFavoriteEvent(req, res) {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isDeleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findById(userId);

    const alreadyFavorite = user.favoriteEvents.some(id => id.toString() === eventId);
    
    if (alreadyFavorite) {
      return res.status(400).json({ message: 'Event already in favorites' });
    }

    user.favoriteEvents.push(eventId);
    await user.save();

    res.json({ message: 'Event added to favorites' });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function removeFavoriteEvent(req, res) {
  try {
    const userId = req.user._id;
    const { eventId } = req.params;

    const user = await User.findById(userId);
    user.favoriteEvents = user.favoriteEvents.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ message: 'Event removed from favorites' });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getFavoriteEvents(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: 'favoriteEvents',
        match: { isDeleted: false },
        populate: { path: 'owner', select: 'name email' }
      });

    res.json({
      message: 'Favorite events fetched successfully',
      events: user.favoriteEvents
    });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPreferences,
  updateUserPreferences,
  followUser,
  unfollowUser,
  addFavoriteEvent,
  removeFavoriteEvent,
  getFavoriteEvents
};
