import { executeWithParameters } from '../config/database.js';
import { PAGINATION } from '../config/constants.js';

/**
 * Get all applications for a user
 * @param {number} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Applications
 */
export const getApplicationsByUserId = async (userId, options = {}) => {
  const { status, page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;
  
  let sql = 'SELECT * FROM job_applications WHERE user_id = $1';
  let params = [userId];
  
  if (status) {
    sql += ' AND status = $2';
    params.push(status);
  }
  
  sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);
  
  return executeWithParameters(sql, params);
};

/**
 * Get single application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID (for ownership check)
 * @returns {Promise<Object|null>} Application
 */
export const getApplicationById = async (applicationId, userId) => {
  const sql = 'SELECT * FROM job_applications WHERE id = $1 AND user_id = $2';
  const result = await executeWithParameters(sql, [applicationId, userId]);
  return result[0] || null;
};

/**
 * Create application
 * @param {number} userId - User ID
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} Created application
 */
export const createApplication = async (userId, appData) => {
  const {
    company_name,
    job_title,
    job_url,
    status = 'applied',
    description,
    applied_date = new Date().toISOString().split('T')[0],
  } = appData;
  
  const sql = `
    INSERT INTO job_applications
    (user_id, company_name, job_title, job_url, status, description, applied_date, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING *
  `;
  
  const result = await executeWithParameters(sql, [
    userId,
    company_name,
    job_title,
    job_url || null,
    status,
    description || null,
    applied_date,
  ]);
  
  // Add initial status history
  await addStatusHistory(result[0].id, status);
  
  return result[0];
};

/**
 * Update application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated application
 */
export const updateApplication = async (applicationId, userId, updates) => {
  const {
    company_name,
    job_title,
    job_url,
    status,
    description,
    applied_date,
  } = updates;
  
  let sql = 'UPDATE job_applications SET updated_at = NOW()';
  const params = [];
  let paramCount = 1;
  
  if (company_name !== undefined) {
    sql += `, company_name = $${paramCount++}`;
    params.push(company_name);
  }
  if (job_title !== undefined) {
    sql += `, job_title = $${paramCount++}`;
    params.push(job_title);
  }
  if (job_url !== undefined) {
    sql += `, job_url = $${paramCount++}`;
    params.push(job_url);
  }
  if (status !== undefined) {
    sql += `, status = $${paramCount++}`;
    params.push(status);
  }
  if (description !== undefined) {
    sql += `, description = $${paramCount++}`;
    params.push(description);
  }
  if (applied_date !== undefined) {
    sql += `, applied_date = $${paramCount++}`;
    params.push(applied_date);
  }
  
  sql += ` WHERE id = $${paramCount++} AND user_id = $${paramCount++}`;
  params.push(applicationId, userId);
  
  sql += ' RETURNING *';
  
  const result = await executeWithParameters(sql, params);
  
  // Add status change to history if status changed
  if (status !== undefined) {
    await addStatusHistory(applicationId, status);
  }
  
  return result[0] || null;
};

/**
 * Delete application
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success
 */
export const deleteApplication = async (applicationId, userId) => {
  const sql = 'DELETE FROM job_applications WHERE id = $1 AND user_id = $2';
  await executeWithParameters(sql, [applicationId, userId]);
  return true;
};

/**
 * Add status history entry
 * @param {number} applicationId - Application ID
 * @param {string} status - New status
 * @returns {Promise<Object>} History entry
 */
export const addStatusHistory = async (applicationId, status) => {
  const sql = `
    INSERT INTO application_statuses (application_id, status, timestamp)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;
  const result = await executeWithParameters(sql, [applicationId, status]);
  return result[0];
};

/**
 * Get status history for application
 * @param {number} applicationId - Application ID
 * @returns {Promise<Array>} Status history
 */
export const getStatusHistory = async (applicationId) => {
  const sql = `
    SELECT status, timestamp FROM application_statuses
    WHERE application_id = $1
    ORDER BY timestamp ASC
  `;
  return executeWithParameters(sql, [applicationId]);
};

export default {
  getApplicationsByUserId,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  addStatusHistory,
  getStatusHistory,
};
