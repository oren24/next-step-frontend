import { executeWithParameters } from '../config/database.js';
import { PAGINATION } from '../config/constants.js';

/**
 * Get all applications for a user with company details
 * @param {number} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Applications
 */
export const getApplicationsByUserId = async (userId, options = {}) => {
  const { status, page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT ja.id, ja.user_id, ja.company_id, ja.job_title, ja.job_url, ja.status,
           ja.description, ja.applied_date, ja.created_at, ja.updated_at,
           c.name as company_name, c.logo as company_logo
    FROM job_applications ja
    JOIN companies c ON ja.company_id = c.id
    WHERE ja.user_id = $1
  `;
  let params = [userId];
  
  if (status) {
    sql += ' AND ja.status = $2';
    params.push(status);
  }
  
  sql += ' ORDER BY ja.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
  params.push(limit, offset);
  
  const applications = await executeWithParameters(sql, params);
  
  // Fetch tags for each application
  for (const app of applications) {
    app.tags = await getApplicationTags(app.id);
  }
  
  return applications;
};

/**
 * Get single application with company details and tags
 * @param {number} applicationId - Application ID
 * @param {number} userId - User ID (for ownership check)
 * @returns {Promise<Object|null>} Application
 */
export const getApplicationById = async (applicationId, userId) => {
  const sql = `
    SELECT ja.id, ja.user_id, ja.company_id, ja.job_title, ja.job_url, ja.status,
           ja.description, ja.applied_date, ja.created_at, ja.updated_at,
           c.name as company_name, c.logo as company_logo
    FROM job_applications ja
    JOIN companies c ON ja.company_id = c.id
    WHERE ja.id = $1 AND ja.user_id = $2
  `;
  const result = await executeWithParameters(sql, [applicationId, userId]);
  const app = result[0] || null;
  
  if (app) {
    app.tags = await getApplicationTags(applicationId);
  }
  
  return app;
};

/**
 * Create or get company by name
 * @param {string} companyName - Company name
 * @param {string} companyLogo - Company logo URL (optional)
 * @returns {Promise<number>} Company ID
 */
export const getOrCreateCompany = async (companyName, companyLogo = null) => {
  // Check if company exists
  let sql = 'SELECT id FROM companies WHERE name = $1';
  let result = await executeWithParameters(sql, [companyName]);
  
  if (result.length > 0) {
    return result[0].id;
  }
  
  // Create new company
  sql = `
    INSERT INTO companies (name, logo, created_at)
    VALUES ($1, $2, NOW())
    RETURNING id
  `;
  result = await executeWithParameters(sql, [companyName, companyLogo || null]);
  return result[0].id;
};

/**
 * Create application
 * @param {number} userId - User ID
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} Created application
 */
export const createApplication = async (userId, appData) => {
  const {
    company_id,
    company_name,
    job_title,
    job_url,
    company_logo,
    status = 'applied',
    description,
    applied_date = new Date().toISOString().split('T')[0],
    tags = [],
  } = appData;
  
  // Get or create company
  let companyId = company_id;
  if (!companyId && company_name) {
    companyId = await getOrCreateCompany(company_name, company_logo);
  }
  
  if (!companyId) {
    throw new Error('Company ID or company name is required');
  }
  
  const sql = `
    INSERT INTO job_applications
    (user_id, company_id, job_title, job_url, status, description, applied_date, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    RETURNING id, user_id, company_id, job_title, job_url, status, description, applied_date, created_at, updated_at
  `;
  
  const result = await executeWithParameters(sql, [
    userId,
    companyId,
    job_title,
    job_url || null,
    status,
    description || null,
    applied_date,
  ]);
  
  const app = result[0];
  
  // Add initial status history
  await addStatusHistory(app.id, status);
  
  // Add tags if provided
  if (tags && tags.length > 0) {
    await setApplicationTags(app.id, tags);
    app.tags = await getApplicationTags(app.id);
  } else {
    app.tags = [];
  }
  
  // Fetch company details for response
  const companyResult = await executeWithParameters('SELECT name as company_name, logo as company_logo FROM companies WHERE id = $1', [companyId]);
  if (companyResult.length > 0) {
    app.company_name = companyResult[0].company_name;
    app.company_logo = companyResult[0].company_logo;
    app.company_id = companyId;
  }
  
  return app;
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
    company_id,
    company_name,
    job_title,
    job_url,
    company_logo,
    status,
    description,
    applied_date,
    tags,
  } = updates;
  
  let sql = 'UPDATE job_applications SET updated_at = NOW()';
  const params = [];
  let paramCount = 1;
  
  // Handle company update
  if (company_id !== undefined) {
    sql += `, company_id = $${paramCount++}`;
    params.push(company_id);
  } else if (company_name !== undefined) {
    // If company_name provided, get or create company
    const companyId = await getOrCreateCompany(company_name, company_logo);
    sql += `, company_id = $${paramCount++}`;
    params.push(companyId);
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
  
  sql += ' RETURNING id, user_id, company_id, job_title, job_url, status, description, applied_date, created_at, updated_at';
  
  const result = await executeWithParameters(sql, params);
  
  if (!result[0]) {
    return null;
  }
  
  const app = result[0];
  
  // Add status change to history if status changed
  if (status !== undefined) {
    await addStatusHistory(applicationId, status);
  }
  
  // Update tags if provided
  if (tags !== undefined) {
    await setApplicationTags(applicationId, tags);
  }
  
  // Fetch complete application data with company and tags
  const fullSql = `
    SELECT ja.id, ja.user_id, ja.company_id, ja.job_title, ja.job_url, ja.status,
           ja.description, ja.applied_date, ja.created_at, ja.updated_at,
           c.name as company_name, c.logo as company_logo
    FROM job_applications ja
    JOIN companies c ON ja.company_id = c.id
    WHERE ja.id = $1
  `;
  const fullResult = await executeWithParameters(fullSql, [applicationId]);
  const fullApp = fullResult[0];
  
  if (fullApp) {
    fullApp.tags = await getApplicationTags(applicationId);
    return fullApp;
  }
  
  return null;
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

/**
 * Get tags for application
 * @param {number} applicationId - Application ID
 * @returns {Promise<Array>} Array of tags
 */
export const getApplicationTags = async (applicationId) => {
  const sql = `
    SELECT t.id, t.name
    FROM tags t
    JOIN application_tags at ON t.id = at.tag_id
    WHERE at.application_id = $1
    ORDER BY t.name ASC
  `;
  return executeWithParameters(sql, [applicationId]);
};

/**
 * Get or create tag
 * @param {string} tagName - Tag name
 * @returns {Promise<number>} Tag ID
 */
export const getOrCreateTag = async (tagName) => {
  let sql = 'SELECT id FROM tags WHERE name = $1';
  let result = await executeWithParameters(sql, [tagName]);
  
  if (result.length > 0) {
    return result[0].id;
  }
  
  sql = 'INSERT INTO tags (name, created_at) VALUES ($1, NOW()) RETURNING id';
  result = await executeWithParameters(sql, [tagName]);
  return result[0].id;
};

/**
 * Set application tags (replace existing)
 * @param {number} applicationId - Application ID
 * @param {Array} tags - Array of tag names or IDs
 * @returns {Promise<void>}
 */
export const setApplicationTags = async (applicationId, tags) => {
  // Delete existing tags
  const deleteSql = 'DELETE FROM application_tags WHERE application_id = $1';
  await executeWithParameters(deleteSql, [applicationId]);
  
  if (!tags || tags.length === 0) {
    return;
  }
  
  // Add new tags
  for (const tag of tags) {
    let tagId;
    
    if (typeof tag === 'number') {
      tagId = tag;
    } else {
      tagId = await getOrCreateTag(tag);
    }
    
    const insertSql = 'INSERT INTO application_tags (application_id, tag_id) VALUES ($1, $2)';
    await executeWithParameters(insertSql, [applicationId, tagId]);
  }
};

/**
 * Add tag to application
 * @param {number} applicationId - Application ID
 * @param {string|number} tag - Tag name or ID
 * @returns {Promise<void>}
 */
export const addApplicationTag = async (applicationId, tag) => {
  let tagId;
  
  if (typeof tag === 'number') {
    tagId = tag;
  } else {
    tagId = await getOrCreateTag(tag);
  }
  
  const sql = `
    INSERT INTO application_tags (application_id, tag_id)
    VALUES ($1, $2)
    ON CONFLICT (application_id, tag_id) DO NOTHING
  `;
  await executeWithParameters(sql, [applicationId, tagId]);
};

/**
 * Remove tag from application
 * @param {number} applicationId - Application ID
 * @param {number} tagId - Tag ID
 * @returns {Promise<void>}
 */
export const removeApplicationTag = async (applicationId, tagId) => {
  const sql = 'DELETE FROM application_tags WHERE application_id = $1 AND tag_id = $2';
  await executeWithParameters(sql, [applicationId, tagId]);
};

/**
 * Get all companies
 * @returns {Promise<Array>} All companies
 */
export const getAllCompanies = async () => {
  const sql = 'SELECT id, name, logo, created_at FROM companies ORDER BY name ASC';
  return executeWithParameters(sql, []);
};

/**
 * Get all tags
 * @returns {Promise<Array>} All tags
 */
export const getAllTags = async () => {
  const sql = 'SELECT id, name, created_at FROM tags ORDER BY name ASC';
  return executeWithParameters(sql, []);
};

export default {
  getApplicationsByUserId,
  getApplicationById,
  getOrCreateCompany,
  createApplication,
  updateApplication,
  deleteApplication,
  addStatusHistory,
  getStatusHistory,
  getApplicationTags,
  getOrCreateTag,
  setApplicationTags,
  addApplicationTag,
  removeApplicationTag,
  getAllCompanies,
  getAllTags,
};
