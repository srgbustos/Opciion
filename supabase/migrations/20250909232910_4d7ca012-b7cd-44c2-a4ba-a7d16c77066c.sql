-- Temporarily drop the foreign key constraint to insert dummy data
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organizer_id_fkey;

-- Create 6 diverse outdoor events with dummy organizer IDs
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
    '00000000-0000-0000-0000-000000000001',
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
    '00000000-0000-0000-0000-000000000002',
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
    '00000000-0000-0000-0000-000000000003',
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
    '00000000-0000-0000-0000-000000000004',
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
    '00000000-0000-0000-0000-000000000005',
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
    '00000000-0000-0000-0000-000000000006',
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