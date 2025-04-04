const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        // Launch Puppeteer with Render-compatible settings
        const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome', // Use system Chrome
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--single-process']
});
        
        const pages = await browser.pages();
        console.log('Open tabs:', pages.length);
        
        // Log all open tabs
        const tabs = await Promise.all(pages.map(async (page) => {
            return await page.title();
        }));

        console.log('Tab titles:', tabs);

        await browser.close();
    } catch (error) {
        console.error('Error launching Chrome:', error);
    }
});
