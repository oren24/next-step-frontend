import * as applicationService from '../services/applicationService.js';
import { HTTP_CODES } from '../config/constants.js';

/**
 * Get all applications
 */
export const getApplications = async (req, res, next) => {
  try {
    const result = await applicationService.getApplications(req.userId, req.query);
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single application
 */
export const getApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await applicationService.getApplication(parseInt(id), req.userId);
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create application
 */
export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.userId, req.validated);
    res.status(HTTP_CODES.CREATED).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application
 */
export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await applicationService.updateApplication(parseInt(id), req.userId, req.validated);
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete application
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await applicationService.deleteApplication(parseInt(id), req.userId);
    res.status(HTTP_CODES.OK).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all companies
 */
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await applicationService.getCompanies();
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tags
 */
export const getTags = async (req, res, next) => {
  try {
    const tags = await applicationService.getTags();
    res.status(HTTP_CODES.OK).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};
