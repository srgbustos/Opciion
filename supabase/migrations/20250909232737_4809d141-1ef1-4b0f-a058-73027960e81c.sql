-- First, create some dummy organizer profiles
INSERT INTO public.profiles (user_id, display_name, role, bio) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Adventure Seekers Co', 'organizer', 'We organize thrilling outdoor adventures for all skill levels'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Nature Connect Events', 'organizer', 'Bringing people closer to nature through meaningful experiences'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Outdoor Fitness Hub', 'organizer', 'Fitness meets the great outdoors'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Community Garden Alliance', 'organizer', 'Building stronger communities through shared outdoor activities'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Trail Blazers Society', 'organizer', 'Expert guides for hiking and nature exploration'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Urban Green Spaces', 'organizer', 'Making cities greener one event at a time');

-- Create 6 diverse outdoor events
INSERT INTO public.events (
  organizer_id, 
  title, 
  description, 
  category, 
  date, 
  time, 
  location, 
  capacity, 
  price, 
  currency, 
  status,
  featured
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Mountain Hiking Adventure',
    'Join us for a breathtaking 8-mile hike through the scenic Blue Ridge Mountains. Experience stunning views, wildlife spotting, and connect with fellow nature enthusiasts. All skill levels welcome with guided support.',
    'Adventure',
    '2025-02-15',
    '08:00:00',
    'Blue Ridge Parkway, Asheville, NC',
    25,
    35.00,
    'USD',
    'published',
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Free Community Nature Walk',
    'A peaceful guided walk through our local nature preserve. Perfect for families and beginners. Learn about local flora and fauna while enjoying the fresh air. Bring your camera for beautiful photo opportunities!',
    'Nature',
    '2025-02-08',
    '10:00:00',
    'Riverside Nature Preserve, Portland, OR',
    40,
    0.00,
    'USD',
    'published',
    false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Outdoor Bootcamp Training',
    'High-intensity outdoor fitness session in the park. Get your heart pumping with bodyweight exercises, obstacle courses, and team challenges. Suitable for intermediate to advanced fitness levels.',
    'Fitness',
    '2025-02-12',
    '07:00:00',
    'Central Park, New York, NY',
    20,
    25.00,
    'USD',
    'published',
    false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'Community Garden Volunteer Day',
    'Help us maintain and beautify our community garden! Free event where we plant seasonal vegetables, weed flower beds, and share gardening tips. Light refreshments provided. All ages welcome.',
    'Community',
    '2025-02-10',
    '09:00:00',
    'Sunshine Community Garden, Austin, TX',
    50,
    0.00,
    'USD',
    'published',
    false
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    'Sunset Photography Workshop',
    'Capture the perfect golden hour shots in this hands-on photography workshop. Professional photographer will guide you through composition, lighting, and camera settings. Equipment available for rent.',
    'Photography',
    '2025-02-18',
    '17:30:00',
    'Lighthouse Point, San Francisco, CA',
    15,
    75.00,
    'USD',
    'published',
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440006',
    'Urban Tree Planting Initiative',
    'Join our city beautification effort! Help plant native trees in designated urban areas. Free event with tools and refreshments provided. Make a lasting impact on your community while meeting like-minded individuals.',
    'Environment',
    '2025-02-22',
    '08:30:00',
    'Riverside Park, Chicago, IL',
    60,
    0.00,
    'USD',
    'published',
    false
  );