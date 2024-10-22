const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set your Hugging Face API keys and model URLs
const API_KEY = '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';
const FLUX_MODEL_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
const SD_MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2';
const ANIME_MODEL_URL = 'https://api-inference.huggingface.co/models/brushpenbob/flux-midjourney-anime';

// Middleware to handle JSON requests
app.use(express.json());

// Directory to store generated images
const IMAGE_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR); // Create the directory if it doesn't exist
}

// API endpoint for FLUX image generation
app.get('/flux', async (req, res) => {
    const prompt = req.query.prompt; // Get the prompt from query parameters

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const response = await axios.post(
            FLUX_MODEL_URL,
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
        const imageUrl = `${req.protocol}://${req.get('host')}/${imageName}`;

        // Send the full image URL as a response
        res.json({ imageUrl: imageUrl }); // Return the complete URL
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

// API endpoint for Stable Diffusion image generation
app.get('/sd', async (req, res) => {
    const prompt = req.query.prompt; // Get the prompt from query parameters

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const response = await axios.post(
            SD_MODEL_URL,
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
        const imageName = `image_sd_${Date.now()}.png`;
        const imagePath = path.join(IMAGE_DIR, imageName);

        // Write the image data to a file
        fs.writeFileSync(imagePath, response.data);

        // Construct the full URL for the generated image
        const imageUrl = `${req.protocol}://${req.get('host')}/${imageName}`;

        // Send the full image URL as a response
        res.json({ imageUrl: imageUrl }); // Return the complete URL
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

// New API endpoint for Anime image generation
app.get('/anime', async (req, res) => {
    const prompt = req.query.prompt; // Get the prompt from query parameters

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const response = await axios.post(
            ANIME_MODEL_URL,
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
        const imageName = `image_anime_${Date.now()}.png`;
        const imagePath = path.join(IMAGE_DIR, imageName);

        // Write the image data to a file
        fs.writeFileSync(imagePath, response.data);

        // Construct the full URL for the generated image
        const imageUrl = `${req.protocol}://${req.get('host')}/${imageName}`;

        // Send the full image URL as a response
        res.json({ imageUrl: imageUrl }); // Return the complete URL
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

// Serve static files from the public directory
app.use(express.static(IMAGE_DIR));

// Serve HTML for the root endpoint
app.get('/', (req, res) => {
    res.send(`
        <h1>Image Generation API</h1>
        <p>Available Endpoints:</p>
        <ul>
            <li><a href="/flux?prompt=your_prompt_here">/flux?prompt=</a></li>
            <li><a href="/sd?prompt=your_prompt_here">/sd?prompt=</a></li>
            <li><a href="/anime?prompt=your_prompt_here">/anime?prompt=</a></li>
        </ul>
        <p>Enjoy :)</p>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
