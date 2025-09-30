export type ModuleType = 'tickets' | 'transportation' | 'hospitality' | 'custom';

export type FieldType = 'string' | 'number' | 'boolean' | 'text' | 'select' | 'image';

export type ModuleField = {
  id?: string;
  field_key: string;
  field_type: FieldType;
  field_label: string;
  field_placeholder?: string;
  field_options?: string[];
  is_required: boolean;
  sort_order: number;
  validation_rules?: Record<string, any>;
};

export type EventModule = {
  id?: string;
  module_type: ModuleType;
  module_name: string;
  module_icon?: string;
  module_image_url?: string;
  module_description?: string;
  sort_order: number;
  is_active: boolean;
  fields: ModuleField[];
};

export const PREDEFINED_MODULES: Omit<EventModule, 'id' | 'sort_order' | 'fields'>[] = [
  {
    module_type: 'tickets',
    module_name: 'Tickets',
    module_icon: 'Ticket',
    module_description: 'Manage ticket types and pricing',
    is_active: true,
  },
  {
    module_type: 'transportation',
    module_name: 'Transportation',
    module_icon: 'Bus',
    module_description: 'Transportation options and logistics',
    is_active: true,
  },
  {
    module_type: 'hospitality',
    module_name: 'Hospitality',
    module_icon: 'Hotel',
    module_description: 'Accommodation and lodging information',
    is_active: true,
  },
];

export const DEFAULT_MODULE_FIELDS: Record<ModuleType, ModuleField[]> = {
  tickets: [
    {
      field_key: 'ticket_name',
      field_type: 'string',
      field_label: 'Ticket Name',
      field_placeholder: 'e.g., Early Bird, VIP, General Admission',
      is_required: true,
      sort_order: 0,
    },
    {
      field_key: 'ticket_price',
      field_type: 'number',
      field_label: 'Price',
      field_placeholder: '0.00',
      is_required: true,
      sort_order: 1,
    },
    {
      field_key: 'ticket_quantity',
      field_type: 'number',
      field_label: 'Quantity Available',
      field_placeholder: '100',
      is_required: false,
      sort_order: 2,
    },
    {
      field_key: 'ticket_description',
      field_type: 'text',
      field_label: 'Description',
      field_placeholder: 'What is included with this ticket?',
      is_required: false,
      sort_order: 3,
    },
  ],
  transportation: [
    {
      field_key: 'transport_type',
      field_type: 'select',
      field_label: 'Transportation Type',
      field_options: ['Bus', 'Shuttle', 'Car Pool', 'Other'],
      is_required: true,
      sort_order: 0,
    },
    {
      field_key: 'pickup_location',
      field_type: 'string',
      field_label: 'Pickup Location',
      field_placeholder: 'e.g., Main Square, Hotel Lobby',
      is_required: false,
      sort_order: 1,
    },
    {
      field_key: 'departure_time',
      field_type: 'string',
      field_label: 'Departure Time',
      field_placeholder: 'e.g., 08:00 AM',
      is_required: false,
      sort_order: 2,
    },
    {
      field_key: 'transport_cost',
      field_type: 'number',
      field_label: 'Cost per Person',
      field_placeholder: '0.00',
      is_required: false,
      sort_order: 3,
    },
    {
      field_key: 'transport_notes',
      field_type: 'text',
      field_label: 'Additional Notes',
      field_placeholder: 'Any special instructions...',
      is_required: false,
      sort_order: 4,
    },
  ],
  hospitality: [
    {
      field_key: 'accommodation_type',
      field_type: 'select',
      field_label: 'Accommodation Type',
      field_options: ['Hotel', 'Hostel', 'Airbnb', 'Camping', 'Other'],
      is_required: true,
      sort_order: 0,
    },
    {
      field_key: 'room_type',
      field_type: 'select',
      field_label: 'Room Type',
      field_options: ['Single', 'Double', 'Suite', 'Dormitory'],
      is_required: false,
      sort_order: 1,
    },
    {
      field_key: 'number_of_rooms',
      field_type: 'number',
      field_label: 'Number of Rooms Needed',
      field_placeholder: '1',
      is_required: false,
      sort_order: 2,
    },
    {
      field_key: 'check_in_date',
      field_type: 'string',
      field_label: 'Check-in Date',
      field_placeholder: 'YYYY-MM-DD',
      is_required: false,
      sort_order: 3,
    },
    {
      field_key: 'check_out_date',
      field_type: 'string',
      field_label: 'Check-out Date',
      field_placeholder: 'YYYY-MM-DD',
      is_required: false,
      sort_order: 4,
    },
    {
      field_key: 'accommodation_cost',
      field_type: 'number',
      field_label: 'Cost per Night',
      field_placeholder: '0.00',
      is_required: false,
      sort_order: 5,
    },
    {
      field_key: 'special_requests',
      field_type: 'text',
      field_label: 'Special Requests',
      field_placeholder: 'Any special requirements...',
      is_required: false,
      sort_order: 6,
    },
  ],
  custom: [],
};
