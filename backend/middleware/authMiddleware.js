const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify access token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Optional: Check if user is owner of resource
exports.owner = (Model) => {
  return async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      if (item.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to access this resource' 
        });
      }

      req.item = item;
      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  };
};