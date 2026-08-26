-- SQL to add status column to capstone_projects table for TopicReviewScreen
-- Execute this in your Supabase SQL editor

ALTER TABLE capstone_projects
ADD COLUMN status TEXT DEFAULT 'pending';

-- Optional: Add index for better query performance on status filtering
CREATE INDEX idx_capstone_projects_status ON capstone_projects(status);