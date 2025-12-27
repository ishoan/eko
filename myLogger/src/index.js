const ServiceLogger = require('./loggerService.js');

// Configuration object to hold logger state
let settings = {
    isProd: false,
    initialized: false,
    apiKey: null
};

/**
 * Initializes the logger with the provided configuration options.
 * Must be called before using the logger methods.
 * 
 * @param {Object} [config={}] - Configuration options for the logger
 * @param {string} [config.apiKey] - API key required for production mode logging
 * @param {boolean} [config.isProd=false] - Flag to enable production mode
 **/
function init(config = {}) {
    // guard against multiple inits
    if (settings.initialized) {
        console.warn('Logger already initialized');
        return;
    }

    // merge options into config(defaults)
    settings = { ...settings, ...config };

    // initialize the underlying service logger only if in production with API key
    if (settings.isProd && settings.apiKey) {
        ServiceLogger.init(settings.apiKey);
    } else if (settings.isProd && !settings.apiKey) {
        throw new Error('API key required for production mode');
    }

    settings.initialized = true;
}

// private method to execute logging based on environment
function _dispatchLog(level, args) {
    // warn if not initialized
    if (!settings.initialized) {
        console.warn('Logger not initialized, using console');
        init();
    }
    // Depending on environment, log to service or console
    if (settings.isProd && settings.apiKey) {
        try {
            ServiceLogger[level](...args);
        } catch (e) {
            console.error('Logging service error:', e);
        }
    } else {
        console[level](...args);
    }
}

// logger object with log, info, warn, error methods
const logger = {
    log: (...args) => _dispatchLog('log', args),
    info: (...args) => _dispatchLog('info', args),
    warn: (...args) => _dispatchLog('warn', args),
    error: (...args) => _dispatchLog('error', args)
};

// Export the init function and logger object(in order to use like console.log e.g logger.log);
module.exports = {
    init,
    logger
};