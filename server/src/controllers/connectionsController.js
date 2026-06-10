import connectionService from '../services/connectionService.js';

export const getConnections = async (req, res) => {
  const userId = req.userId;
  const connections = await connectionService.getConnections(userId);
  res.json({
    success: true,
    data: connections,
  });
};

export const getConnectionById = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const connection = await connectionService.getConnectionById(id, userId);
  res.json({
    success: true,
    data: connection,
  });
};

export const createConnection = async (req, res) => {
  const userId = req.userId;
  const data = req.body;
  const newConnection = await connectionService.createConnection(userId, data);
  res.status(201).json({
    success: true,
    data: newConnection,
  });
};

export const updateConnection = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const data = req.body;
  const updatedConnection = await connectionService.updateConnection(id, userId, data);
  res.json({
    success: true,
    data: updatedConnection,
  });
};

export const deleteConnection = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  await connectionService.deleteConnection(id, userId);
  res.json({
    success: true,
    message: 'Connection deleted successfully',
  });
};

export default {
  getConnections,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
};
