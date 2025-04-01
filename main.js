const { Client } = require('chrome-remote-interface');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.get('/', (req, res) =&gt; {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () =&gt; {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Run the script to print all tabs
    (async () =&gt; {
        const client = await Client.create();
        await client.connectToTarget('localhost:8080');

        const { Network, Page, DOM, Runtime} = client.Target.createTargetSpec('', {useSingleRPCHandler: true});

        await Promise.all([Network.enable(), Page.enable(), DOM.enable(), Runtime.enable()]);

        const { Tab } = client.Target.addTargetSpec('', {useSingleRPCHandler: true});
        const tabId = await Page.getAll().then(pages => pages[0].id);

        const { Tab.get, Tab.sendCommand } = client.Target.getTarget(tabId);

        await Tab.get(tabId, ['tabs']);

        const { tabs } = await Tab.get(tabId);

        console.log(tabs);

        // Send the tabs data to the client
        client.on('Target.Tab.added', (tab) =&gt; {
            client.send('Runtime.evaluate', {
                expression: `window.tabs = ${JSON.stringify(tabs)};`,
                runInContext: tab.id,
            });
        });

        await client.close();
    })();
});
