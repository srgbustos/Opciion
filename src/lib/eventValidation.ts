import { z } from "zod";

// Image validation schema
export const imageRefSchema = z.object({
  url: z.string().url("Invalid image URL"),
  width: z.number().optional(),
  height: z.number().optional(),
  sizeBytes: z.number().optional(),
  mimeType: z.enum(["image/jpeg", "image/png"], {
    errorMap: () => ({ message: "Only JPEG and PNG images are allowed" })
  })
});

// FAQ item validation schema
export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required").max(200, "Question must be less than 200 characters"),
  answer: z.string().min(1, "Answer is required").max(1000, "Answer must be less than 1000 characters")
});

// Ticket type validation schema
export const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required").max(100, "Ticket name must be less than 100 characters"),
  price: z.number().min(0, "Price must be non-negative"),
  fee: z.number().min(0, "Fee must be non-negative").optional(),
  quantityPerOrder: z.number().int().min(1, "Quantity per order must be at least 1"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  active: z.boolean()
});

// Order form field validation schema
export const orderFormFieldSchema = z.object({
  key: z.string().min(1, "Field key is required"),
  type: z.enum(["string", "number", "boolean", "text"]),
  required: z.boolean(),
  label: z.string().min(1, "Field label is required"),
  placeholder: z.string().optional()
});

// Confirmation email validation schema
export const confirmationEmailSchema = z.object({
  from: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  htmlBody: z.string().min(1, "Email body is required")
});

// Plain text validation (no emojis, HTML, or special characters)
const plainTextSchema = z.string()
  .min(1, "Confirmation page message is required")
  .max(500, "Message must be less than 500 characters")
  .refine(
    (text) => {
      // Check for emojis, HTML tags, or non-ASCII characters
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      const htmlRegex = /<[^>]*>/;
      const nonAsciiRegex = /[^\x00-\x7F]/;
      
      return !emojiRegex.test(text) && !htmlRegex.test(text) && !nonAsciiRegex.test(text);
    },
    {
      message: "Text must be plain text only (no emojis, HTML tags, or special characters)"
    }
  );

// Main event creation form validation schema
export const eventCreationSchema = z.object({
  // Event Basics
  title: z.string()
    .min(1, "Event title is required")
    .max(120, "Title must be less than 120 characters"),
  
  shortDescription: z.string()
    .min(1, "Short description is required")
    .max(280, "Short description must be less than 280 characters"),
  
  overview: z.string()
    .min(1, "Overview is required")
    .max(5000, "Overview must be less than 5000 characters"),
  
  location: z.string()
    .min(1, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  
  startDate: z.string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  
  endDate: z.string()
    .min(1, "End date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  
  primaryEventDate: z.string()
    .min(1, "Primary event date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  
  // Media
  images: z.object({
    main: imageRefSchema.nullable(),
    gallery: z.array(imageRefSchema).max(3, "Maximum 3 additional images allowed")
  }),
  
  // FAQ
  faq: z.array(faqItemSchema)
    .min(1, "At least one FAQ item is required")
    .max(20, "Maximum 20 FAQ items allowed"),
  
  // Ticket Types
  tickets: z.array(ticketTypeSchema)
    .min(1, "At least one ticket type is required")
    .max(10, "Maximum 10 ticket types allowed"),
  
  // Order Form
  orderForm: z.array(orderFormFieldSchema)
    .min(1, "At least one order form field is required"),
  
  specialInstructions: z.array(z.string())
    .max(10, "Maximum 10 special instructions allowed"),
  
  // Confirmation
  confirmationPageMessage: plainTextSchema,
  
  confirmationEmail: confirmationEmailSchema,
  
  // Additional
  hashtags: z.array(z.string().max(50, "Hashtag must be less than 50 characters"))
    .max(10, "Maximum 10 hashtags allowed")
    .optional(),
  
  metadata: z.record(z.any()).optional()
}).refine(
  (data) => {
    // Ensure primary event date is within the start-end date range
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const primaryDate = new Date(data.primaryEventDate);
    
    return primaryDate >= startDate && primaryDate <= endDate;
  },
  {
    message: "Primary event date must be within the start and end date range",
    path: ["primaryEventDate"]
  }
).refine(
  (data) => {
    // Ensure start date is not after end date
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    return startDate <= endDate;
  },
  {
    message: "Start date must be before or equal to end date",
    path: ["startDate"]
  }
);

// Image upload validation schema
export const imageUploadSchema = z.object({
  file: z.instanceof(File, "File is required"),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z.array(z.string()).default(["image/jpeg", "image/png"])
}).refine(
  (data) => data.file.size <= data.maxSize,
  {
    message: "File size must be less than 10MB",
    path: ["file"]
  }
).refine(
  (data) => data.allowedTypes.includes(data.file.type),
  {
    message: "Only JPEG and PNG images are allowed",
    path: ["file"]
  }
);

export type EventCreationFormData = z.infer<typeof eventCreationSchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;
