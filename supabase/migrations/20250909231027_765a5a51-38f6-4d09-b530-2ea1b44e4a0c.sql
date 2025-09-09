-- Insert dummy user accounts (these would normally be created through auth.signUp)
-- Note: In production, users would sign up through the app

-- Insert dummy events
INSERT INTO public.events (
  organizer_id, 
  title, 
  description, 
  date, 
  time, 
  location, 
  price, 
  capacity, 
  category, 
  featured, 
  status
) VALUES 
-- Tech Innovation Summit 2024
('00000000-0000-0000-0000-000000000001'::uuid, 
 'Tech Innovation Summit 2024',
 'Join industry leaders for cutting-edge discussions on AI, blockchain, and the future of technology.',
 '2024-03-15',
 '09:00:00',
 'San Francisco, CA',
 199.00,
 300,
 'Technology',
 true,
 'published'),

-- Mountain Hiking Adventure
('00000000-0000-0000-0000-000000000002'::uuid, 
 'Mountain Hiking Adventure',
 'Experience breathtaking views and challenge yourself on this guided mountain hiking expedition.',
 '2024-04-02',
 '06:00:00',
 'Colorado Springs, CO',
 89.00,
 100,
 'Outdoor',
 false,
 'published'),

-- UX Design Workshop
('00000000-0000-0000-0000-000000000001'::uuid, 
 'UX Design Workshop',
 'Learn the latest UX design principles and hands-on techniques from industry experts.',
 '2024-02-28',
 '10:00:00',
 'Austin, TX',
 149.00,
 150,
 'Design',
 false,
 'published'),

-- Startup Networking Mixer
('00000000-0000-0000-0000-000000000003'::uuid, 
 'Startup Networking Mixer',
 'Connect with fellow entrepreneurs, investors, and innovators in the startup ecosystem.',
 '2024-03-20',
 '18:00:00',
 'New York, NY',
 0.00,
 200,
 'Business',
 true,
 'published'),

-- Data Science Bootcamp
('00000000-0000-0000-0000-000000000001'::uuid, 
 'Data Science Bootcamp',
 'Intensive 2-day workshop covering machine learning, data visualization, and analytics.',
 '2024-05-10',
 '09:00:00',
 'Seattle, WA',
 299.00,
 50,
 'Technology',
 false,
 'published'),

-- Creative Writing Retreat
('00000000-0000-0000-0000-000000000002'::uuid, 
 'Creative Writing Retreat',
 'A weekend getaway focused on developing your creative writing skills in a peaceful setting.',
 '2024-04-20',
 '14:00:00',
 'Portland, OR',
 179.00,
 25,
 'Education',
 false,
 'published');

-- Insert dummy event registrations (simulating user registrations)
-- Note: These would normally be created when users register for events
INSERT INTO public.event_registrations (
  event_id,
  user_id,
  ticket_number,
  status
) VALUES 
-- Registrations for Tech Innovation Summit
((SELECT id FROM public.events WHERE title = 'Tech Innovation Summit 2024'),
 '00000000-0000-0000-0000-000000000004'::uuid,
 'TIS24-001234',
 'confirmed'),

-- Registrations for Mountain Hiking Adventure
((SELECT id FROM public.events WHERE title = 'Mountain Hiking Adventure'),
 '00000000-0000-0000-0000-000000000004'::uuid,
 'MHA24-005678',
 'confirmed'),

-- More registrations to simulate realistic numbers
((SELECT id FROM public.events WHERE title = 'UX Design Workshop'),
 '00000000-0000-0000-0000-000000000005'::uuid,
 'UXW24-009876',
 'confirmed'),

((SELECT id FROM public.events WHERE title = 'Startup Networking Mixer'),
 '00000000-0000-0000-0000-000000000004'::uuid,
 'SNM24-013579',
 'confirmed');