const express = require('express');
const path = require('path');
const CDP = require('chrome-remote-interface');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        const client = await CDP({ host: 'localhost', port: 9222 });
        const { Network, Page } = client;
        
        await Promise.all([Network.enable(), Page.enable()]);
        
        const tabs = await CDP.List();
        console.log('Open tabs:', tabs);

        await client.close();
    } catch (error) {
        console.error('Error connecting to Chrome DevTools:', error);
    }
});
