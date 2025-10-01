import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Custom Modules Database Schema', () => {
  let testUserId: string;
  let testEventId: string;
  let testModuleId: string;

  beforeEach(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user for tests');
    }
    testUserId = user.id;
  });

  afterEach(async () => {
    if (testModuleId) {
      await supabase.from('module_fields').delete().eq('module_id', testModuleId);
      await supabase.from('event_modules').delete().eq('id', testModuleId);
    }
    if (testEventId) {
      await supabase.from('ticket_types').delete().eq('event_id', testEventId);
      await supabase.from('faq_items').delete().eq('event_id', testEventId);
      await supabase.from('event_modules').delete().eq('event_id', testEventId);
      await supabase.from('events').delete().eq('id', testEventId);
    }
  });

  describe('Events Table', () => {
    it('should create an event with required fields', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Test Marathon Event',
        short_description: 'A test marathon event',
        overview: 'This is a detailed overview of the test marathon event',
        location: 'Test City, State',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        confirmation_message: 'Thank you for registering!',
        confirmation_email: {
          from: 'test@example.com',
          subject: 'Registration Confirmed',
          htmlBody: '<p>Your registration is confirmed</p>'
        },
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toBe('Test Marathon Event');
      expect(data?.organizer_id).toBe(testUserId);
      expect(data?.status).toBe('draft');

      testEventId = data!.id;
    });

    it('should reject event with invalid status', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Test Event',
        short_description: 'Test',
        overview: 'Test overview',
        location: 'Test Location',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        confirmation_message: 'Test message',
        confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' },
        status: 'invalid_status'
      };

      const { error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      expect(error).toBeDefined();
      expect(error?.message).toContain('status');
    });

    it('should store gallery images as jsonb array', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Test Event with Images',
        short_description: 'Test',
        overview: 'Test overview',
        location: 'Test Location',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        main_image_url: 'https://example.com/main.jpg',
        gallery_images: [
          { url: 'https://example.com/1.jpg', mimeType: 'image/jpeg' },
          { url: 'https://example.com/2.jpg', mimeType: 'image/jpeg' }
        ],
        confirmation_message: 'Test message',
        confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
      };

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.gallery_images).toHaveLength(2);
      expect(data?.main_image_url).toBe('https://example.com/main.jpg');

      testEventId = data!.id;
    });
  });

  describe('Event Modules Table', () => {
    beforeEach(async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'Test Event for Modules',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      testEventId = eventData!.id;
    });

    it('should create a transportation module', async () => {
      const moduleData = {
        event_id: testEventId,
        module_type: 'transportation',
        module_name: 'Event Transportation',
        module_icon: 'Bus',
        module_description: 'Transportation details for the event',
        sort_order: 0,
        is_active: true
      };

      const { data, error } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.module_type).toBe('transportation');
      expect(data?.module_name).toBe('Event Transportation');

      testModuleId = data!.id;
    });

    it('should create a hospitality module', async () => {
      const moduleData = {
        event_id: testEventId,
        module_type: 'hospitality',
        module_name: 'Accommodation',
        module_icon: 'Hotel',
        module_description: 'Hotel and lodging information',
        sort_order: 1,
        is_active: true
      };

      const { data, error } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.module_type).toBe('hospitality');

      testModuleId = data!.id;
    });

    it('should create a custom module with image', async () => {
      const moduleData = {
        event_id: testEventId,
        module_type: 'custom',
        module_name: 'Dietary Preferences',
        module_icon: 'Package',
        module_description: 'Special dietary requirements',
        module_image_url: 'https://example.com/dietary.jpg',
        sort_order: 2,
        is_active: true
      };

      const { data, error } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.module_type).toBe('custom');
      expect(data?.module_image_url).toBe('https://example.com/dietary.jpg');

      testModuleId = data!.id;
    });

    it('should reject invalid module type', async () => {
      const moduleData = {
        event_id: testEventId,
        module_type: 'invalid_type',
        module_name: 'Invalid Module',
        sort_order: 0,
        is_active: true
      };

      const { error } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      expect(error).toBeDefined();
      expect(error?.message).toContain('module_type');
    });
  });

  describe('Module Fields Table', () => {
    beforeEach(async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'Test Event for Fields',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      testEventId = eventData!.id;

      const { data: moduleData } = await supabase
        .from('event_modules')
        .insert({
          event_id: testEventId,
          module_type: 'custom',
          module_name: 'Test Module',
          sort_order: 0,
          is_active: true
        })
        .select()
        .single();

      testModuleId = moduleData!.id;
    });

    it('should create a text field', async () => {
      const fieldData = {
        module_id: testModuleId,
        field_key: 'full_name',
        field_type: 'string',
        field_label: 'Full Name',
        field_placeholder: 'Enter your full name',
        is_required: true,
        sort_order: 0
      };

      const { data, error } = await supabase
        .from('module_fields')
        .insert(fieldData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.field_type).toBe('string');
      expect(data?.is_required).toBe(true);
    });

    it('should create a number field', async () => {
      const fieldData = {
        module_id: testModuleId,
        field_key: 'age',
        field_type: 'number',
        field_label: 'Age',
        field_placeholder: 'Enter your age',
        is_required: true,
        sort_order: 1
      };

      const { data, error } = await supabase
        .from('module_fields')
        .insert(fieldData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.field_type).toBe('number');
    });

    it('should create a select field with options', async () => {
      const fieldData = {
        module_id: testModuleId,
        field_key: 'room_type',
        field_type: 'select',
        field_label: 'Room Type',
        field_options: ['Single', 'Double', 'Suite'],
        is_required: true,
        sort_order: 2
      };

      const { data, error } = await supabase
        .from('module_fields')
        .insert(fieldData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.field_type).toBe('select');
      expect(data?.field_options).toHaveLength(3);
      expect(data?.field_options).toContain('Single');
    });

    it('should create an image upload field', async () => {
      const fieldData = {
        module_id: testModuleId,
        field_key: 'profile_photo',
        field_type: 'image',
        field_label: 'Profile Photo',
        is_required: false,
        sort_order: 3
      };

      const { data, error } = await supabase
        .from('module_fields')
        .insert(fieldData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.field_type).toBe('image');
    });

    it('should reject invalid field type', async () => {
      const fieldData = {
        module_id: testModuleId,
        field_key: 'test_field',
        field_type: 'invalid_type',
        field_label: 'Test Field',
        is_required: false,
        sort_order: 0
      };

      const { error } = await supabase
        .from('module_fields')
        .insert(fieldData)
        .select()
        .single();

      expect(error).toBeDefined();
      expect(error?.message).toContain('field_type');
    });
  });

  describe('Ticket Types Table', () => {
    beforeEach(async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'Test Event for Tickets',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      testEventId = eventData!.id;
    });

    it('should create a ticket type', async () => {
      const ticketData = {
        event_id: testEventId,
        name: 'Early Bird',
        description: 'Early bird discount ticket',
        price: 99.99,
        fee: 5.00,
        quantity_per_order: 2,
        is_active: true,
        sort_order: 0
      };

      const { data, error } = await supabase
        .from('ticket_types')
        .insert(ticketData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toBe('Early Bird');
      expect(Number(data?.price)).toBe(99.99);
      expect(Number(data?.fee)).toBe(5.00);
    });
  });

  describe('FAQ Items Table', () => {
    beforeEach(async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'Test Event for FAQ',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      testEventId = eventData!.id;
    });

    it('should create an FAQ item', async () => {
      const faqData = {
        event_id: testEventId,
        question: 'What time does the event start?',
        answer: 'The event starts at 9:00 AM',
        sort_order: 0
      };

      const { data, error } = await supabase
        .from('faq_items')
        .insert(faqData)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.question).toBe('What time does the event start?');
      expect(data?.answer).toBe('The event starts at 9:00 AM');
    });
  });

  describe('RLS Policies', () => {
    it('should allow users to view their own events', async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'My Event',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      testEventId = eventData!.id;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', testEventId)
        .single();

      expect(error).toBeNull();
      expect(data?.organizer_id).toBe(testUserId);
    });

    it('should cascade delete modules when event is deleted', async () => {
      const { data: eventData } = await supabase
        .from('events')
        .insert({
          organizer_id: testUserId,
          title: 'Event to Delete',
          short_description: 'Test',
          overview: 'Test overview',
          location: 'Test Location',
          start_date: '2025-11-01T00:00:00Z',
          end_date: '2025-11-03T00:00:00Z',
          primary_event_date: '2025-11-02T00:00:00Z',
          confirmation_message: 'Test',
          confirmation_email: { from: 'test@test.com', subject: 'Test', htmlBody: 'Test' }
        })
        .select()
        .single();

      const eventId = eventData!.id;

      const { data: moduleData } = await supabase
        .from('event_modules')
        .insert({
          event_id: eventId,
          module_type: 'custom',
          module_name: 'Test Module',
          sort_order: 0,
          is_active: true
        })
        .select()
        .single();

      const moduleId = moduleData!.id;

      await supabase.from('events').delete().eq('id', eventId);

      const { data: modules } = await supabase
        .from('event_modules')
        .select('*')
        .eq('id', moduleId);

      expect(modules).toHaveLength(0);
    });
  });
});
