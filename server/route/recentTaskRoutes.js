const express = require('express');
const router = express.Router();
const { 
    getAllRecentTasks, 
    createRecentTask, 
    updateRecentTask, 
    deleteRecentTask 
} = require('../controllers/recentTaskController');

router.get('/', getAllRecentTasks);
router.post('/', createRecentTask);
router.put('/:id', updateRecentTask);
router.delete('/:id', deleteRecentTask);

module.exports = router;