import { crawl, write } from "./core.js";
import express from 'express';

const app = express();

const port = 4000; // or any other port you prefer

// Enable all origins for CORS (replace with your specific origin in production)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(`Received a ${req.method} request to ${req.path}`);
    next();
  });

// Define a route to handle OPTIONS requests (preflight)
app.options('/crawl', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(`Received an OPTIONS request to ${req.path}`);
    res.sendStatus(200);
  });

// Define a route to start crawling with a POST request
app.post('/crawl', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
  try {
    const { url, match, maxPagesToCrawl } = req.query; // Assuming the data is sent in the request body

    const config = {
        url:url as string,
        match: match ? [match as string] : '',
        maxPagesToCrawl: maxPagesToCrawl ? parseInt(maxPagesToCrawl as string) : 10,
        outputFileName: 'output.json'
        // Add other configuration options if needed
      };

    // Start the crawling process
    await crawl(config);
    const jsonFiles = await write();
    res.status(200).json( jsonFiles );
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during crawling');
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});