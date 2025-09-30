/*
  # Create Custom Modules System for Events

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `organizer_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `short_description` (text)
      - `overview` (text)
      - `location` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `primary_event_date` (timestamptz)
      - `main_image_url` (text)
      - `gallery_images` (jsonb)
      - `confirmation_message` (text)
      - `confirmation_email` (jsonb)
      - `status` (text, default 'draft')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `event_modules`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `module_type` (text: 'tickets', 'transportation', 'hospitality', 'custom')
      - `module_name` (text)
      - `module_icon` (text)
      - `module_image_url` (text, optional)
      - `sort_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `module_fields`
      - `id` (uuid, primary key)
      - `module_id` (uuid, foreign key to event_modules)
      - `field_key` (text)
      - `field_type` (text: 'string', 'number', 'boolean', 'text', 'select', 'image')
      - `field_label` (text)
      - `field_placeholder` (text)
      - `field_options` (jsonb, for select fields)
      - `is_required` (boolean)
      - `sort_order` (integer)
      - `validation_rules` (jsonb)
      - `created_at` (timestamptz)

    - `ticket_types`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `fee` (numeric)
      - `quantity_per_order` (integer)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

    - `faq_items`
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key to events)
      - `question` (text)
      - `answer` (text)
      - `sort_order` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own events
    - Add policies for public read access to published events
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  short_description text NOT NULL,
  overview text NOT NULL,
  location text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  primary_event_date timestamptz NOT NULL,
  main_image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  confirmation_message text NOT NULL,
  confirmation_email jsonb NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  hashtags text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_modules table
CREATE TABLE IF NOT EXISTS event_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  module_type text NOT NULL CHECK (module_type IN ('tickets', 'transportation', 'hospitality', 'custom')),
  module_name text NOT NULL,
  module_icon text,
  module_image_url text,
  module_description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create module_fields table
CREATE TABLE IF NOT EXISTS module_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES event_modules(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('string', 'number', 'boolean', 'text', 'select', 'image')),
  field_label text NOT NULL,
  field_placeholder text,
  field_options jsonb,
  is_required boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  validation_rules jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create ticket_types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  fee numeric(10, 2) DEFAULT 0,
  quantity_per_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view published events"
  ON events FOR SELECT
  TO authenticated
  USING (status = 'published' OR organizer_id = auth.uid());

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Event modules policies
CREATE POLICY "Users can view modules for accessible events"
  ON event_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_modules.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create modules for their events"
  ON event_modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update modules for their events"
  ON event_modules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete modules for their events"
  ON event_modules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Module fields policies
CREATE POLICY "Users can view fields for accessible modules"
  ON module_fields FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_modules
      JOIN events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create fields for their modules"
  ON module_fields FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_modules
      JOIN events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update fields for their modules"
  ON module_fields FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_modules
      JOIN events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_modules
      JOIN events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete fields for their modules"
  ON module_fields FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM event_modules
      JOIN events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Ticket types policies
CREATE POLICY "Users can view tickets for accessible events"
  ON ticket_types FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create tickets for their events"
  ON ticket_types FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tickets for their events"
  ON ticket_types FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tickets for their events"
  ON ticket_types FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- FAQ items policies
CREATE POLICY "Users can view FAQ for accessible events"
  ON faq_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = faq_items.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create FAQ for their events"
  ON faq_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can update FAQ for their events"
  ON faq_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete FAQ for their events"
  ON faq_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_modules_event ON event_modules(event_id);
CREATE INDEX IF NOT EXISTS idx_module_fields_module ON module_fields(module_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_event ON faq_items(event_id);