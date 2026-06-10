-- NextStep Backend - PostgreSQL schema and seed data (normalized to 4NF with tags M2M)
-- Recreates the current database tables, relationships, and sample records.

BEGIN;

DROP TABLE IF EXISTS application_tags CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS application_statuses CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure enum type exists for statuses (used by tables below)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('wishlist','applied','interviewing','offer','rejected');
  END IF;
END$$;

-- Companies table (4NF normalization - extracted from job_applications)
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  logo VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table (lookup table for many-to-many relationship)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  job_title VARCHAR(255) NOT NULL,
  job_url VARCHAR(500),
  status application_status NOT NULL DEFAULT 'applied',
  description TEXT,
  applied_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE application_statuses (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  status application_status NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application tags junction table (many-to-many relationship)
CREATE TABLE application_tags (
  application_id INTEGER NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (application_id, tag_id)
);

CREATE INDEX idx_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_applications_company_id ON job_applications(company_id);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_statuses_application_id ON application_statuses(application_id);
CREATE INDEX idx_notes_application_id ON notes(application_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_application_tags_tag_id ON application_tags(tag_id);

INSERT INTO users (id, email, password_hash, name, profile_picture, bio, created_at, updated_at)
VALUES
  (
    1,
    'demo@nextstep.local',
    'replace-with-a-postgres-compatible-password-hash',
    'Nextstep Demo User',
    NULL,
    'Seed user for local development and database testing.',
    '2026-03-22T00:00:00.000Z',
    '2026-03-22T00:00:00.000Z'
  );

-- Insert companies (extracted and deduplicated)
INSERT INTO companies (id, name, logo, created_at)
VALUES
  (1, 'TechNova', 'https://via.placeholder.com/150?text=TechNova', '2026-03-22T00:00:00.000Z'),
  (2, 'Google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png', '2026-03-22T00:00:00.000Z'),
  (3, 'Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', '2026-03-22T00:00:00.000Z'),
  (4, 'StartupX', NULL, '2026-03-22T00:00:00.000Z'),
  (5, 'Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', '2026-03-22T00:00:00.000Z'),
  (6, 'Intel', NULL, '2026-03-22T00:00:00.000Z'),
  (7, 'Nvidia', NULL, '2026-03-22T00:00:00.000Z'),
  (8, 'Monday.com', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monday.com-Logo.svg/2560px-Monday.com-Logo.svg.png', '2026-03-22T00:00:00.000Z'),
  (9, 'Oracle', NULL, '2026-03-22T00:00:00.000Z'),
  (10, 'Stripe', 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Stripe_logo%2C_revised_2016.svg', '2026-03-22T00:00:00.000Z'),
  (11, 'Spotify', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg', '2026-03-22T00:00:00.000Z'),
  (12, 'Airbnb', 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg', '2026-03-22T00:00:00.000Z'),
  (13, 'Dropbox', NULL, '2026-03-22T00:00:00.000Z'),
  (14, 'Lyft', NULL, '2026-03-22T00:00:00.000Z'),
  (15, 'Meta', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png', '2026-03-22T00:00:00.000Z'),
  (16, 'Uber', NULL, '2026-03-22T00:00:00.000Z'),
  (17, 'Apple', NULL, '2026-03-22T00:00:00.000Z'),
  (18, 'Wix', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Wix.com_website_logo.svg/2560px-Wix.com_website_logo.svg.png', '2026-03-22T00:00:00.000Z'),
  (19, 'Fiverr', NULL, '2026-03-22T00:00:00.000Z'),
  (20, 'Salesforce', NULL, '2026-03-22T00:00:00.000Z');

-- Insert job applications (cleaned, no duplicates)
INSERT INTO job_applications (
  id,
  user_id,
  company_id,
  job_title,
  job_url,
  status,
  description,
  applied_date,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, 'Frontend Developer', NULL, 'rejected', 'Nice company', '2025-01-05', '2025-01-01T10:00:00.000Z', '2025-01-20T10:00:00.000Z'),
  (2, 1, 2, 'Software Engineer', NULL, 'interviewing', NULL, '2025-02-02', '2025-02-01T09:00:00.000Z', '2025-02-10T12:00:00.000Z'),
  (4, 1, 3, 'Backend Developer', NULL, 'applied', NULL, '2025-02-20', '2025-02-20T10:00:00.000Z', '2025-02-20T10:00:00.000Z'),
  (5, 1, 4, 'Frontend Developer', NULL, 'wishlist', NULL, '2025-04-01', '2025-04-01T10:00:00.000Z', '2025-04-01T10:00:00.000Z'),
  (7, 1, 5, 'Cloud Engineer', NULL, 'offer', NULL, '2025-02-11', '2025-02-10T00:00:00.000Z', '2025-02-28T00:00:00.000Z'),
  (9, 1, 6, 'Embedded Engineer', NULL, 'interviewing', NULL, '2025-02-02', '2025-02-01T00:00:00.000Z', '2025-02-10T00:00:00.000Z'),
  (10, 1, 7, 'GPU Engineer', NULL, 'applied', NULL, '2025-03-01', '2025-03-01T00:00:00.000Z', '2025-03-01T00:00:00.000Z'),
  (11, 1, 8, 'Fullstack Developer', NULL, 'wishlist', NULL, '2025-04-02', '2025-04-02T00:00:00.000Z', '2025-04-02T00:00:00.000Z'),
  (13, 1, 9, 'Database Engineer', NULL, 'rejected', NULL, '2025-02-06', '2025-02-05T00:00:00.000Z', '2025-02-20T00:00:00.000Z'),
  (14, 1, 10, 'Backend Developer', NULL, 'interviewing', NULL, '2025-03-02', '2025-03-01T00:00:00.000Z', '2025-03-10T00:00:00.000Z'),
  (15, 1, 11, 'Data Engineer', NULL, 'applied', NULL, '2025-02-01', '2025-02-01T00:00:00.000Z', '2025-02-01T00:00:00.000Z'),
  (16, 1, 12, 'Frontend Engineer', NULL, 'wishlist', NULL, '2025-04-03', '2025-04-03T00:00:00.000Z', '2025-04-03T00:00:00.000Z'),
  (17, 1, 13, 'Fullstack Engineer', NULL, 'interviewing', NULL, '2025-01-16', '2025-01-15T00:00:00.000Z', '2025-01-25T00:00:00.000Z'),
  (18, 1, 14, 'Mobile Developer', NULL, 'rejected', NULL, '2025-03-06', '2025-03-05T00:00:00.000Z', '2025-03-15T00:00:00.000Z'),
  (30, 1, 15, 'Fullstack Developer', NULL, 'offer', NULL, '2025-03-02', '2025-03-01T08:00:00.000Z', '2025-03-15T08:00:00.000Z'),
  (52, 1, 16, 'Backend Engineer', NULL, 'offer', NULL, '2025-02-11', '2025-02-10T00:00:00.000Z', '2025-02-20T00:00:00.000Z'),
  (60, 1, 17, 'iOS Developer', NULL, 'interviewing', NULL, '2025-01-13', '2025-01-12T00:00:00.000Z', '2025-01-18T00:00:00.000Z'),
  (85, 1, 18, 'Frontend Engineer', NULL, 'rejected', NULL, '2025-01-06', '2025-01-05T00:00:00.000Z', '2025-01-25T00:00:00.000Z'),
  (87, 1, 19, 'Frontend Developer', NULL, 'applied', NULL, '2025-04-01', '2025-04-01T00:00:00.000Z', '2025-04-01T00:00:00.000Z'),
  (122, 1, 20, 'Backend Engineer', NULL, 'offer', NULL, '2025-01-11', '2025-01-10T00:00:00.000Z', '2025-01-30T00:00:00.000Z');

INSERT INTO application_statuses (application_id, status, timestamp)
VALUES
  (1, 'rejected', '2025-01-20T10:00:00.000Z'),
  (2, 'interviewing', '2025-02-10T12:00:00.000Z'),
  (4, 'applied', '2025-02-20T10:00:00.000Z'),
  (5, 'wishlist', '2025-04-01T10:00:00.000Z'),
  (7, 'offer', '2025-02-28T00:00:00.000Z'),
  (9, 'interviewing', '2025-02-10T00:00:00.000Z'),
  (10, 'applied', '2025-03-01T00:00:00.000Z'),
  (11, 'wishlist', '2025-04-02T00:00:00.000Z'),
  (13, 'rejected', '2025-02-20T00:00:00.000Z'),
  (14, 'interviewing', '2025-03-10T00:00:00.000Z'),
  (15, 'applied', '2025-02-01T00:00:00.000Z'),
  (16, 'wishlist', '2025-04-03T00:00:00.000Z'),
  (17, 'interviewing', '2025-01-25T00:00:00.000Z'),
  (18, 'rejected', '2025-03-15T00:00:00.000Z'),
  (30, 'offer', '2025-03-15T08:00:00.000Z'),
  (52, 'offer', '2025-02-20T00:00:00.000Z'),
  (60, 'interviewing', '2025-01-18T00:00:00.000Z'),
  (85, 'rejected', '2025-01-25T00:00:00.000Z'),
  (87, 'applied', '2025-04-01T00:00:00.000Z'),
  (122, 'offer', '2025-01-30T00:00:00.000Z');

INSERT INTO notes (application_id, content, created_at)
VALUES
  (1, 'Nice company', '2025-01-20T10:00:00.000Z');

-- Insert tags
INSERT INTO tags (id, name, created_at)
VALUES
  (1, 'Fullstack', '2026-03-22T00:00:00.000Z'),
  (2, 'Frontend', '2026-03-22T00:00:00.000Z'),
  (3, 'Backend', '2026-03-22T00:00:00.000Z'),
  (4, 'Junior', '2026-03-22T00:00:00.000Z'),
  (5, 'Mid-Level', '2026-03-22T00:00:00.000Z'),
  (6, 'Senior', '2026-03-22T00:00:00.000Z'),
  (7, 'React', '2026-03-22T00:00:00.000Z'),
  (8, 'Node.js', '2026-03-22T00:00:00.000Z'),
  (9, 'Startup', '2026-03-22T00:00:00.000Z'),
  (10, 'Corporate', '2026-03-22T00:00:00.000Z'),
  (11, 'Remote', '2026-03-22T00:00:00.000Z'),
  (12, 'On-site', '2026-03-22T00:00:00.000Z'),
  (13, 'Hybrid', '2026-03-22T00:00:00.000Z');

-- Insert application_tags (many-to-many relationships)
INSERT INTO application_tags (application_id, tag_id)
VALUES
  (1, 2), (1, 7), (1, 5), (1, 10),
  (2, 1), (2, 7), (2, 8), (2, 6), (2, 10),
  (4, 3), (4, 8), (4, 5), (4, 10),
  (5, 2), (5, 7), (5, 4), (5, 9), (5, 11),
  (7, 3), (7, 8), (7, 6), (7, 10),
  (9, 3), (9, 5), (9, 10), (9, 12),
  (10, 3), (10, 5), (10, 10), (10, 11),
  (11, 1), (11, 7), (11, 8), (11, 4), (11, 9), (11, 11),
  (13, 3), (13, 6), (13, 10), (13, 12),
  (14, 3), (14, 8), (14, 5), (14, 10),
  (15, 3), (15, 5), (15, 10), (15, 11),
  (16, 2), (16, 7), (16, 5), (16, 10),
  (17, 1), (17, 7), (17, 8), (17, 5), (17, 10),
  (18, 4), (18, 5), (18, 11),
  (30, 1), (30, 7), (30, 8), (30, 6), (30, 10),
  (52, 3), (52, 8), (52, 6), (52, 10),
  (60, 2), (60, 6), (60, 10),
  (85, 2), (85, 7), (85, 5), (85, 10),
  (87, 2), (87, 7), (87, 4), (87, 9), (87, 11),
  (122, 3), (122, 8), (122, 6), (122, 10), (122, 12);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('companies', 'id'), (SELECT MAX(id) FROM companies));
SELECT setval(pg_get_serial_sequence('tags', 'id'), (SELECT MAX(id) FROM tags));
SELECT setval(pg_get_serial_sequence('job_applications', 'id'), (SELECT MAX(id) FROM job_applications));
SELECT setval(pg_get_serial_sequence('application_statuses', 'id'), (SELECT MAX(id) FROM application_statuses));
SELECT setval(pg_get_serial_sequence('notes', 'id'), (SELECT MAX(id) FROM notes));

COMMIT;
