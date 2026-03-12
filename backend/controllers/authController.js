const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
    return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        const { accessToken, refreshToken } = generateTokens(user._id);
        
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ _id: user._id, name: user.name, email: user.email, accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            user.refreshToken = refreshToken;
            await user.save();
            res.json({ _id: user._id, name: user.name, email: user.email, accessToken, refreshToken });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
    try {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: 'Invalid refresh token' });
        
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
            user.refreshToken = newRefreshToken;
            await user.save();
            res.json({ accessToken, refreshToken: newRefreshToken });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
    // Clear refresh token di database
    const { refreshToken } = req.body;
    if(refreshToken) {
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }
    res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, refresh, logout };