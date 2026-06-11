import resumeService from '../services/resumeService.js';

export const getResumes = async (req, res) => {
  const userId = req.userId;
  const resumes = await resumeService.getResumes(userId);
  res.json({
    success: true,
    data: resumes,
  });
};

export const getResumeById = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const resume = await resumeService.getResumeById(id, userId);
  res.json({
    success: true,
    data: resume,
  });
};

export const createResume = async (req, res) => {
  const userId = req.userId;
  const data = req.body;

  const newResume = await resumeService.createResume(userId, data);
  res.status(201).json({
    success: true,
    data: newResume,
  });
};

export const updateResume = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const data = req.body;

  const updatedResume = await resumeService.updateResume(id, userId, data);
  res.json({
    success: true,
    data: updatedResume,
  });
};

export const deleteResume = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  await resumeService.deleteResume(id, userId);
  res.json({
    success: true,
    message: 'Resume deleted successfully',
  });
};

export default {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
