/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User full name
 * @property {string} [bio] - User biography
 * @property {string} [profile_picture] - User profile picture URL
 * @property {string} created_at - Creation timestamp (ISO 8601)
 * @property {string} updated_at - Last update timestamp (ISO 8601)
 */

/**
 * @typedef {Object} JobApplication
 * @property {number} id - Application ID
 * @property {number} user_id - User ID (owner)
 * @property {string} company_name - Company name
 * @property {string} [company_logo] - URL to company logo (optional)
 * @property {string} job_title - Job title
 * @property {string} [job_url] - URL to job posting
 * @property {string} status - Application status (wishlist|applied|interviewing|offer|rejected)
 * @property {string} [description] - Application description/notes
 * @property {string} applied_date - Date application was submitted (YYYY-MM-DD)
 * @property {string} created_at - Creation timestamp (ISO 8601)
 * @property {string} updated_at - Last update timestamp (ISO 8601)
 */

/**
 * @typedef {Object} StatusHistory
 * @property {string} status - Job application status
 * @property {string} timestamp - When status changed (ISO 8601)
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success - Request success
 * @property {Object} data - Response data
 * @property {User} data.user - User object
 * @property {string} data.token - JWT authentication token
 */

/**
 * @typedef {Object} ApplicationResponse
 * @property {boolean} success - Request success
 * @property {Array<JobApplication>} data - Applications array
 * @property {Object} [pagination] - Pagination info
 * @property {number} pagination.page - Current page
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.total - Total items
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false
 * @property {Object} error - Error details
 * @property {string} error.name - Error type
 * @property {string} error.message - Error message
 * @property {number} error.statusCode - HTTP status code
 */

export default {
  // Type definitions above
};
