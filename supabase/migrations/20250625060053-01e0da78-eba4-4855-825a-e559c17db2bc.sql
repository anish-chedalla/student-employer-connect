
-- Update the existing admin user's password
UPDATE auth.users 
SET 
  encrypted_password = crypt('SchoolConnect2024!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'admin@schoolconnect.edu';

-- Ensure the profile exists with correct role
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  u.id,
  'admin@schoolconnect.edu',
  'School Administrator', 
  'admin'
FROM auth.users u
WHERE u.email = 'admin@schoolconnect.edu'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'School Administrator',
  role = 'admin',
  updated_at = NOW();
