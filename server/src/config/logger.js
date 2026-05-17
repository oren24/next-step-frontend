const isDevelopment = process.env.NODE_ENV === 'development';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const timestamp = () => {
  return new Date().toISOString();
};

const log = (level, message, data = '') => {
  const time = timestamp();
  const levelStr = `[${level}]`.padEnd(10);
  const logMessage = `${time} ${levelStr} ${message}`;
  
  if (isDevelopment) {
    console.log(logMessage);
    if (data) console.log(data);
  } else {
    // In production, log to file or service
    console.log(logMessage);
    if (data) console.log(data);
  }
};

export const logger = {
  info: (message, data) => {
    log('INFO', message, data);
  },
  
  error: (message, error) => {
    log('ERROR', message, error?.message || error);
  },
  
  warn: (message, data) => {
    log('WARN', message, data);
  },
  
  debug: (message, data) => {
    if (isDevelopment) {
      log('DEBUG', message, data);
    }
  },
  
  request: (method, path, statusCode, duration) => {
    if (isDevelopment) {
      log('HTTP', `${method} ${path} - ${statusCode} (${duration}ms)`);
    }
  },
};

export default logger;
