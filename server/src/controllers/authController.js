import * as authService from '../services/authService.js';
import { HTTP_CODES } from '../config/constants.js';

/**
 * Register user controller
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.validated;
    const result = await authService.register(email, password, name);
    
    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user controller
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;
    const result = await authService.login(email, password);
    
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * OAuth Login controller
 */
export const oauthLogin = async (req, res, next) => {
  try {
    const { email, name, provider } = req.body; // Add basic validation directly here or via schema
    if (!email || !name || !provider) {
      return res.status(HTTP_CODES.BAD_REQUEST).json({ success: false, message: 'Email, name, and provider are required' });
    }
    const result = await authService.oauthLogin(email, name);
    
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  oauthLogin,
};
