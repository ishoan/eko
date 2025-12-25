const ServiceLogger = require('./loggerService.js');

let config = {
    isProd: process.env.NODE_ENV === 'production',
    initialized: false
};

function init(options = {}) {
    config = { ...config, ...options };

    if (config.isProd && config.apiKey) {
        ServiceLogger.init(config.apiKey);
    }
    config.initialized = true;
}

const logger = {
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

module.exports = {
    init,
    logger
};