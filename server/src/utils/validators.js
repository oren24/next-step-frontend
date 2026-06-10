/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength (min 6 chars)
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate required fields
 * @param {Object} obj - Object to validate
 * @param {Array<string>} requiredFields - Required field names
 * @throws {Error} If any required field is missing
 */
export const validateRequired = (obj, requiredFields) => {
  for (const field of requiredFields) {
    if (!obj[field]) {
      throw new Error(`${field} is required`);
    }
  }
};

/**
 * Validate job application status
 * @param {string} status - Status to validate
 * @returns {boolean} True if valid
 */
export const isValidJobStatus = (status) => {
  const validStatuses = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'];
  return validStatuses.includes(status);
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().slice(0, 500);
};

export default {
  isValidEmail,
  isValidPassword,
  validateRequired,
  isValidJobStatus,
  sanitizeInput,
};
