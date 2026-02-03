/**
 * @typedef {'Remote' | 'On site' | 'Hybrid'} WorkType
 */

/**
 * @typedef {'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'} JobStatus
 */

/**
 * @typedef {Object} Company
 * @property {string} id - Unique company identifier
 * @property {string} name - Company display name
 * @property {string} [companyLogo] - URL to the company logo (optional)
 * @property {string} [website] - Company website (optional)
 */

/**
 * @typedef {Object} JobApplication
 * @property {string} id - Unique identifier
 * @property {string} companyName - Name of the company
 * @property {string} [companyLogo] - URL to company logo (optional)
 * @property {string} jobTitle - Job title
 * @property {string} [jobUrl] - Link to the job description (optional)
 * @property {string} [location] - Physical location of the job (optional)
 * @property {WorkType} workType - Work model
 * @property {JobStatus} status - Current application status
 * @property {string[]} [tags] - List of tags (max 5)
 * @property {string} createdAt - Creation date (ISO 8601)
 * @property {string} updatedAt - Last update date (ISO 8601)
 * @property {string} [appliedDate] - Date of application (ISO 8601)
 * @property {string} [platform] - Platform used to apply (e.g., LinkedIn)
 * @property {string} [notes] - Free text notes
 * @property {string} [nextInterviewDate] - Date of the next interview (ISO 8601)
 * @property {string} [round] - Description of the current interview round
 * @property {string} [answerDeadline] - Deadline to return an answer (ISO 8601)
 * @property {number} [offerAmount] - Offered salary amount
 * @property {string} [offerCurrency] - Currency of the offer (e.g., 'ILS', 'USD', 'EUR')
 */
