import { executeWithParameters } from '../config/database.js';

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = $1';
  const result = await executeWithParameters(sql, [email]);
  return result[0] || null;
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserById = async (userId) => {
  const sql = 'SELECT id, email, name, profile_picture, bio, created_at, updated_at FROM users WHERE id = $1';
  const result = await executeWithParameters(sql, [userId]);
  return result[0] || null;
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (email, passwordHash, name) => {
  const sql = `
    INSERT INTO users (email, password_hash, name, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    RETURNING id, email, name, created_at, updated_at
  `;
  const result = await executeWithParameters(sql, [email, passwordHash, name]);
  return result[0];
};

/**
 * Update user password
 * @param {number} userId - User ID
 * @param {string} passwordHash - New password hash
 * @returns {Promise<boolean>} Success
 */
export const updateUserPassword = async (userId, passwordHash) => {
  const sql = 'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2';
  await executeWithParameters(sql, [passwordHash, userId]);
  return true;
};

export default {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserPassword,
};
