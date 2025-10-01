# Product Requirements Document (PRD)
## Opciion - Event Management Platform

**Version:** 1.0
**Last Updated:** October 1, 2025
**Product Owner:** TBD
**Document Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Overview
Opciion is a comprehensive event management platform designed to simplify the entire event lifecycle - from creation and promotion to registration and post-event analytics. The platform serves both event organizers and participants, providing tools for creating professional events with custom modules, managing registrations, and tracking performance metrics.

### 1.2 Product Vision
To become the leading platform that empowers event organizers to create memorable, scalable experiences while providing participants with a seamless discovery and registration experience.

### 1.3 Target Audience
- **Primary Users:**
  - Event organizers (individuals, organizations, businesses)
  - Event participants (attendees, registrants)

- **Market Segments:**
  - Technology conferences and meetups
  - Business events and workshops
  - Sports events (marathons, races)
  - Educational seminars and courses
  - Outdoor activities and adventures
  - Community gatherings

### 1.4 Success Metrics
- Number of events created
- Total registrations processed
- User retention rate
- Event discovery engagement
- Platform uptime (target: 99.9%)
- User satisfaction rating (target: 4.9/5)

---

## 2. Product Goals and Objectives

### 2.1 Business Goals
1. Provide a complete event management solution that replaces multiple tools
2. Enable event organizers to create professional events in minutes
3. Facilitate event discovery and increase participant engagement
4. Generate revenue through premium features and transaction fees
5. Build a community of engaged event creators and participants

### 2.2 User Goals

**Event Organizers:**
- Create professional events quickly with minimal technical knowledge
- Customize event experiences with modular components
- Manage registrations and track attendance
- Collect payments securely
- Analyze event performance
- Communicate effectively with participants

**Participants:**
- Discover relevant events based on interests and location
- Register for events seamlessly
- Manage event registrations in one place
- Access event details and tickets easily
- Connect with other attendees

---

## 3. Features and Functionality

### 3.1 Core Features

#### 3.1.1 Authentication & User Management
**Status:** Implemented

**Description:**
Secure user authentication system with role-based access control.

**Capabilities:**
- Email/password authentication via Supabase
- User profiles with display name, avatar, bio, and role
- Role types: Participant, Organizer, Admin
- Automatic profile creation on signup
- Session management and state persistence

**Technical Implementation:**
- Supabase Auth integration
- Row Level Security (RLS) policies
- Profile trigger on user creation
- AuthContext for app-wide authentication state

---

#### 3.1.2 Event Discovery
**Status:** Implemented

**Description:**
Public-facing discovery interface for browsing and searching events.

**Capabilities:**
- Featured events showcase
- Search by title, description, or location
- Category filtering (Technology, Business, Design, Outdoor, Education)
- Event cards displaying key information
- Responsive grid layout
- Animated transitions and hover effects

**Event Information Displayed:**
- Event title and description
- Date, time, and location
- Price or "Free" indicator
- Category and featured badge
- Rating (placeholder: 4.8)
- Registration CTA

**Technical Implementation:**
- React Query for data fetching
- Supabase real-time queries
- Automatic filtering of expired events
- Search state management

---

#### 3.1.3 Event Creation
**Status:** Implemented

**Description:**
Comprehensive event creation workflow with tabbed interface.

**Tabs/Sections:**

**A. Event Basics**
- Title (required)
- Short description (280 characters)
- Full overview (rich text, 5000 characters)
- Location
- Start date, end date, primary event date

**B. Media Management**
- Main event image (required, 2160×1080px, max 10MB)
- Gallery images (up to 3 additional images)
- Image upload to Supabase Storage
- Image preview and removal

**C. FAQ Management**
- Dynamic FAQ item creation
- Question and answer pairs
- Rich text editor for answers
- Sortable list

**D. Ticket Types**
- Multiple ticket types
- Fields: Name, price, fee, quantity per order, description
- Active/inactive toggle
- MXN currency support

**E. Custom Modules**
- Predefined modules: Tickets, Transportation, Hospitality
- Custom module builder
- Module-specific fields with types:
  - Text (string)
  - Number
  - Yes/No (boolean)
  - Long text (text)
  - Dropdown (select)
  - Image upload
- Module images (optional)
- Field validation rules
- Required field toggles

**F. Order Form**
- Custom registration fields
- Field types: string, number, boolean, text
- Required field configuration
- Placeholder text

**G. Confirmation Page**
- Custom confirmation message (plain text, 500 chars)

**H. Email Configuration**
- From email address
- Subject line
- HTML email template
- Variable substitution support:
  - {{attendee_name}}
  - {{event_title}}
  - {{primary_event_date}}
  - {{kit_pickup_date}}
  - {{kit_pickup_location}}
  - {{location}}
  - {{ticket_name}}

**Form Validation:**
- Zod schema validation
- Real-time error display
- Required field enforcement
- Character limits

**Technical Implementation:**
- React Hook Form with Zod resolver
- Field arrays for dynamic sections
- Multi-step form with tabs
- Image upload to Supabase Storage
- Transactional database inserts

---

#### 3.1.4 Dashboard
**Status:** Implemented

**Description:**
Dual-mode dashboard for participants and event creators.

**Participant Mode:**

**Quick Stats:**
- Total events registered
- Upcoming events count
- Past events count

**Event Views:**
- Upcoming events list with:
  - Event details
  - Ticket number
  - Status badge
  - Download ticket button
  - Share button
- Past events history

**Event Creator Mode:**

**Quick Stats:**
- Total events created
- Total registrations across all events
- Total revenue generated

**Event Management:**
- Upcoming events with:
  - Registrations count vs. capacity
  - Price and revenue
  - Fill rate percentage
  - View and share options
- Past events performance

**Features:**
- Animated toggle between modes
- Real-time data from Supabase
- Date-based filtering
- Empty states with CTAs

**Technical Implementation:**
- Role-based data fetching
- Supabase joins for registrations
- Date calculations for upcoming/past
- Format-date for display

---

#### 3.1.5 Navigation
**Status:** Implemented

**Description:**
Global navigation system with authentication awareness.

**Components:**
- Logo/branding (Calendar icon + "Opciion")
- Navigation links:
  - Home (/)
  - Events (/events)
  - Create Event (/create-event) - authenticated only
  - Dashboard (/dashboard) - authenticated only
- User menu (authenticated):
  - Profile display
  - Dashboard link
  - Sign out
- Auth CTAs (unauthenticated):
  - Sign In button
  - Get Started button
- Theme toggle (light/dark mode)
- Responsive mobile menu

**Technical Implementation:**
- React Router integration
- useAuth hook for state
- Theme provider integration
- Mobile-responsive breakpoints

---

### 3.2 Technical Architecture

#### 3.2.1 Frontend Stack
- **Framework:** React 18.3
- **Build Tool:** Vite 5.4
- **Language:** TypeScript 5.8
- **Router:** React Router DOM 6.30
- **State Management:**
  - React Query (TanStack Query) for server state
  - React Context for auth state
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS 3.4
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Animations:** Tailwind CSS animations
- **Testing:** Vitest + React Testing Library

#### 3.2.2 Backend Stack
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **API:** Supabase Auto-generated REST API
- **Real-time:** Supabase Realtime subscriptions

#### 3.2.3 Database Schema

**Tables:**

1. **profiles**
   - id (uuid, PK)
   - user_id (uuid, FK to auth.users, unique)
   - display_name (text)
   - avatar_url (text)
   - role (text: participant|organizer|admin)
   - bio (text)
   - created_at, updated_at (timestamptz)

2. **events**
   - id (uuid, PK)
   - organizer_id (uuid, FK to auth.users)
   - title (text, required)
   - description (text)
   - short_description (text)
   - overview (text)
   - location (text, required)
   - date, time (legacy fields)
   - start_date, end_date, primary_event_date (timestamptz)
   - price, currency (numeric, text)
   - capacity (integer)
   - category (text)
   - featured (boolean)
   - status (text: draft|published|cancelled|completed|archived)
   - image_url, main_image_url (text)
   - gallery_images (jsonb array)
   - confirmation_message (text)
   - confirmation_email (jsonb)
   - hashtags (text array)
   - metadata (jsonb)
   - created_at, updated_at (timestamptz)

3. **event_registrations**
   - id (uuid, PK)
   - event_id (uuid, FK to events)
   - user_id (uuid, FK to auth.users)
   - ticket_number (text, unique)
   - status (text: pending|confirmed|cancelled)
   - registered_at (timestamptz)
   - Unique constraint: (event_id, user_id)

4. **event_modules**
   - id (uuid, PK)
   - event_id (uuid, FK to events)
   - module_type (text: tickets|transportation|hospitality|custom)
   - module_name (text)
   - module_icon (text)
   - module_image_url (text)
   - module_description (text)
   - sort_order (integer)
   - is_active (boolean)
   - created_at, updated_at (timestamptz)

5. **module_fields**
   - id (uuid, PK)
   - module_id (uuid, FK to event_modules)
   - field_key (text)
   - field_type (text: string|number|boolean|text|select|image)
   - field_label (text)
   - field_placeholder (text)
   - field_options (jsonb)
   - is_required (boolean)
   - sort_order (integer)
   - validation_rules (jsonb)
   - created_at (timestamptz)

6. **ticket_types**
   - id (uuid, PK)
   - event_id (uuid, FK to events)
   - name (text)
   - description (text)
   - price (numeric)
   - fee (numeric)
   - quantity_per_order (integer)
   - is_active (boolean)
   - sort_order (integer)
   - created_at (timestamptz)

7. **faq_items**
   - id (uuid, PK)
   - event_id (uuid, FK to events)
   - question (text)
   - answer (text)
   - sort_order (integer)
   - created_at (timestamptz)

**Storage Buckets:**
- avatars (public)
- event-images (public)
- module-images (public)

**Row Level Security:**
All tables implement comprehensive RLS policies ensuring:
- Users can only modify their own data
- Public read access to published events
- Organizers have full control over their events
- Secure joins prevent unauthorized data access

---

### 3.3 User Flows

#### 3.3.1 Event Organizer Flow

```
1. Sign Up / Sign In
   ↓
2. Navigate to Create Event
   ↓
3. Fill Event Basics
   - Enter title, description, location, dates
   ↓
4. Upload Media
   - Main image (required)
   - Gallery images (optional)
   ↓
5. Add FAQ Items
   - Create Q&A pairs
   ↓
6. Configure Tickets
   - Define ticket types and pricing
   ↓
7. Build Custom Modules (optional)
   - Add Transportation, Hospitality, or Custom modules
   - Define fields for each module
   ↓
8. Configure Order Form
   - Add custom registration fields
   ↓
9. Set Confirmation Message
   - Customize post-registration message
   ↓
10. Configure Email Template
    - Set email content and variables
    ↓
11. Submit Event (Draft)
    ↓
12. View in Dashboard
    - Monitor registrations
    - Track analytics
    ↓
13. Publish Event (Future feature)
```

#### 3.3.2 Participant Flow

```
1. Land on Homepage
   ↓
2. Browse Featured Events
   OR
   Navigate to Events Page
   ↓
3. Search/Filter Events
   - By keyword, category, location
   ↓
4. View Event Details
   - Read description, FAQ
   - View media gallery
   - Check ticket types and modules
   ↓
5. Sign Up / Sign In (if not authenticated)
   ↓
6. Select Tickets
   ↓
7. Fill Registration Form
   - Complete order form fields
   - Fill module-specific information
   ↓
8. Confirm Registration
   - Review order
   - Submit
   ↓
9. View Confirmation Page
   - See custom confirmation message
   ↓
10. Receive Confirmation Email
    ↓
11. Access Dashboard
    - View ticket details
    - Download ticket
    - Manage registrations
```

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Image optimization for fast loading
- Lazy loading for event lists
- Debounced search input

### 4.2 Security
- All authentication through Supabase Auth
- Row Level Security on all database tables
- Secure image upload with validation
- No hardcoded secrets in frontend
- HTTPS only
- XSS protection via React
- SQL injection protection via Supabase

### 4.3 Scalability
- Database indexes on frequently queried columns
- Efficient pagination for event lists
- Optimized queries with selected columns
- CDN for static assets (via Supabase Storage)
- Horizontal scaling capability

### 4.4 Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management

### 4.5 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4.6 Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- Touch-friendly UI elements
- Adaptive layouts

---

## 5. Design Requirements

### 5.1 Visual Design Principles
- Clean, sophisticated aesthetic
- Premium feel with attention to detail
- Professional color schemes (avoid purple/indigo by default)
- Consistent spacing (8px system)
- Clear visual hierarchy
- Intentional white space
- Modern, readable typography

### 5.2 Typography
- Line spacing: 150% for body, 120% for headings
- Maximum 3 font weights
- Clear hierarchy through size and weight
- Readable contrast ratios

### 5.3 Color System
- Primary color with gradient support
- Secondary and accent colors
- Success, warning, error states
- Multiple shades per color (6+ per ramp)
- Neutral tones
- Dark mode support

### 5.4 Animations
- Tasteful micro-interactions
- Hover states on all interactive elements
- Smooth transitions (transition-smooth class)
- Entrance animations (fade-in, slide-up, scale-in)
- Loading states
- Hover-scale effects

### 5.5 Component Library
Built on shadcn/ui with customizations:
- Buttons (multiple variants and sizes)
- Cards with gradient backgrounds
- Forms with validation
- Modals and dialogs
- Tabs for multi-step flows
- Badges and tags
- Rich text editor
- Image upload components
- Dropdowns and selects
- Switches and checkboxes

---

## 6. Future Enhancements

### 6.1 High Priority (Next 3-6 months)

**Payment Integration**
- Stripe integration for ticket purchases
- Payment processing
- Refund management
- Fee calculation

**Event Publishing Workflow**
- Draft → Review → Publish flow
- Preview mode
- Publishing checklist
- Unpublish capability

**Enhanced Event Details Page**
- Public event detail view
- Registration from event page
- Social sharing
- Event updates feed

**Registration Management**
- Check-in system
- Attendance tracking
- Waitlist functionality
- Registration transfers

**Email Notifications**
- Automated confirmation emails
- Reminder emails
- Event update notifications
- Cancellation emails

### 6.2 Medium Priority (6-12 months)

**Advanced Analytics**
- Registration trends
- Revenue forecasting
- Attendee demographics
- Engagement metrics
- Export reports

**Social Features**
- Event reviews and ratings
- Attendee networking
- Event recommendations
- Social media integration

**Marketing Tools**
- Email campaigns
- Discount codes
- Referral system
- Affiliate program

**Mobile App**
- Native iOS app
- Native Android app
- Offline ticket access
- Push notifications

**Event Insurance**
- Health coverage options
- Cancellation insurance
- Integration at checkout

**Merchandise Management**
- Add products to events
- Inventory tracking
- Order fulfillment

### 6.3 Low Priority (12+ months)

**Multi-language Support**
- Internationalization
- Multiple currency support
- Regional customization

**Advanced Permissions**
- Team management
- Co-organizers
- Role-based permissions
- Delegated access

**Event Templates**
- Pre-built event templates
- Clone previous events
- Template marketplace

**API Access**
- Public API
- Webhooks
- Third-party integrations

**White-label Solution**
- Custom branding
- Subdomain support
- Enterprise features

---

## 7. Known Limitations

### 7.1 Current Limitations
1. Email confirmation is required for signup (configurable in Supabase)
2. Events remain in draft status (no publishing flow yet)
3. No payment processing (tickets can have prices but no checkout)
4. No public event detail page with registration
5. No email automation (templates exist but not sent)
6. No event editing capability
7. Limited event filtering (only by search query and category)
8. No event capacity enforcement
9. No waitlist functionality
10. No refund system

### 7.2 Technical Debt
- Duplicate event schema fields (date/time vs start_date/end_date)
- Some unused UI components in the library
- Test coverage incomplete
- No end-to-end tests
- Missing error boundaries
- Limited loading states
- No offline support
- No performance monitoring

---

## 8. Testing Requirements

### 8.1 Implemented Tests
- Unit tests for utility functions
- Component tests for key UI components
- Integration tests for critical user flows
- Database tests for custom modules

### 8.2 Test Coverage Goals
- Unit test coverage: 80%+
- Integration test coverage: 60%+
- E2E test coverage for critical paths
- Visual regression tests

### 8.3 Testing Tools
- Vitest for unit/integration tests
- React Testing Library for components
- @testing-library/user-event for interactions
- jsdom for DOM testing
- Vitest UI for test visualization

---

## 9. Deployment and Operations

### 9.1 Deployment
- Platform: Netlify (configured in netlify.toml)
- Build command: `npm run build`
- Node version: Latest LTS
- Environment variables via Netlify
- Automatic deploys from Git

### 9.2 Environment Variables
Required:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### 9.3 Monitoring
To be implemented:
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Uptime monitoring

---

## 10. Success Criteria

### 10.1 Launch Criteria (MVP)
- [ ] Authentication working
- [x] Event creation functional
- [x] Event discovery working
- [x] Dashboard displays data
- [ ] Public event detail page
- [ ] Registration flow complete
- [ ] Email confirmation sent
- [ ] Payment processing (Stripe)
- [ ] Event publishing workflow
- [ ] Mobile responsive
- [ ] Production database setup
- [ ] Security audit passed
- [ ] Performance benchmarks met

### 10.2 Post-Launch Metrics (3 months)
- 100+ events created
- 5,000+ registrations
- 90%+ user satisfaction
- < 5% error rate
- 99% uptime
- 50% mobile traffic

---

## 11. Appendix

### 11.1 Glossary
- **Event Organizer:** User who creates and manages events
- **Participant:** User who discovers and registers for events
- **Module:** Customizable component of an event (e.g., Transportation)
- **Ticket Type:** Pricing tier for event admission
- **RLS:** Row Level Security (database security policy)
- **Draft:** Event status before publication
- **Featured:** Event highlighted on discovery page

### 11.2 References
- Design system: shadcn/ui documentation
- Database: Supabase documentation
- Framework: React documentation
- Routing: React Router documentation

### 11.3 Changelog
- v1.0 (2025-10-01): Initial PRD based on codebase analysis

---

## Document Approval

**Prepared by:** AI Code Analysis
**Review Required:** Product Owner, Engineering Lead, Design Lead
**Status:** Draft - Pending Review
