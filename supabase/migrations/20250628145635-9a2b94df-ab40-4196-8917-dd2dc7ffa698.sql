
-- First, let's create demo user accounts in auth.users and corresponding profiles
-- Note: In a real Supabase environment, users would sign up normally, but for demo purposes we'll create them

-- Insert demo users into the profiles table (they'll need to sign up through the UI first)
-- But let's also make sure we have some student records that can be used

-- Update existing students to have proper passwords and make them accessible
-- First, let's make sure we have some basic student data that matches our demo accounts

INSERT INTO students (
  email, first_name, last_name, student_id, department, year_of_study,
  phone_number, emergency_contact_name, emergency_contact_relationship,
  emergency_contact_phone, emergency_contact_email, application_status
) VALUES 
(
  'student@university.edu', 'Alice', 'Student', 'STU001', 'Computer Science', 2,
  '+1-555-0101', 'John Student', 'Father', '+1-555-0102', 'john.student@email.com', 'APPROVED'
),
(
  'student1@gmail.com', 'Bob', 'Wilson', 'STU002', 'Engineering', 3,
  '+1-555-0201', 'Mary Wilson', 'Mother', '+1-555-0202', 'mary.wilson@email.com', 'UNDER_REVIEW'
)
ON CONFLICT (email) DO NOTHING;

-- Insert a few more sample students for testing
INSERT INTO students (
  email, first_name, last_name, student_id, department, year_of_study,
  phone_number, emergency_contact_name, emergency_contact_relationship,
  emergency_contact_phone, emergency_contact_email, application_status
) VALUES 
(
  'john.doe@university.edu', 'John', 'Doe', 'STU003', 'Mathematics', 1,
  '+1-555-0301', 'Jane Doe', 'Mother', '+1-555-0302', 'jane.doe@email.com', 'SUBMITTED'
),
(
  'sarah.johnson@university.edu', 'Sarah', 'Johnson', 'STU004', 'Physics', 4,
  '+1-555-0401', 'Robert Johnson', 'Father', '+1-555-0402', 'robert.johnson@email.com', 'APPROVED'
),
(
  'mike.brown@university.edu', 'Mike', 'Brown', 'STU005', 'Chemistry', 2,
  '+1-555-0501', 'Lisa Brown', 'Mother', '+1-555-0502', 'lisa.brown@email.com', 'WAITLISTED'
)
ON CONFLICT (email) DO NOTHING;
