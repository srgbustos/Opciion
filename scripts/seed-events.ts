import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedEvents() {
  console.log('🌱 Starting to seed events...');

  // First, create a test organizer user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'organizer@opciion.com',
    password: 'SecurePassword123!',
    options: {
      data: {
        display_name: 'Event Organizer'
      }
    }
  });

  if (authError && authError.message !== 'User already registered') {
    console.error('Error creating user:', authError);
    return;
  }

  const userId = authData?.user?.id;

  if (!userId) {
    // Try to sign in if user already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'organizer@opciion.com',
      password: 'SecurePassword123!'
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return;
    }

    console.log('✅ Signed in as existing user');
  } else {
    console.log('✅ Created new organizer user');
  }

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found');
    return;
  }

  console.log(`Using organizer ID: ${user.id}`);

  // Event 1: Free Tech Meetup (November 15, 2025)
  const event1 = {
    organizer_id: user.id,
    title: 'React & TypeScript Workshop',
    short_description: 'Learn modern React development with TypeScript in this hands-on workshop. Perfect for developers looking to level up their skills.',
    overview: '<h2>About This Workshop</h2><p>Join us for an intensive hands-on workshop covering React 18 and TypeScript best practices. This free event is designed for intermediate developers who want to master modern web development.</p><h3>What You\'ll Learn:</h3><ul><li>React Hooks and component patterns</li><li>TypeScript type safety in React</li><li>State management with modern tools</li><li>Performance optimization techniques</li></ul><h3>Requirements:</h3><p>Bring your laptop with Node.js installed. Basic React knowledge recommended.</p>',
    location: 'Tech Hub San Francisco, 123 Market Street, San Francisco, CA',
    start_date: '2025-11-15T09:00:00Z',
    end_date: '2025-11-15T17:00:00Z',
    primary_event_date: '2025-11-15T09:00:00Z',
    price: 0,
    currency: 'USD',
    capacity: 50,
    category: 'Technology',
    featured: true,
    status: 'published',
    confirmation_message: 'Thank you for registering! We look forward to seeing you at the React & TypeScript Workshop. Please arrive 15 minutes early for check-in.',
    confirmation_email: {
      from: 'events@opciion.com',
      subject: 'Workshop Registration Confirmed - React & TypeScript',
      htmlBody: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2>Welcome to React & TypeScript Workshop!</h2><p>Hi {{attendee_name}},</p><p>Your registration is confirmed for <strong>{{event_title}}</strong>.</p><p><strong>Date:</strong> {{primary_event_date}}<br><strong>Location:</strong> {{location}}</p><p>Please bring your laptop with Node.js installed.</p><p>See you there!<br>The Opciion Team</p></div>'
    },
    hashtags: ['react', 'typescript', 'workshop', 'webdev'],
    date: '2025-11-15',
    time: '09:00'
  };

  // Event 2: Paid Business Conference (November 28, 2025)
  const event2 = {
    organizer_id: user.id,
    title: 'Future of Business 2025 Conference',
    short_description: 'Join industry leaders for a full-day conference exploring innovation, AI, and the future of business. Network with 500+ professionals.',
    overview: '<h2>Conference Overview</h2><p>The premier business conference bringing together entrepreneurs, executives, and innovators to discuss the rapidly evolving business landscape.</p><h3>Featured Speakers:</h3><ul><li>Sarah Chen - CEO of TechVentures</li><li>Marcus Johnson - AI Research Director</li><li>Dr. Emily Rodriguez - Business Strategy Expert</li></ul><h3>Schedule Highlights:</h3><p><strong>9:00 AM</strong> - Registration & Networking Breakfast<br><strong>10:00 AM</strong> - Keynote: AI in Business<br><strong>12:00 PM</strong> - Lunch & Networking<br><strong>2:00 PM</strong> - Panel Discussions<br><strong>5:00 PM</strong> - Closing Remarks & Reception</p><h3>Includes:</h3><ul><li>Full-day conference access</li><li>Breakfast and lunch</li><li>Conference materials</li><li>Networking reception</li><li>Certificate of attendance</li></ul>',
    location: 'Grand Convention Center, 456 Convention Blvd, New York, NY',
    start_date: '2025-11-28T08:00:00Z',
    end_date: '2025-11-28T19:00:00Z',
    primary_event_date: '2025-11-28T08:00:00Z',
    price: 299.00,
    currency: 'USD',
    capacity: 500,
    category: 'Business',
    featured: true,
    status: 'published',
    confirmation_message: 'Your registration for Future of Business 2025 Conference is confirmed! Check your email for your ticket and conference details. We can\'t wait to see you there!',
    confirmation_email: {
      from: 'events@opciion.com',
      subject: 'Conference Registration Confirmed - Future of Business 2025',
      htmlBody: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #4F46E5; border-radius: 8px; padding: 20px;"><h2 style="color: #4F46E5;">Your Ticket is Confirmed!</h2><p>Hi {{attendee_name}},</p><p>You\'re all set for <strong>{{event_title}}</strong>!</p><div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;"><p style="margin: 5px 0;"><strong>Date:</strong> {{primary_event_date}}</p><p style="margin: 5px 0;"><strong>Location:</strong> {{location}}</p><p style="margin: 5px 0;"><strong>Ticket:</strong> {{ticket_name}}</p></div><p>Please arrive by 8:30 AM for registration. Business casual attire recommended.</p><p>Looking forward to seeing you!<br>The Conference Team</p></div>'
    },
    hashtags: ['business', 'conference', 'innovation', 'networking', 'AI'],
    date: '2025-11-28',
    time: '08:00'
  };

  // Event 3: Paid Marathon (December 14, 2025)
  const event3 = {
    organizer_id: user.id,
    title: 'Winter City Marathon 2025',
    short_description: 'Challenge yourself in our annual winter marathon! Multiple distance options available: Full Marathon (42K), Half Marathon (21K), and 10K Fun Run.',
    overview: '<h2>About the Race</h2><p>Join hundreds of runners for our 5th annual Winter City Marathon! This scenic route takes you through the most beautiful parts of the city, with fully marked courses, aid stations every 2km, and enthusiastic crowd support.</p><h3>Race Categories:</h3><ul><li><strong>Full Marathon (42.195 km)</strong> - For experienced runners</li><li><strong>Half Marathon (21.1 km)</strong> - Perfect balance of challenge</li><li><strong>10K Fun Run</strong> - Great for beginners</li></ul><h3>What\'s Included:</h3><ul><li>Official race bib and timing chip</li><li>Finisher medal</li><li>Technical race t-shirt</li><li>Post-race meal and refreshments</li><li>Digital race photos</li><li>Finisher certificate</li></ul><h3>Course Features:</h3><p>Fully certified course with chip timing, aid stations with water and energy drinks, medical support throughout, and cheering zones. The course is mostly flat with a few gentle hills.</p><h3>Start Times:</h3><p>Full Marathon: 7:00 AM<br>Half Marathon: 8:00 AM<br>10K Fun Run: 9:00 AM</p>',
    location: 'City Central Park, Main Entrance, Chicago, IL',
    start_date: '2025-12-14T07:00:00Z',
    end_date: '2025-12-14T14:00:00Z',
    primary_event_date: '2025-12-14T07:00:00Z',
    price: 75.00,
    currency: 'USD',
    capacity: 1000,
    category: 'Outdoor',
    featured: true,
    status: 'published',
    confirmation_message: 'Congratulations! You are registered for the Winter City Marathon 2025. Start training and we\'ll see you at the starting line! Kit pickup information will be sent 2 weeks before the race.',
    confirmation_email: {
      from: 'race@opciion.com',
      subject: 'Race Registration Confirmed - Winter City Marathon 2025',
      htmlBody: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0;"><h1 style="margin: 0;">You\'re In! 🏃‍♂️</h1></div><div style="padding: 20px; border: 1px solid #E5E7EB;"><p>Hi {{attendee_name}},</p><p>Your registration for <strong>{{event_title}}</strong> is confirmed!</p><div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;"><p style="margin: 0;"><strong>Race Category:</strong> {{ticket_name}}</p></div><p><strong>Race Date:</strong> {{primary_event_date}}<br><strong>Location:</strong> {{location}}</p><h3>Next Steps:</h3><ol><li>Start training for your distance</li><li>Watch for kit pickup details (2 weeks before race)</li><li>Arrive 30 minutes before your start time</li></ol><p><strong>Kit Pickup:</strong><br>{{kit_pickup_date}} at {{kit_pickup_location}}</p><p>Good luck with your training!<br>The Race Team</p></div></div>'
    },
    hashtags: ['marathon', 'running', 'fitness', '10k', 'halfmarathon'],
    date: '2025-12-14',
    time: '07:00'
  };

  // Insert Event 1
  console.log('\n📅 Creating Event 1: React & TypeScript Workshop...');
  const { data: e1, error: e1Error } = await supabase
    .from('events')
    .insert(event1)
    .select()
    .single();

  if (e1Error) {
    console.error('Error creating event 1:', e1Error);
  } else {
    console.log('✅ Event 1 created with ID:', e1.id);

    // Add FAQ for Event 1
    await supabase.from('faq_items').insert([
      {
        event_id: e1.id,
        question: 'Do I need to bring my laptop?',
        answer: 'Yes, please bring your laptop with Node.js (v18+) installed. We will be doing hands-on coding exercises.',
        sort_order: 0
      },
      {
        event_id: e1.id,
        question: 'What experience level is required?',
        answer: 'This workshop is designed for developers with basic JavaScript and React knowledge. If you\'ve built a simple React app before, you\'re ready!',
        sort_order: 1
      },
      {
        event_id: e1.id,
        question: 'Will lunch be provided?',
        answer: 'Yes! Lunch and refreshments will be provided for all attendees.',
        sort_order: 2
      },
      {
        event_id: e1.id,
        question: 'Is there parking available?',
        answer: 'Yes, the venue has a parking garage. Parking is free for workshop attendees with validation.',
        sort_order: 3
      }
    ]);

    // Add ticket for Event 1 (Free)
    await supabase.from('ticket_types').insert([
      {
        event_id: e1.id,
        name: 'General Admission',
        description: 'Full access to the workshop, including materials, lunch, and refreshments.',
        price: 0,
        fee: 0,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 0
      }
    ]);
  }

  // Insert Event 2
  console.log('\n📅 Creating Event 2: Future of Business 2025 Conference...');
  const { data: e2, error: e2Error } = await supabase
    .from('events')
    .insert(event2)
    .select()
    .single();

  if (e2Error) {
    console.error('Error creating event 2:', e2Error);
  } else {
    console.log('✅ Event 2 created with ID:', e2.id);

    // Add FAQ for Event 2
    await supabase.from('faq_items').insert([
      {
        event_id: e2.id,
        question: 'What is the dress code?',
        answer: 'Business casual is recommended. Most attendees wear business attire, but comfortable clothing is fine.',
        sort_order: 0
      },
      {
        event_id: e2.id,
        question: 'Are meals included in the ticket price?',
        answer: 'Yes! Your ticket includes breakfast, lunch, and access to the evening reception with hors d\'oeuvres.',
        sort_order: 1
      },
      {
        event_id: e2.id,
        question: 'Will sessions be recorded?',
        answer: 'Yes, all main stage presentations will be recorded and shared with attendees within 48 hours.',
        sort_order: 2
      },
      {
        event_id: e2.id,
        question: 'Can I get a refund if I can\'t attend?',
        answer: 'Full refunds are available up to 14 days before the event. After that, tickets can be transferred to another person.',
        sort_order: 3
      },
      {
        event_id: e2.id,
        question: 'Is there a mobile app for the conference?',
        answer: 'Yes! Download the conference app to view the schedule, connect with attendees, and access session materials.',
        sort_order: 4
      }
    ]);

    // Add tickets for Event 2 (Paid)
    await supabase.from('ticket_types').insert([
      {
        event_id: e2.id,
        name: 'Early Bird Ticket',
        description: 'Full conference access including all sessions, meals, and networking events. Save $100 with early registration!',
        price: 299.00,
        fee: 15.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 0
      },
      {
        event_id: e2.id,
        name: 'Standard Ticket',
        description: 'Full conference access including all sessions, meals, and networking events.',
        price: 399.00,
        fee: 20.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 1
      },
      {
        event_id: e2.id,
        name: 'VIP Pass',
        description: 'Everything in Standard plus VIP seating, private speaker meet & greet, and premium swag bag.',
        price: 599.00,
        fee: 30.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 2
      }
    ]);
  }

  // Insert Event 3
  console.log('\n📅 Creating Event 3: Winter City Marathon 2025...');
  const { data: e3, error: e3Error } = await supabase
    .from('events')
    .insert(event3)
    .select()
    .single();

  if (e3Error) {
    console.error('Error creating event 3:', e3Error);
  } else {
    console.log('✅ Event 3 created with ID:', e3.id);

    // Add FAQ for Event 3
    await supabase.from('faq_items').insert([
      {
        event_id: e3.id,
        question: 'When and where is kit pickup?',
        answer: 'Kit pickup is December 12-13 from 10 AM to 6 PM at the Race Expo Center (address will be sent via email). You must pick up your race packet before race day.',
        sort_order: 0
      },
      {
        event_id: e3.id,
        question: 'What happens if it snows on race day?',
        answer: 'The race will proceed in light snow. Only severe weather conditions (blizzard warnings) will cause cancellation. Check our website race morning for updates.',
        sort_order: 1
      },
      {
        event_id: e3.id,
        question: 'Are there time limits for finishing?',
        answer: 'Yes. Full Marathon: 6 hours, Half Marathon: 3.5 hours, 10K: 2 hours. Course support ends at these times.',
        sort_order: 2
      },
      {
        event_id: e3.id,
        question: 'Can I switch my race distance after registering?',
        answer: 'Yes, you can change your distance up to 7 days before the race. Contact us at race@opciion.com with your request.',
        sort_order: 3
      },
      {
        event_id: e3.id,
        question: 'What if I have a medical condition?',
        answer: 'Please note any medical conditions on your registration form. Medical support will be available throughout the course.',
        sort_order: 4
      },
      {
        event_id: e3.id,
        question: 'Are there age restrictions?',
        answer: 'Full Marathon: 18+, Half Marathon: 16+, 10K Fun Run: All ages welcome (under 14 must be accompanied by an adult).',
        sort_order: 5
      }
    ]);

    // Add tickets for Event 3 (Paid)
    await supabase.from('ticket_types').insert([
      {
        event_id: e3.id,
        name: 'Full Marathon (42K)',
        description: 'Complete 42.195 km marathon course. Includes: Race bib, timing chip, finisher medal, technical t-shirt, post-race meal, and digital photos.',
        price: 95.00,
        fee: 5.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 0
      },
      {
        event_id: e3.id,
        name: 'Half Marathon (21K)',
        description: 'Complete 21.1 km half marathon course. Includes: Race bib, timing chip, finisher medal, technical t-shirt, post-race meal, and digital photos.',
        price: 75.00,
        fee: 4.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 1
      },
      {
        event_id: e3.id,
        name: '10K Fun Run',
        description: 'Complete 10 km fun run course. Perfect for beginners! Includes: Race bib, timing chip, finisher medal, t-shirt, and post-race refreshments.',
        price: 45.00,
        fee: 3.00,
        quantity_per_order: 1,
        is_active: true,
        sort_order: 2
      }
    ]);
  }

  console.log('\n✨ Seed data created successfully!');
  console.log('\n📊 Summary:');
  console.log('  - 3 events created');
  console.log('  - 15 FAQ items added');
  console.log('  - 7 ticket types added');
  console.log('\n🎉 You can now view these events on the discovery page!');
}

seedEvents().catch(console.error);
