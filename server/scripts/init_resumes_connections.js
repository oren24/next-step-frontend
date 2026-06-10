import { executeRaw } from '../src/config/database.js';

const run = async () => {
  try {
    console.log('Creating resumes and connections tables...');
    
    await executeRaw(`
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        target_role VARCHAR(255),
        file_path VARCHAR(255),
        original_filename VARCHAR(255),
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add columns if they don't exist (for existing tables)
    await executeRaw(`
      ALTER TABLE resumes 
      ADD COLUMN IF NOT EXISTS file_path VARCHAR(255),
      ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
    `).catch(err => console.log('ALTER TABLE skipped/failed:', err.message));

    await executeRaw(`
      CREATE TABLE IF NOT EXISTS connections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        contact_details VARCHAR(255),
        portfolio_url VARCHAR(255),
        location_or_company VARCHAR(255),
        last_contacted_date DATE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

run();
