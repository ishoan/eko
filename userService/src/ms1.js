const http = require('http');
const { init, logger } = require('../../myLogger/src/index.js');

http.createServer((req, res) => {
    let isProduction = process.env.NODE_ENV === 'production';
    init({ apiKey: 'USER_SERVICE_API_KEY', isProduction });
    
    // Log timestamp for each HTTP GET request and respond
    if (req.method === 'GET') {
        const ts = new Date().toISOString();
        logger.log(`HTTP GET received - timestamp: ${ts}`);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`OK - ${ts}`);
        return;
    }
    
    class UserService {
       processLogin(user) {
            logger.info(`Processing login for user: ${user}`);
            // Simulate login processing
            try {
                if (!user) {
                    throw new Error('Invalid user');
                }
                logger.log(`User ${user} logged in successfully.`);
            } catch (error) {
                logger.error(`Login error for user ${user}:`, error);
            }
        } 
    }

}).listen(4201, () => console.log('user service running on port 4201'));
