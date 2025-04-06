const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to JSON storage file
const submissionsFile = path.join(__dirname, 'submissions.json');

// Initialize JSON file if it doesn't exist
if (!fs.existsSync(submissionsFile)) {
    fs.writeFileSync(submissionsFile, '[]', 'utf8');
    console.log('Created submissions.json storage file');
}

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-form', (req, res) => {
    const formData = {
        ...req.body,
        timestamp: new Date().toISOString()
    };

    // Input validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.service) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    fs.readFile(submissionsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ success: false });
        }

        try {
            const submissions = JSON.parse(data);
            submissions.push(formData);

            fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ success: false });
                }
                res.json({ success: true });
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ success: false });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Storing submissions in: ${submissionsFile}`);
});