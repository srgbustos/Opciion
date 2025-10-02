/*
  # Seed Mock Events

  Creates 3 mock events with realistic data:
  1. React & TypeScript Workshop (FREE) - November 15, 2025
  2. Future of Business 2025 Conference (PAID) - November 28, 2025
  3. Winter City Marathon 2025 (PAID) - December 14, 2025

  Each event includes FAQs and ticket types.
*/

-- First, create a test organizer user if not exists
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Try to find an existing user
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- If no user exists, you'll need to create one through the Supabase dashboard
  -- or the authentication UI. For now, we'll use a placeholder UUID
  -- Replace this with a real user ID from your auth.users table
  IF v_user_id IS NULL THEN
    -- Use a placeholder - you must replace this with a real user ID
    v_user_id := gen_random_uuid();
    RAISE NOTICE 'No users found. You need to create a user first through sign up.';
    RAISE NOTICE 'After creating a user, replace the organizer_id values below with the real user ID.';
  ELSE
    RAISE NOTICE 'Using existing user ID: %', v_user_id;
  END IF;

  -- Store the user ID for use in the inserts
  CREATE TEMP TABLE IF NOT EXISTS temp_organizer (user_id uuid);
  DELETE FROM temp_organizer;
  INSERT INTO temp_organizer VALUES (v_user_id);
END $$;

-- EVENT 1: React & TypeScript Workshop (FREE)
INSERT INTO events (
  organizer_id,
  title,
  short_description,
  overview,
  location,
  start_date,
  end_date,
  primary_event_date,
  price,
  currency,
  capacity,
  category,
  featured,
  status,
  confirmation_message,
  confirmation_email,
  hashtags,
  date,
  time
) VALUES (
  (SELECT user_id FROM temp_organizer),
  'React & TypeScript Workshop',
  'Learn modern React development with TypeScript in this hands-on workshop. Perfect for developers looking to level up their skills.',
  '<h2>About This Workshop</h2><p>Join us for an intensive hands-on workshop covering React 18 and TypeScript best practices. This free event is designed for intermediate developers who want to master modern web development.</p><h3>What You''ll Learn:</h3><ul><li>React Hooks and component patterns</li><li>TypeScript type safety in React</li><li>State management with modern tools</li><li>Performance optimization techniques</li></ul><h3>Requirements:</h3><p>Bring your laptop with Node.js installed. Basic React knowledge recommended.</p>',
  'Tech Hub San Francisco, 123 Market Street, San Francisco, CA',
  '2025-11-15 09:00:00+00',
  '2025-11-15 17:00:00+00',
  '2025-11-15 09:00:00+00',
  0,
  'USD',
  50,
  'Technology',
  true,
  'published',
  'Thank you for registering! We look forward to seeing you at the React & TypeScript Workshop. Please arrive 15 minutes early for check-in.',
  '{"from": "events@opciion.com", "subject": "Workshop Registration Confirmed - React & TypeScript", "htmlBody": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\"><h2>Welcome to React & TypeScript Workshop!</h2><p>Hi {{attendee_name}},</p><p>Your registration is confirmed for <strong>{{event_title}}</strong>.</p><p><strong>Date:</strong> {{primary_event_date}}<br><strong>Location:</strong> {{location}}</p><p>Please bring your laptop with Node.js installed.</p><p>See you there!<br>The Opciion Team</p></div>"}',
  ARRAY['react', 'typescript', 'workshop', 'webdev'],
  '2025-11-15',
  '09:00'
)
RETURNING id AS event_id \gset event1_

-- FAQ for Event 1
INSERT INTO faq_items (event_id, question, answer, sort_order) VALUES
  (:'event1_id', 'Do I need to bring my laptop?', 'Yes, please bring your laptop with Node.js (v18+) installed. We will be doing hands-on coding exercises.', 0),
  (:'event1_id', 'What experience level is required?', 'This workshop is designed for developers with basic JavaScript and React knowledge. If you''ve built a simple React app before, you''re ready!', 1),
  (:'event1_id', 'Will lunch be provided?', 'Yes! Lunch and refreshments will be provided for all attendees.', 2),
  (:'event1_id', 'Is there parking available?', 'Yes, the venue has a parking garage. Parking is free for workshop attendees with validation.', 3);

-- Ticket for Event 1 (FREE)
INSERT INTO ticket_types (event_id, name, description, price, fee, quantity_per_order, is_active, sort_order) VALUES
  (:'event1_id', 'General Admission', 'Full access to the workshop, including materials, lunch, and refreshments.', 0, 0, 1, true, 0);

-- EVENT 2: Future of Business 2025 Conference (PAID)
INSERT INTO events (
  organizer_id,
  title,
  short_description,
  overview,
  location,
  start_date,
  end_date,
  primary_event_date,
  price,
  currency,
  capacity,
  category,
  featured,
  status,
  confirmation_message,
  confirmation_email,
  hashtags,
  date,
  time
) VALUES (
  (SELECT user_id FROM temp_organizer),
  'Future of Business 2025 Conference',
  'Join industry leaders for a full-day conference exploring innovation, AI, and the future of business. Network with 500+ professionals.',
  '<h2>Conference Overview</h2><p>The premier business conference bringing together entrepreneurs, executives, and innovators to discuss the rapidly evolving business landscape.</p><h3>Featured Speakers:</h3><ul><li>Sarah Chen - CEO of TechVentures</li><li>Marcus Johnson - AI Research Director</li><li>Dr. Emily Rodriguez - Business Strategy Expert</li></ul><h3>Schedule Highlights:</h3><p><strong>9:00 AM</strong> - Registration & Networking Breakfast<br><strong>10:00 AM</strong> - Keynote: AI in Business<br><strong>12:00 PM</strong> - Lunch & Networking<br><strong>2:00 PM</strong> - Panel Discussions<br><strong>5:00 PM</strong> - Closing Remarks & Reception</p><h3>Includes:</h3><ul><li>Full-day conference access</li><li>Breakfast and lunch</li><li>Conference materials</li><li>Networking reception</li><li>Certificate of attendance</li></ul>',
  'Grand Convention Center, 456 Convention Blvd, New York, NY',
  '2025-11-28 08:00:00+00',
  '2025-11-28 19:00:00+00',
  '2025-11-28 08:00:00+00',
  299.00,
  'USD',
  500,
  'Business',
  true,
  'published',
  'Your registration for Future of Business 2025 Conference is confirmed! Check your email for your ticket and conference details. We can''t wait to see you there!',
  '{"from": "events@opciion.com", "subject": "Conference Registration Confirmed - Future of Business 2025", "htmlBody": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #4F46E5; border-radius: 8px; padding: 20px;\"><h2 style=\"color: #4F46E5;\">Your Ticket is Confirmed!</h2><p>Hi {{attendee_name}},</p><p>You''re all set for <strong>{{event_title}}</strong>!</p><div style=\"background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;\"><p style=\"margin: 5px 0;\"><strong>Date:</strong> {{primary_event_date}}</p><p style=\"margin: 5px 0;\"><strong>Location:</strong> {{location}}</p><p style=\"margin: 5px 0;\"><strong>Ticket:</strong> {{ticket_name}}</p></div><p>Please arrive by 8:30 AM for registration. Business casual attire recommended.</p><p>Looking forward to seeing you!<br>The Conference Team</p></div>"}',
  ARRAY['business', 'conference', 'innovation', 'networking', 'AI'],
  '2025-11-28',
  '08:00'
)
RETURNING id AS event_id \gset event2_

-- FAQ for Event 2
INSERT INTO faq_items (event_id, question, answer, sort_order) VALUES
  (:'event2_id', 'What is the dress code?', 'Business casual is recommended. Most attendees wear business attire, but comfortable clothing is fine.', 0),
  (:'event2_id', 'Are meals included in the ticket price?', 'Yes! Your ticket includes breakfast, lunch, and access to the evening reception with hors d''oeuvres.', 1),
  (:'event2_id', 'Will sessions be recorded?', 'Yes, all main stage presentations will be recorded and shared with attendees within 48 hours.', 2),
  (:'event2_id', 'Can I get a refund if I can''t attend?', 'Full refunds are available up to 14 days before the event. After that, tickets can be transferred to another person.', 3),
  (:'event2_id', 'Is there a mobile app for the conference?', 'Yes! Download the conference app to view the schedule, connect with attendees, and access session materials.', 4);

-- Tickets for Event 2 (PAID - Multiple tiers)
INSERT INTO ticket_types (event_id, name, description, price, fee, quantity_per_order, is_active, sort_order) VALUES
  (:'event2_id', 'Early Bird Ticket', 'Full conference access including all sessions, meals, and networking events. Save $100 with early registration!', 299.00, 15.00, 1, true, 0),
  (:'event2_id', 'Standard Ticket', 'Full conference access including all sessions, meals, and networking events.', 399.00, 20.00, 1, true, 1),
  (:'event2_id', 'VIP Pass', 'Everything in Standard plus VIP seating, private speaker meet & greet, and premium swag bag.', 599.00, 30.00, 1, true, 2);

-- EVENT 3: Winter City Marathon 2025 (PAID)
INSERT INTO events (
  organizer_id,
  title,
  short_description,
  overview,
  location,
  start_date,
  end_date,
  primary_event_date,
  price,
  currency,
  capacity,
  category,
  featured,
  status,
  confirmation_message,
  confirmation_email,
  hashtags,
  date,
  time
) VALUES (
  (SELECT user_id FROM temp_organizer),
  'Winter City Marathon 2025',
  'Challenge yourself in our annual winter marathon! Multiple distance options available: Full Marathon (42K), Half Marathon (21K), and 10K Fun Run.',
  '<h2>About the Race</h2><p>Join hundreds of runners for our 5th annual Winter City Marathon! This scenic route takes you through the most beautiful parts of the city, with fully marked courses, aid stations every 2km, and enthusiastic crowd support.</p><h3>Race Categories:</h3><ul><li><strong>Full Marathon (42.195 km)</strong> - For experienced runners</li><li><strong>Half Marathon (21.1 km)</strong> - Perfect balance of challenge</li><li><strong>10K Fun Run</strong> - Great for beginners</li></ul><h3>What''s Included:</h3><ul><li>Official race bib and timing chip</li><li>Finisher medal</li><li>Technical race t-shirt</li><li>Post-race meal and refreshments</li><li>Digital race photos</li><li>Finisher certificate</li></ul><h3>Course Features:</h3><p>Fully certified course with chip timing, aid stations with water and energy drinks, medical support throughout, and cheering zones. The course is mostly flat with a few gentle hills.</p><h3>Start Times:</h3><p>Full Marathon: 7:00 AM<br>Half Marathon: 8:00 AM<br>10K Fun Run: 9:00 AM</p>',
  'City Central Park, Main Entrance, Chicago, IL',
  '2025-12-14 07:00:00+00',
  '2025-12-14 14:00:00+00',
  '2025-12-14 07:00:00+00',
  75.00,
  'USD',
  1000,
  'Outdoor',
  true,
  'published',
  'Congratulations! You are registered for the Winter City Marathon 2025. Start training and we''ll see you at the starting line! Kit pickup information will be sent 2 weeks before the race.',
  '{"from": "race@opciion.com", "subject": "Race Registration Confirmed - Winter City Marathon 2025", "htmlBody": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\"><div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;\"><h1 style=\"margin: 0;\">You''re In! 🏃‍♂️</h1></div><div style=\"padding: 20px; border: 1px solid #E5E7EB;\"><p>Hi {{attendee_name}},</p><p>Your registration for <strong>{{event_title}}</strong> is confirmed!</p><div style=\"background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;\"><p style=\"margin: 0;\"><strong>Race Category:</strong> {{ticket_name}}</p></div><p><strong>Race Date:</strong> {{primary_event_date}}<br><strong>Location:</strong> {{location}}</p><h3>Next Steps:</h3><ol><li>Start training for your distance</li><li>Watch for kit pickup details (2 weeks before race)</li><li>Arrive 30 minutes before your start time</li></ol><p>Good luck with your training!<br>The Race Team</p></div></div>"}',
  ARRAY['marathon', 'running', 'fitness', '10k', 'halfmarathon'],
  '2025-12-14',
  '07:00'
)
RETURNING id AS event_id \gset event3_

-- FAQ for Event 3
INSERT INTO faq_items (event_id, question, answer, sort_order) VALUES
  (:'event3_id', 'When and where is kit pickup?', 'Kit pickup is December 12-13 from 10 AM to 6 PM at the Race Expo Center (address will be sent via email). You must pick up your race packet before race day.', 0),
  (:'event3_id', 'What happens if it snows on race day?', 'The race will proceed in light snow. Only severe weather conditions (blizzard warnings) will cause cancellation. Check our website race morning for updates.', 1),
  (:'event3_id', 'Are there time limits for finishing?', 'Yes. Full Marathon: 6 hours, Half Marathon: 3.5 hours, 10K: 2 hours. Course support ends at these times.', 2),
  (:'event3_id', 'Can I switch my race distance after registering?', 'Yes, you can change your distance up to 7 days before the race. Contact us at race@opciion.com with your request.', 3),
  (:'event3_id', 'What if I have a medical condition?', 'Please note any medical conditions on your registration form. Medical support will be available throughout the course.', 4),
  (:'event3_id', 'Are there age restrictions?', 'Full Marathon: 18+, Half Marathon: 16+, 10K Fun Run: All ages welcome (under 14 must be accompanied by an adult).', 5);

-- Tickets for Event 3 (PAID - Multiple distances)
INSERT INTO ticket_types (event_id, name, description, price, fee, quantity_per_order, is_active, sort_order) VALUES
  (:'event3_id', 'Full Marathon (42K)', 'Complete 42.195 km marathon course. Includes: Race bib, timing chip, finisher medal, technical t-shirt, post-race meal, and digital photos.', 95.00, 5.00, 1, true, 0),
  (:'event3_id', 'Half Marathon (21K)', 'Complete 21.1 km half marathon course. Includes: Race bib, timing chip, finisher medal, technical t-shirt, post-race meal, and digital photos.', 75.00, 4.00, 1, true, 1),
  (:'event3_id', '10K Fun Run', 'Complete 10 km fun run course. Perfect for beginners! Includes: Race bib, timing chip, finisher medal, t-shirt, and post-race refreshments.', 45.00, 3.00, 1, true, 2);

-- Clean up temp table
DROP TABLE IF EXISTS temp_organizer;

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✅ Mock events seeded successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '  - 3 events created (1 free, 2 paid)';
  RAISE NOTICE '  - 15 FAQ items added';
  RAISE NOTICE '  - 7 ticket types added';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Events:';
  RAISE NOTICE '  1. React & TypeScript Workshop (FREE) - Nov 15, 2025';
  RAISE NOTICE '  2. Future of Business 2025 Conference (PAID) - Nov 28, 2025';
  RAISE NOTICE '  3. Winter City Marathon 2025 (PAID) - Dec 14, 2025';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: If you see "No users found" above, you need to:';
  RAISE NOTICE '    1. Sign up through your app at /auth';
  RAISE NOTICE '    2. Get your user ID from the profiles or auth.users table';
  RAISE NOTICE '    3. Update the organizer_id in this SQL file';
  RAISE NOTICE '    4. Run this script again';
END $$;
