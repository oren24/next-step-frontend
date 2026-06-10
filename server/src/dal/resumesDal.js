import { executeWithParameters } from '../config/database.js';

export const getResumesByUserId = async (userId) => {
  const sql = `
    SELECT id, user_id, title, target_role, file_path, original_filename, note, created_at, updated_at
    FROM resumes
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  return executeWithParameters(sql, [userId]);
};

export const getResumeById = async (id, userId) => {
  const sql = `
    SELECT id, user_id, title, target_role, file_path, original_filename, note, created_at, updated_at
    FROM resumes
    WHERE id = $1 AND user_id = $2
  `;
  const result = await executeWithParameters(sql, [id, userId]);
  return result[0] || null;
};

export const createResume = async (userId, data) => {
  const { title, target_role, file_path, original_filename, note } = data;
  const sql = `
    INSERT INTO resumes (user_id, title, target_role, file_path, original_filename, note, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING id, user_id, title, target_role, file_path, original_filename, note, created_at, updated_at
  `;
  const result = await executeWithParameters(sql, [userId, title, target_role || null, file_path || null, original_filename || null, note || null]);
  return result[0];
};

export const updateResume = async (id, userId, data) => {
  const { title, target_role, file_path, original_filename, note } = data;
  const sql = `
    UPDATE resumes
    SET title = COALESCE($1, title),
        target_role = COALESCE($2, target_role),
        file_path = COALESCE($3, file_path),
        original_filename = COALESCE($4, original_filename),
        note = COALESCE($5, note),
        updated_at = NOW()
    WHERE id = $6 AND user_id = $7
    RETURNING id, user_id, title, target_role, file_path, original_filename, note, created_at, updated_at
  `;
  const result = await executeWithParameters(sql, [title, target_role, file_path, original_filename, note, id, userId]);
  return result[0] || null;
};

export const deleteResume = async (id, userId) => {
  const sql = `DELETE FROM resumes WHERE id = $1 AND user_id = $2`;
  await executeWithParameters(sql, [id, userId]);
  return true;
};

export default {
  getResumesByUserId,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
