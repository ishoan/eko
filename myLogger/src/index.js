const http = require('http');
const ServiceLogger = require('./loggerService');

let config = {
    isProd: process.env.NODE_ENV === 'production',
    initialized: false
};

http.createServer((req, res) => {

    const logger = {
        init(options = {}) {
            config = { ...config, ...options };

            if (config.isProd && config.apiKey) {
                ServiceLogger.init(config.apiKey);
            }
            config.initialized = true;
        },

        log(...args) {
            this._execLogs('log', args);
        },
        info(...args) {
            this._execLogs('info', args);
        },
        warn(...args) {
            this._execLogs('warn', args);
        },
        error(...args) {
            this._execLogs('error', args);
        },

        _execLogs(level, args) {
            if (config.isProd) {
                ServiceLogger[level](...args);
            } else {
                console[level](...args);
            }
        }
    }
}).listen(4200, () => console.log('logger service running on port 4200'));

module.exports = {
    init,
    ...logger
}; 