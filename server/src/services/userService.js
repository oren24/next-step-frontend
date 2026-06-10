import * as usersDal from '../dal/usersDal.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { NotFoundError, UnauthorizedError, ValidationError } from '../utils/errorHandler.js';

/**
 * Get user profile
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User profile
 */
export const getProfile = async (userId) => {
  const user = await usersDal.getUserById(userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  return user;
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (userId, updates) => {
  const updated = await usersDal.updateProfile(userId, updates);
  
  if (!updated) {
    throw new NotFoundError('User not found');
  }
  
  return updated;
};

/**
 * Change user password
 * @param {number} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  // Validate passwords
  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current and new passwords are required');
  }
  
  if (newPassword.length < 6) {
    throw new ValidationError('New password must be at least 6 characters');
  }
  
  if (currentPassword === newPassword) {
    throw new ValidationError('New password must be different from current password');
  }
  
  // Get user credentials
  const user = await usersDal.getUserCredentials(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // Verify current password
  const isPasswordValid = await verifyPassword(currentPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }
  
  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  
  // Update password
  await usersDal.updatePassword(userId, newPasswordHash);
  
  return true;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
