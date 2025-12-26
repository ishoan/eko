const ServiceLogger = require('./loggerService.js');

let config = {
    isProd: false,
    initialized: false,
    apiKey: null
};

function init(options = {}) {
    if (config.initialized) {
        console.warn('Logger already initialized');
        return;
    }
    
    config = { ...config, ...options };

    if (config.isProd && config.apiKey) {
        ServiceLogger.init(config.apiKey);
    } else if (config.isProd && !config.apiKey) {
        throw new Error('API key required for production mode');
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
        if (!config.initialized) {
            console.warn('Logger not initialized, using console');
        }
        
        if (config.isProd && config.apiKey) {
            ServiceLogger[level](...args);
        } else {
            console[level](...args);
        }
    }
};

module.exports = {
    init,
    logger
};