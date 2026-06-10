import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  ...(process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required by Render and many cloud providers
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'nextstep_db',
      }),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a parameterized query to prevent SQL injection
 * @param {string} sql - SQL query string with $1, $2, etc. placeholders
 * @param {Array} parameters - Values to bind to the query
 * @returns {Promise<Array>} Query results
 */
export const executeWithParameters = async (sql, parameters = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, parameters);
    return result.rows;
  } finally {
    client.release();
  }
};

/**
 * Execute a raw query (use with caution)
 * @param {string} sql - SQL query string
 * @returns {Promise<Array>} Query results
 */
export const executeRaw = async (sql) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql);
    return result.rows;
  } finally {
    client.release();
  }
};

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return !!result.rows[0];
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

export default { executeWithParameters, executeRaw, testConnection };
