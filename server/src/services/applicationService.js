import * as applicationsDal from '../dal/applicationsDal.js';
import { isValidJobStatus } from '../utils/validators.js';
import { NotFoundError, ValidationError } from '../utils/errorHandler.js';

/**
 * Get all applications for user
 * @param {number} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Applications and pagination
 */
export const getApplications = async (userId, filters = {}) => {
  const { status, page = 1, limit = 20 } = filters;
  
  if (status && !isValidJobStatus(status)) {
    throw new ValidationError('Invalid job status');
  }
  
  const applications = await applicationsDal.getApplicationsByUserId(userId, {
    status,
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100), // Max 100 per page
  });
  
  return {
    applications,
    pagination: {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 100),
      total: applications.length,
    },
  };
};

/**
 * Get single application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Application with status history
 */
export const getApplication = async (applicationId, userId) => {
  const application = await applicationsDal.getApplicationById(applicationId, userId);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }
  
  // Get status history
  const statusHistory = await applicationsDal.getStatusHistory(applicationId);
  application.status_history = statusHistory;
  
  return application;
};

/**
 * Create application
 * @param {number} userId - User ID
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} Created application
 */
export const createApplication = async (userId, appData) => {
  // Validation
  const hasCompanyId = appData.company_id !== undefined && appData.company_id !== null;
  const hasCompanyName = appData.company_name !== undefined && appData.company_name !== null;
  
  if (!hasCompanyId && !hasCompanyName) {
    throw new ValidationError('Either company_id or company_name is required');
  }
  
  if (!appData.job_title) {
    throw new ValidationError('Job title is required');
  }
  
  if (appData.status && !isValidJobStatus(appData.status)) {
    throw new ValidationError('Invalid job status');
  }
  
  return applicationsDal.createApplication(userId, appData);
};

/**
 * Update application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated application
 */
export const updateApplication = async (applicationId, userId, updates) => {
  // Check if application exists
  const existing = await applicationsDal.getApplicationById(applicationId, userId);
  if (!existing) {
    throw new NotFoundError('Application not found');
  }
  
  // Validate status if provided
  if (updates.status && !isValidJobStatus(updates.status)) {
    throw new ValidationError('Invalid job status');
  }
  
  const updated = await applicationsDal.updateApplication(applicationId, userId, updates);
  
  if (!updated) {
    throw new NotFoundError('Application not found');
  }
  
  return updated;
};

/**
 * Delete application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success
 */
export const deleteApplication = async (applicationId, userId) => {
  // Check if application exists
  const existing = await applicationsDal.getApplicationById(applicationId, userId);
  if (!existing) {
    throw new NotFoundError('Application not found');
  }
  
  return applicationsDal.deleteApplication(applicationId, userId);
};

/**
 * Get all companies
 * @returns {Promise<Array>} All companies
 */
export const getCompanies = async () => {
  return applicationsDal.getAllCompanies();
};

/**
 * Get all tags
 * @returns {Promise<Array>} All tags
 */
export const getTags = async () => {
  return applicationsDal.getAllTags();
};

export default {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getCompanies,
  getTags,
};
