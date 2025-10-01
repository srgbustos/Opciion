/*
  # Complete Opciion Database Setup

  This migration sets up the entire database schema for the Opciion event management platform.

  ## Tables Created

  ### Core Tables
  1. profiles - User profile information
  2. events - Event information with custom modules support
  3. event_registrations - User event registrations

  ### Custom Modules System
  4. event_modules - Modular components for events
  5. module_fields - Custom fields for modules
  6. ticket_types - Ticket types for events
  7. faq_items - FAQ entries for events

  ## Security
  - All tables have Row Level Security enabled
  - Authenticated users can manage their own data
  - Public can view published content
  - Organizers have full control over their events
*/

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'organizer', 'admin')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  short_description text,
  overview text,
  location text NOT NULL,
  date date,
  time time,
  start_date timestamptz,
  end_date timestamptz,
  primary_event_date timestamptz,
  price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  capacity integer DEFAULT 100,
  category text,
  featured boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed', 'archived')),
  image_url text,
  main_image_url text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  confirmation_message text,
  confirmation_email jsonb,
  hashtags text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
ON public.events
FOR SELECT
USING (status = 'published' OR auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can manage their own events" ON public.events;
CREATE POLICY "Organizers can create events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own events"
ON public.events
FOR UPDATE
TO authenticated
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own events"
ON public.events
FOR DELETE
TO authenticated
USING (auth.uid() = organizer_id);

-- ============================================
-- EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can register for events" ON public.event_registrations;
CREATE POLICY "Users can register for events"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organizers can view registrations for their events" ON public.event_registrations;
CREATE POLICY "Organizers can view registrations for their events"
ON public.event_registrations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.events
  WHERE events.id = event_registrations.event_id
  AND events.organizer_id = auth.uid()
));

-- ============================================
-- EVENT MODULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
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

ALTER TABLE public.event_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view modules for accessible events" ON public.event_modules;
CREATE POLICY "Users can view modules for accessible events"
  ON public.event_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_modules.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create modules for their events" ON public.event_modules;
CREATE POLICY "Users can create modules for their events"
  ON public.event_modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update modules for their events" ON public.event_modules;
CREATE POLICY "Users can update modules for their events"
  ON public.event_modules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete modules for their events" ON public.event_modules;
CREATE POLICY "Users can delete modules for their events"
  ON public.event_modules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_modules.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================
-- MODULE FIELDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.module_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.event_modules(id) ON DELETE CASCADE,
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

ALTER TABLE public.module_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view fields for accessible modules" ON public.module_fields;
CREATE POLICY "Users can view fields for accessible modules"
  ON public.module_fields FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_modules
      JOIN public.events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create fields for their modules" ON public.module_fields;
CREATE POLICY "Users can create fields for their modules"
  ON public.module_fields FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_modules
      JOIN public.events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update fields for their modules" ON public.module_fields;
CREATE POLICY "Users can update fields for their modules"
  ON public.module_fields FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_modules
      JOIN public.events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_modules
      JOIN public.events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete fields for their modules" ON public.module_fields;
CREATE POLICY "Users can delete fields for their modules"
  ON public.module_fields FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.event_modules
      JOIN public.events ON events.id = event_modules.event_id
      WHERE event_modules.id = module_fields.module_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================
-- TICKET TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  fee numeric(10, 2) DEFAULT 0,
  quantity_per_order integer DEFAULT 1,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tickets for accessible events" ON public.ticket_types;
CREATE POLICY "Users can view tickets for accessible events"
  ON public.ticket_types FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_types.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create tickets for their events" ON public.ticket_types;
CREATE POLICY "Users can create tickets for their events"
  ON public.ticket_types FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tickets for their events" ON public.ticket_types;
CREATE POLICY "Users can update tickets for their events"
  ON public.ticket_types FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tickets for their events" ON public.ticket_types;
CREATE POLICY "Users can delete tickets for their events"
  ON public.ticket_types FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================
-- FAQ ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view FAQ for accessible events" ON public.faq_items;
CREATE POLICY "Users can view FAQ for accessible events"
  ON public.faq_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = faq_items.event_id
      AND (events.status = 'published' OR events.organizer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create FAQ for their events" ON public.faq_items;
CREATE POLICY "Users can create FAQ for their events"
  ON public.faq_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update FAQ for their events" ON public.faq_items;
CREATE POLICY "Users can update FAQ for their events"
  ON public.faq_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete FAQ for their events" ON public.faq_items;
CREATE POLICY "Users can delete FAQ for their events"
  ON public.faq_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = faq_items.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_modules_updated_at ON public.event_modules;
CREATE TRIGGER update_event_modules_updated_at
  BEFORE UPDATE ON public.event_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    'participant'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_modules_event ON public.event_modules(event_id);
CREATE INDEX IF NOT EXISTS idx_module_fields_module ON public.module_fields(module_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON public.ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_event ON public.faq_items(event_id);
