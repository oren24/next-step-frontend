-- NextStep Backend - Initial Schema (MySQL)
-- This migration creates all required tables for the job application tracker

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create companies table (4NF normalization)
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  logo VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tags table (lookup table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company_id INT NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_url VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'applied' CHECK (status IN ('wishlist', 'applied', 'interviewing', 'offer', 'rejected')),
  description TEXT,
  applied_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT
);

-- Create application_statuses table (status history)
CREATE TABLE IF NOT EXISTS application_statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('wishlist', 'applied', 'interviewing', 'offer', 'rejected')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

-- Create application_tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS application_tags (
  application_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (application_id, tag_id),
  FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_applications_company_id ON job_applications(company_id);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_statuses_application_id ON application_statuses(application_id);
CREATE INDEX idx_notes_application_id ON notes(application_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_application_tags_tag_id ON application_tags(tag_id);
