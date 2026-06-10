import { executeWithParameters } from '../config/database.js';

export const getConnectionsByUserId = async (userId) => {
  const sql = `
    SELECT id, user_id, name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes, created_at, updated_at
    FROM connections
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  return executeWithParameters(sql, [userId]);
};

export const getConnectionById = async (id, userId) => {
  const sql = `
    SELECT id, user_id, name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes, created_at, updated_at
    FROM connections
    WHERE id = $1 AND user_id = $2
  `;
  const result = await executeWithParameters(sql, [id, userId]);
  return result[0] || null;
};

export const createConnection = async (userId, data) => {
  const { name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes } = data;
  const sql = `
    INSERT INTO connections 
      (user_id, name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    RETURNING id, user_id, name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes, created_at, updated_at
  `;
  const result = await executeWithParameters(sql, [
    userId,
    name,
    role || null,
    contact_details || null,
    portfolio_url || null,
    location_or_company || null,
    last_contacted_date || null,
    notes || null
  ]);
  return result[0];
};

export const updateConnection = async (id, userId, data) => {
  const { name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes } = data;
  const sql = `
    UPDATE connections
    SET name = COALESCE($1, name),
        role = COALESCE($2, role),
        contact_details = COALESCE($3, contact_details),
        portfolio_url = COALESCE($4, portfolio_url),
        location_or_company = COALESCE($5, location_or_company),
        last_contacted_date = COALESCE($6, last_contacted_date),
        notes = COALESCE($7, notes),
        updated_at = NOW()
    WHERE id = $8 AND user_id = $9
    RETURNING id, user_id, name, role, contact_details, portfolio_url, location_or_company, last_contacted_date, notes, created_at, updated_at
  `;
  const result = await executeWithParameters(sql, [
    name,
    role,
    contact_details,
    portfolio_url,
    location_or_company,
    last_contacted_date,
    notes,
    id,
    userId
  ]);
  return result[0] || null;
};

export const deleteConnection = async (id, userId) => {
  const sql = `DELETE FROM connections WHERE id = $1 AND user_id = $2`;
  await executeWithParameters(sql, [id, userId]);
  return true;
};

export default {
  getConnectionsByUserId,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
};
