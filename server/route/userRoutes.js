const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users (for project assignment)
router.get('/', protect, async (req, res) => {
    try {
        // For admin, return all users in their company
        // For employee, return users from their department or company
        const query = req.user.role === 'admin'
            ? { _id: { $ne: req.user._id } } // Not include the current user
            : { _id: { $ne: req.user._id } }; // This can be refined based on company/department logic
            
        const users = await User.find(query).select('_id firstName lastName email role');
        
        // Format user data for frontend
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
        }));
        
        res.json({
            success: true,
            users: formattedUsers
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Get user by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { firstName, lastName, email, department } = req.body;
        
        // Find user
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (department && user.role === 'employee') user.department = department;
        
        await user.save();
        
        // Return updated user (excluding password)
        const updatedUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            ...(user.role === 'admin' ? { companyName: user.companyName } : { department: user.department })
        };
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 