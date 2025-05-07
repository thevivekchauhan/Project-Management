const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RecentTask = require('../models/recentTaskModel');

dotenv.config();

const sampleTasks = [
  {
    title: 'Update Dashboard UI',
    description: 'Implement new dashboard design with material UI components',
    status: 'In Progress',
    priority: 'High',
    project: 'Website Redesign',
    assignedTo: 'Gaurav',
    dueDate: new Date('2025-05-20'),
    progress: 60
  },
  {
    title: 'API Integration',
    description: 'Connect frontend components with backend APIs',
    status: 'To Do',
    priority: 'High',
    project: 'Website Redesign',
    assignedTo: 'Prabhat',
    dueDate: new Date('2025-05-25'),
    progress: 0
  },
  {
    title: 'Database Optimization',
    description: 'Optimize database queries and indexes',
    status: 'Done',
    priority: 'Medium',
    project: 'Performance Improvement',
    assignedTo: 'pruthvi',
    dueDate: new Date('2025-05-15'),
    progress: 100
  },
  {
    title: 'User Authentication',
    description: 'Implement JWT based authentication',
    status: 'Done',
    priority: 'High',
    project: 'Security Update',
    assignedTo: 'Ishan',
    dueDate: new Date('2025-05-10'),
    progress: 100
  },
  {
    title: 'Mobile Responsiveness',
    description: 'Make all components mobile-friendly',
    status: 'In Progress',
    priority: 'Medium',
    project: 'Website Redesign',
    assignedTo: 'Krishi',
    dueDate: new Date('2025-05-30'),
    progress: 45
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await RecentTask.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert new tasks
    const result = await RecentTask.insertMany(sampleTasks);
    console.log(`Inserted ${result.length} tasks`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();