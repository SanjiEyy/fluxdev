const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set your Hugging Face API key
const API_KEY = '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';
const MODEL_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';

// Middleware to handle JSON requests
app.use(express.json());

// Directory to store generated images
const IMAGE_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR); // Create the directory if it doesn't exist
}

// API endpoint for image generation
app.get('/flux', async (req, res) => {
    const prompt = req.query.prompt; // Get the prompt from query parameters

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const response = await axios.post(
            MODEL_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer', // Get the image data as ArrayBuffer
            }
        );

        // Generate a unique filename for the image
        const imageName = `image_${Date.now()}.png`;
        const imagePath = path.join(IMAGE_DIR, imageName);

        // Write the image data to a file
        fs.writeFileSync(imagePath, response.data);

        // Construct the full URL for the generated image
        const OTINNISANDIP = `${req.protocol}://${req.get('host')}/${imageName}`;

        // Send the full image URL as a response
        res.json({ imageUrl: imageUrl }); // Return the complete URL
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

// Serve static files from the public directory
app.use(express.static(IMAGE_DIR));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
