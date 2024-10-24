const express = require('express');
const fileUpload = require('express-fileupload');
const vision = require('@google-cloud/vision');
const path = require('path');
const app = express();
const port = 3000;

// Middleware for file upload
app.use(fileUpload());

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Google Cloud Vision client
const client = new vision.ImageAnnotatorClient();

app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // Get the uploaded file
        const imageFile = req.files.image;

        // Perform label detection
        const [result] = await client.labelDetection(imageFile.data);
        const labels = result.labelAnnotations.map(label => label.description);

        // Send labels as response
        res.json({ labels });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the image.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

