import connectionDal from '../dal/connectionsDal.js';
import { NotFoundError } from '../utils/errorHandler.js';

export const getConnections = async (userId) => {
  return connectionDal.getConnectionsByUserId(userId);
};

export const getConnectionById = async (id, userId) => {
  const connection = await connectionDal.getConnectionById(id, userId);
  if (!connection) {
    throw new NotFoundError('Connection not found');
  }
  return connection;
};

export const createConnection = async (userId, data) => {
  return connectionDal.createConnection(userId, data);
};

export const updateConnection = async (id, userId, data) => {
  // Check if exists
  await getConnectionById(id, userId);
  return connectionDal.updateConnection(id, userId, data);
};

export const deleteConnection = async (id, userId) => {
  // Check if exists
  await getConnectionById(id, userId);
  return connectionDal.deleteConnection(id, userId);
};

export default {
  getConnections,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
};
