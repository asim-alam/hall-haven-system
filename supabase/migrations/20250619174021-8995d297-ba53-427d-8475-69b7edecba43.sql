
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  year_of_study INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_relationship TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_email TEXT NOT NULL,
  application_status TEXT NOT NULL DEFAULT 'SUBMITTED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buildings table
CREATE TABLE public.buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  total_floors INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  floor INTEGER NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  monthly_fee DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(building_id, room_number)
);

-- Create room assignments table
CREATE TABLE public.room_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_in_date TIMESTAMP WITH TIME ZONE,
  check_out_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(student_id, room_id)
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  preferred_room_type TEXT NOT NULL,
  preferred_building_id UUID REFERENCES public.buildings(id),
  application_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  priority INTEGER NOT NULL DEFAULT 50,
  admin_comments TEXT,
  documents TEXT[] NOT NULL DEFAULT '{}'
);

-- Create maintenance requests table
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_to TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  late_fee DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow all operations on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on buildings" ON public.buildings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on room_assignments" ON public.room_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on maintenance_requests" ON public.maintenance_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);

-- Insert buildings
INSERT INTO public.buildings (name, address, total_floors) VALUES 
('North Hall', '123 University Ave', 5),
('South Residence', '456 Campus Dr', 4),
('East Tower', '789 College St', 8),
('West Wing', '321 Campus Blvd', 6);

-- Insert rooms for each building
DO $$
DECLARE
    building_record RECORD;
    floor_num INTEGER;
    room_num INTEGER;
    room_number TEXT;
    room_types TEXT[] := ARRAY['SINGLE', 'DOUBLE', 'SPECIAL_NEEDS'];
    random_type TEXT;
BEGIN
    FOR building_record IN SELECT id, total_floors FROM public.buildings LOOP
        FOR floor_num IN 1..building_record.total_floors LOOP
            FOR room_num IN 1..10 LOOP
                room_number := floor_num || LPAD(room_num::TEXT, 2, '0');
                random_type := room_types[1 + (RANDOM() * 2)::INTEGER];
                
                INSERT INTO public.rooms (
                    building_id, 
                    room_number, 
                    floor, 
                    type, 
                    capacity, 
                    amenities, 
                    monthly_fee, 
                    status
                ) VALUES (
                    building_record.id,
                    room_number,
                    floor_num,
                    random_type,
                    CASE WHEN random_type = 'SINGLE' THEN 1 ELSE 2 END,
                    ARRAY['WiFi', 'Desk', 'Wardrobe', 'Bed'],
                    CASE 
                        WHEN random_type = 'SINGLE' THEN 800.00
                        WHEN random_type = 'DOUBLE' THEN 600.00
                        ELSE 900.00
                    END,
                    CASE WHEN RANDOM() > 0.3 THEN 'AVAILABLE' ELSE 'OCCUPIED' END
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- Insert 100 students
DO $$
DECLARE
    i INTEGER;
    departments TEXT[] := ARRAY['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Business', 'Psychology', 'English', 'History'];
    statuses TEXT[] := ARRAY['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED'];
    student_id_val TEXT;
    dept TEXT;
    status_val TEXT;
BEGIN
    FOR i IN 1..100 LOOP
        student_id_val := 'STU2024' || LPAD(i::TEXT, 3, '0');
        dept := departments[1 + (RANDOM() * (array_length(departments, 1) - 1))::INTEGER];
        status_val := statuses[1 + (RANDOM() * (array_length(statuses, 1) - 1))::INTEGER];
        
        INSERT INTO public.students (
            email,
            first_name,
            last_name,
            student_id,
            department,
            year_of_study,
            phone_number,
            emergency_contact_name,
            emergency_contact_relationship,
            emergency_contact_phone,
            emergency_contact_email,
            application_status
        ) VALUES (
            'student' || i || '@gmail.com',
            'Student',
            'Number' || i,
            student_id_val,
            dept,
            1 + (RANDOM() * 4)::INTEGER,
            '+1-555-' || LPAD((1000 + i)::TEXT, 4, '0'),
            'Parent' || i,
            CASE WHEN i % 2 = 0 THEN 'Mother' ELSE 'Father' END,
            '+1-555-' || LPAD((2000 + i)::TEXT, 4, '0'),
            'parent' || i || '@email.com',
            status_val
        );
    END LOOP;
END $$;

-- Auto-assign rooms to 60% of approved students
DO $$
DECLARE
    student_record RECORD;
    available_room_record RECORD;
    assignment_count INTEGER := 0;
    max_assignments INTEGER := 60;
BEGIN
    FOR student_record IN 
        SELECT id FROM public.students 
        WHERE application_status = 'APPROVED' 
        ORDER BY RANDOM() 
        LIMIT max_assignments
    LOOP
        SELECT id INTO available_room_record 
        FROM public.rooms 
        WHERE status = 'AVAILABLE' 
        ORDER BY RANDOM() 
        LIMIT 1;
        
        IF available_room_record.id IS NOT NULL THEN
            INSERT INTO public.room_assignments (student_id, room_id, check_in_date)
            VALUES (student_record.id, available_room_record.id, now());
            
            UPDATE public.rooms 
            SET status = 'OCCUPIED' 
            WHERE id = available_room_record.id;
            
            assignment_count := assignment_count + 1;
        END IF;
    END LOOP;
END $$;

-- Create applications for students
INSERT INTO public.applications (student_id, preferred_room_type, preferred_building_id, status, priority)
SELECT 
    s.id,
    CASE WHEN RANDOM() < 0.4 THEN 'SINGLE' WHEN RANDOM() < 0.8 THEN 'DOUBLE' ELSE 'SPECIAL_NEEDS' END,
    (SELECT id FROM public.buildings ORDER BY RANDOM() LIMIT 1),
    s.application_status,
    (50 + (RANDOM() * 50)::INTEGER)
FROM public.students s;

-- Create some maintenance requests
INSERT INTO public.maintenance_requests (room_id, student_id, category, description, priority, status)
SELECT 
    ra.room_id,
    ra.student_id,
    CASE 
        WHEN RANDOM() < 0.2 THEN 'ELECTRICAL'
        WHEN RANDOM() < 0.4 THEN 'PLUMBING'
        WHEN RANDOM() < 0.6 THEN 'FURNITURE'
        WHEN RANDOM() < 0.8 THEN 'CLEANING'
        ELSE 'OTHER'
    END,
    'Sample maintenance request description',
    CASE 
        WHEN RANDOM() < 0.1 THEN 'URGENT'
        WHEN RANDOM() < 0.3 THEN 'HIGH'
        WHEN RANDOM() < 0.7 THEN 'MEDIUM'
        ELSE 'LOW'
    END,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'SUBMITTED'
        WHEN RANDOM() < 0.6 THEN 'ASSIGNED'
        WHEN RANDOM() < 0.8 THEN 'IN_PROGRESS'
        ELSE 'COMPLETED'
    END
FROM public.room_assignments ra
WHERE RANDOM() < 0.3;

-- Create invoices for assigned students
INSERT INTO public.invoices (student_id, room_id, amount, due_date, status)
SELECT 
    ra.student_id,
    ra.room_id,
    r.monthly_fee,
    now() + INTERVAL '30 days',
    CASE WHEN RANDOM() < 0.7 THEN 'PENDING' ELSE 'PAID' END
FROM public.room_assignments ra
JOIN public.rooms r ON ra.room_id = r.id
WHERE ra.is_active = true;
