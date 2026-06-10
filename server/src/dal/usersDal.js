import { executeWithParameters } from '../config/database.js';

/**
 * Get user by ID with profile info
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object
 */
export const getUserById = async (userId) => {
  const sql = `
    SELECT id, email, name, bio, profile_picture, created_at, updated_at
    FROM users WHERE id = $1
  `;
  const result = await executeWithParameters(sql, [userId]);
  return result[0] || null;
};

/**
 * Get user credentials (for password verification)
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User with password_hash
 */
export const getUserCredentials = async (userId) => {
  const sql = 'SELECT id, email, password_hash FROM users WHERE id = $1';
  const result = await executeWithParameters(sql, [userId]);
  return result[0] || null;
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user
 */
export const updateProfile = async (userId, updates) => {
  const { name, bio, profile_picture } = updates;
  
  let sql = 'UPDATE users SET updated_at = NOW()';
  const params = [];
  let paramCount = 1;
  
  if (name !== undefined) {
    sql += `, name = $${paramCount++}`;
    params.push(name);
  }
  if (bio !== undefined) {
    sql += `, bio = $${paramCount++}`;
    params.push(bio);
  }
  if (profile_picture !== undefined) {
    sql += `, profile_picture = $${paramCount++}`;
    params.push(profile_picture);
  }
  
  sql += ` WHERE id = $${paramCount++} RETURNING id, email, name, bio, profile_picture, created_at, updated_at`;
  params.push(userId);
  
  const result = await executeWithParameters(sql, params);
  return result[0] || null;
};

/**
 * Update user password
 * @param {number} userId - User ID
 * @param {string} passwordHash - New password hash
 * @returns {Promise<boolean>} Success
 */
export const updatePassword = async (userId, passwordHash) => {
  const sql = 'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2';
  await executeWithParameters(sql, [passwordHash, userId]);
  return true;
};

export default {
  getUserById,
  getUserCredentials,
  updateProfile,
  updatePassword,
};
