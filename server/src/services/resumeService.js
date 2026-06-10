import resumeDal from '../dal/resumesDal.js';
import { NotFoundError } from '../utils/errorHandler.js';

export const getResumes = async (userId) => {
  return resumeDal.getResumesByUserId(userId);
};

export const getResumeById = async (id, userId) => {
  const resume = await resumeDal.getResumeById(id, userId);
  if (!resume) {
    throw new NotFoundError('Resume not found');
  }
  return resume;
};

export const createResume = async (userId, data) => {
  return resumeDal.createResume(userId, data);
};

export const updateResume = async (id, userId, data) => {
  // Check if exists
  await getResumeById(id, userId);
  return resumeDal.updateResume(id, userId, data);
};

export const deleteResume = async (id, userId) => {
  // Check if exists
  await getResumeById(id, userId);
  return resumeDal.deleteResume(id, userId);
};

export default {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
