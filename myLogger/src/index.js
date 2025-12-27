const ServiceLogger = require('./loggerService.js');

// Configuration object to hold logger state
let config = {
    isProd: false,
    initialized: false,
    apiKey: null
};

/**
 * Initializes the logger with the provided configuration options.
 * Must be called before using the logger methods.
 * 
 * @param {Object} [options={}] - Configuration options for the logger
 * @param {string} [options.apiKey] - API key required for production mode logging
 * @param {boolean} [options.isProd=false] - Flag to enable production mode
 **/
function init(options = {}) {
    // guard against multiple inits
    if (config.initialized) {
        console.warn('Logger already initialized');
        return;
    }
    
    // merge options into config(defaults)
    config = { ...config, ...options };

    // initialize the underlying service logger only if in production with API key
    if (config.isProd && config.apiKey) {
        ServiceLogger.init(config.apiKey);
    } else if (config.isProd && !config.apiKey) {
        throw new Error('API key required for production mode');
    }
    
    config.initialized = true;
}

// logger object with log, info, warn, error methods
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

    // private method to execute logging based on environment
    _execLogs(level, args) {
        // warn if not initialized
        if (!config.initialized) {
            console.warn('Logger not initialized, using console');
        }
        // Depending on environment, log to service or console
        if (config.isProd && config.apiKey) {
            try {
                ServiceLogger[level](...args);
            } catch (e) {
                console.error('Logging service error:', e);
            }
        } else {
            console[level](...args);
        }
    }
};

// Export the init function and logger object(in order to use like console.log e.g logger.log);
module.exports = {
    init,
    logger
};