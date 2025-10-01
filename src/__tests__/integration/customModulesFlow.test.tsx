import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '@/integrations/supabase/client';
import { ModuleBuilder } from '@/components/ModuleBuilder';
import { EventModule } from '@/types/customModules';

vi.mock('@/lib/imageUpload', () => ({
  uploadImageToStorage: vi.fn(async (file: File) => ({
    success: true,
    data: {
      url: `https://example.com/${file.name}`,
      mimeType: 'image/jpeg' as const
    }
  })),
  validateImageFile: vi.fn(() => ({ valid: true })),
  formatFileSize: vi.fn((bytes: number) => `${bytes} bytes`)
}));

describe('Custom Modules Integration Flow', () => {
  let testUserId: string;
  let testEventId: string;
  const testModules: string[] = [];

  beforeEach(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user for tests');
    }
    testUserId = user.id;
  });

  afterEach(async () => {
    for (const moduleId of testModules) {
      await supabase.from('module_fields').delete().eq('module_id', moduleId);
      await supabase.from('event_modules').delete().eq('id', moduleId);
    }
    if (testEventId) {
      await supabase.from('event_modules').delete().eq('event_id', testEventId);
      await supabase.from('events').delete().eq('id', testEventId);
    }
    testModules.length = 0;
  });

  describe('Complete Event Creation with Modules', () => {
    it('should create event with transportation module', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Marathon with Transport',
        short_description: 'Test marathon event',
        overview: 'Detailed overview',
        location: 'Test City',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        confirmation_message: 'Thank you!',
        confirmation_email: {
          from: 'test@test.com',
          subject: 'Confirmed',
          htmlBody: '<p>Confirmed</p>'
        }
      };

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      expect(eventError).toBeNull();
      testEventId = event!.id;

      const moduleData = {
        event_id: testEventId,
        module_type: 'transportation',
        module_name: 'Event Shuttle',
        module_icon: 'Bus',
        module_description: 'Shuttle service details',
        sort_order: 0,
        is_active: true
      };

      const { data: module, error: moduleError } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      expect(moduleError).toBeNull();
      testModules.push(module!.id);

      const fields = [
        {
          module_id: module!.id,
          field_key: 'pickup_location',
          field_type: 'string',
          field_label: 'Pickup Location',
          field_placeholder: 'Enter pickup point',
          is_required: true,
          sort_order: 0
        },
        {
          module_id: module!.id,
          field_key: 'departure_time',
          field_type: 'string',
          field_label: 'Departure Time',
          is_required: true,
          sort_order: 1
        }
      ];

      const { data: createdFields, error: fieldsError } = await supabase
        .from('module_fields')
        .insert(fields)
        .select();

      expect(fieldsError).toBeNull();
      expect(createdFields).toHaveLength(2);
      expect(createdFields![0].field_key).toBe('pickup_location');
      expect(createdFields![1].field_key).toBe('departure_time');
    });

    it('should create event with hospitality module', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Conference with Hotels',
        short_description: 'Test conference',
        overview: 'Detailed overview',
        location: 'Convention Center',
        start_date: '2025-12-01T00:00:00Z',
        end_date: '2025-12-05T00:00:00Z',
        primary_event_date: '2025-12-03T00:00:00Z',
        confirmation_message: 'Thank you!',
        confirmation_email: {
          from: 'test@test.com',
          subject: 'Confirmed',
          htmlBody: '<p>Confirmed</p>'
        }
      };

      const { data: event } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      testEventId = event!.id;

      const moduleData = {
        event_id: testEventId,
        module_type: 'hospitality',
        module_name: 'Hotel Reservations',
        module_icon: 'Hotel',
        module_description: 'Accommodation options',
        sort_order: 0,
        is_active: true
      };

      const { data: module } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      testModules.push(module!.id);

      const fields = [
        {
          module_id: module!.id,
          field_key: 'room_type',
          field_type: 'select',
          field_label: 'Room Type',
          field_options: ['Single', 'Double', 'Suite'],
          is_required: true,
          sort_order: 0
        },
        {
          module_id: module!.id,
          field_key: 'number_of_rooms',
          field_type: 'number',
          field_label: 'Number of Rooms',
          is_required: true,
          sort_order: 1
        }
      ];

      const { data: createdFields } = await supabase
        .from('module_fields')
        .insert(fields)
        .select();

      expect(createdFields).toHaveLength(2);
      expect(createdFields![0].field_type).toBe('select');
      expect(createdFields![0].field_options).toContain('Single');
    });

    it('should create event with custom module and image', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Custom Event',
        short_description: 'Test custom module',
        overview: 'Detailed overview',
        location: 'Test Location',
        start_date: '2025-11-15T00:00:00Z',
        end_date: '2025-11-17T00:00:00Z',
        primary_event_date: '2025-11-16T00:00:00Z',
        confirmation_message: 'Thank you!',
        confirmation_email: {
          from: 'test@test.com',
          subject: 'Confirmed',
          htmlBody: '<p>Confirmed</p>'
        }
      };

      const { data: event } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      testEventId = event!.id;

      const moduleData = {
        event_id: testEventId,
        module_type: 'custom',
        module_name: 'Dietary Preferences',
        module_icon: 'Package',
        module_description: 'Special dietary needs',
        module_image_url: 'https://example.com/dietary.jpg',
        sort_order: 0,
        is_active: true
      };

      const { data: module } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      testModules.push(module!.id);

      const fields = [
        {
          module_id: module!.id,
          field_key: 'dietary_restrictions',
          field_type: 'text',
          field_label: 'Dietary Restrictions',
          field_placeholder: 'Please describe any dietary restrictions',
          is_required: false,
          sort_order: 0
        },
        {
          module_id: module!.id,
          field_key: 'allergies',
          field_type: 'text',
          field_label: 'Allergies',
          is_required: false,
          sort_order: 1
        }
      ];

      const { data: createdFields } = await supabase
        .from('module_fields')
        .insert(fields)
        .select();

      expect(createdFields).toHaveLength(2);
      expect(module!.module_image_url).toBe('https://example.com/dietary.jpg');
    });
  });

  describe('ModuleBuilder Component', () => {
    it('should render with empty modules', () => {
      const onChange = vi.fn();
      render(<ModuleBuilder modules={[]} onChange={onChange} />);

      expect(screen.getByText(/No modules added yet/i)).toBeInTheDocument();
    });

    it('should render predefined module buttons', () => {
      const onChange = vi.fn();
      render(<ModuleBuilder modules={[]} onChange={onChange} />);

      expect(screen.getByText(/Add Tickets/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Transportation/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Hospitality/i)).toBeInTheDocument();
      expect(screen.getByText(/Add Custom Module/i)).toBeInTheDocument();
    });

    it('should display existing modules', () => {
      const modules: EventModule[] = [
        {
          id: 'test-1',
          module_type: 'transportation',
          module_name: 'Event Transport',
          module_icon: 'Bus',
          sort_order: 0,
          is_active: true,
          fields: []
        }
      ];

      const onChange = vi.fn();
      render(<ModuleBuilder modules={modules} onChange={onChange} />);

      expect(screen.getByDisplayValue('Event Transport')).toBeInTheDocument();
    });
  });

  describe('Data Integrity and Relationships', () => {
    it('should maintain referential integrity when deleting event', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Event for Deletion',
        short_description: 'Test',
        overview: 'Test overview',
        location: 'Test Location',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        confirmation_message: 'Test',
        confirmation_email: {
          from: 'test@test.com',
          subject: 'Test',
          htmlBody: 'Test'
        }
      };

      const { data: event } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      const eventId = event!.id;

      const moduleData = {
        event_id: eventId,
        module_type: 'custom',
        module_name: 'Test Module',
        sort_order: 0,
        is_active: true
      };

      const { data: module } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      const moduleId = module!.id;

      const fieldData = {
        module_id: moduleId,
        field_key: 'test_field',
        field_type: 'string',
        field_label: 'Test Field',
        is_required: false,
        sort_order: 0
      };

      await supabase.from('module_fields').insert(fieldData);

      await supabase.from('events').delete().eq('id', eventId);

      const { data: remainingModules } = await supabase
        .from('event_modules')
        .select('*')
        .eq('id', moduleId);

      const { data: remainingFields } = await supabase
        .from('module_fields')
        .select('*')
        .eq('module_id', moduleId);

      expect(remainingModules).toHaveLength(0);
      expect(remainingFields).toHaveLength(0);
    });

    it('should query event with all related data', async () => {
      const eventData = {
        organizer_id: testUserId,
        title: 'Full Event Query Test',
        short_description: 'Test',
        overview: 'Test overview',
        location: 'Test Location',
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-03T00:00:00Z',
        primary_event_date: '2025-11-02T00:00:00Z',
        confirmation_message: 'Test',
        confirmation_email: {
          from: 'test@test.com',
          subject: 'Test',
          htmlBody: 'Test'
        }
      };

      const { data: event } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      testEventId = event!.id;

      const moduleData = {
        event_id: testEventId,
        module_type: 'transportation',
        module_name: 'Transport Module',
        sort_order: 0,
        is_active: true
      };

      const { data: module } = await supabase
        .from('event_modules')
        .insert(moduleData)
        .select()
        .single();

      testModules.push(module!.id);

      await supabase.from('module_fields').insert({
        module_id: module!.id,
        field_key: 'location',
        field_type: 'string',
        field_label: 'Pickup Location',
        is_required: true,
        sort_order: 0
      });

      const { data: fullEvent } = await supabase
        .from('events')
        .select(`
          *,
          event_modules (
            *,
            module_fields (*)
          )
        `)
        .eq('id', testEventId)
        .single();

      expect(fullEvent).toBeDefined();
      expect(fullEvent?.event_modules).toHaveLength(1);
      expect(fullEvent?.event_modules[0].module_fields).toHaveLength(1);
      expect(fullEvent?.event_modules[0].module_fields[0].field_key).toBe('location');
    });
  });
});
