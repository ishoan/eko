const http = require('http');
const { init, logger } = require('myLogger');

// Initialize logger based on environment and API key when the service starts
const isProduction = process.env.NODE_ENV === 'production';
const loggerOptions = { apiKey: 'USER_SERVICE_API_KEY', isProd: isProduction };
init(loggerOptions);

http.createServer((req, res) => {

    // Log timestamp for each HTTP GET request and respond
    if (req.method === 'GET') {
        const ts = new Date().toISOString();
        logger.log(`HTTP GET received - timestamp: ${ts}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`OK - ${ts}`);
        return;
    }

}).listen(4201, () => console.log('env:', process.env.NODE_ENV));
