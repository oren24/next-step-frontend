import * as userService from '../services/userService.js';
import { HTTP_CODES } from '../config/constants.js';

/**
 * Get user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.userId);
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updated = await userService.updateProfile(req.userId, req.validated);
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.validated;
    await userService.changePassword(req.userId, current_password, new_password);
    res.status(HTTP_CODES.OK).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
