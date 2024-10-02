const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to serve static files (like your HTML, CSS, JS files)
app.use(express.static(__dirname));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File to store registered users
const DATA_FILE = path.join(__dirname, 'users.json');

// Route to serve the home page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the registration page (regs.html)
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'regs.html'));
});

// Register user route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Load existing users
    let users = [];
    if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE);
        users = JSON.parse(fileData);
    }

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    // Save new user
    users.push({ username, password });
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    res.send({ message: 'Registration successful' });
});

// Login user route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Load existing users
    let users = [];
    if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE);
        users = JSON.parse(fileData);
    }

    // Check if username exists and password matches
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).send({ message: 'Username does not exist' });
    }

    if (user.password !== password) {
        return res.status(400).send({ message: 'Incorrect password' });
    }

    // User is authenticated, redirect to the quiz page
    res.redirect('/quiz');
});

// Route to serve the quiz page (quiz.html)
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

// Route to serve the forgot password page (forgot.html)
app.get('/forgot', (req, res) => {
    res.sendFile(path.join(__dirname, 'forgot.html'));
});

// Reset password route
app.post('/api/reset-password', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Load existing users
    let users = [];
    if (fs.existsSync(DATA_FILE)) {
        const fileData = fs.readFileSync(DATA_FILE);
        users = JSON.parse(fileData);
    }

    // Find user and check if they exist
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(400).send({ message: 'Username does not exist' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    // Update password
    users[userIndex].password = password;
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    res.send({ message: 'Password reset successful' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
