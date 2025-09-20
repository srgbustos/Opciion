// Event Creation Form Types
export type ImageRef = {
  url: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  mimeType: "image/jpeg" | "image/png";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TicketType = {
  name: string;
  price: number;
  fee?: number;
  quantityPerOrder: number;
  description: string;
  active: boolean;
};

export type OrderFormField = {
  key: string;
  type: "string" | "number" | "boolean" | "text";
  required: boolean;
  label: string;
  placeholder?: string;
};

export type ConfirmationEmail = {
  from: string;
  subject: string;
  htmlBody: string;
};

export type EventDraft = {
  // Event Basics
  title: string;
  shortDescription: string;
  overview: string;
  location: string;
  startDate: string;
  endDate: string;
  primaryEventDate: string;
  
  // Media
  images: {
    main: ImageRef | null;
    gallery: ImageRef[];
  };
  
  // FAQ
  faq: FaqItem[];
  
  // Ticket Types
  tickets: TicketType[];
  
  // Order Form
  orderForm: OrderFormField[];
  specialInstructions: string[];
  
  // Confirmation
  confirmationPageMessage: string;
  confirmationEmail: ConfirmationEmail;
  
  // Additional
  hashtags?: string[];
  metadata?: Record<string, any>;
};

// Default FAQ items
export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Qué distancias están disponibles?",
    answer: "Ofrecemos las siguientes distancias: **21K, 14K, 7K** y \"Corre con tu perro -- 7K\"."
  },
  {
    question: "¿Cuándo y dónde se realizará el evento?",
    answer: "El evento se llevará a cabo del **14 al 16 de noviembre de 2025** en **Zirahuén, Michoacán**. El día principal de la carrera será el **domingo 16 de noviembre**."
  },
  {
    question: "¿Cómo me registro?",
    answer: "Puedes registrarte directamente en **OPCIION.COM** completando el formulario de registro."
  },
  {
    question: "¿Qué incluye mi registro?",
    answer: "Tu registro incluye: kit del corredor, número de competencia, medalla conmemorativa, playera oficial, puntos de hidratación, y acceso a las actividades culturales y recreativas del fin de semana."
  },
  {
    question: "¿Habrá premios?",
    answer: "Sí, habrá reconocimientos especiales y premios de nuestros patrocinadores, incluyendo estancias y reconocimientos para los primeros lugares."
  },
  {
    question: "¿Cuándo y dónde puedo recoger mi kit?",
    answer: "La entrega de kits será el **sábado 15 de noviembre de 12:00 a 18:30** en el **Restaurante El Canto de la Sirena**."
  },
  {
    question: "¿Puedo asistir con mi familia?",
    answer: "¡Por supuesto! Las familias y acompañantes son bienvenidos. Te recomendamos contactar con nosotros para obtener tarifas especiales de hospedaje."
  }
];

// Default ticket types
export const DEFAULT_TICKET_TYPES: TicketType[] = [
  {
    name: "Medio Maratón (21 km)",
    price: 550,
    fee: 0,
    quantityPerOrder: 1,
    description: "Kit del corredor, número, medalla conmemorativa, playera oficial, puntos de hidratación, acceso a actividades culturales y recreativas del fin de semana.",
    active: true
  },
  {
    name: "14 km",
    price: 450,
    fee: 0,
    quantityPerOrder: 1,
    description: "Kit del corredor, número, medalla conmemorativa, playera oficial, puntos de hidratación, acceso a actividades culturales y recreativas del fin de semana.",
    active: true
  },
  {
    name: "7 km",
    price: 350,
    fee: 0,
    quantityPerOrder: 1,
    description: "Kit del corredor, número, medalla conmemorativa, playera oficial, puntos de hidratación, acceso a actividades culturales y recreativas del fin de semana.",
    active: true
  },
  {
    name: "Corre con tu perro -- 7 km",
    price: 450,
    fee: 0,
    quantityPerOrder: 1,
    description: "Kit del corredor, número, medalla conmemorativa, playera oficial, puntos de hidratación, acceso a actividades culturales y recreativas del fin de semana.",
    active: true
  }
];

// Default order form fields
export const DEFAULT_ORDER_FORM_FIELDS: OrderFormField[] = [
  { key: "name", type: "string", required: true, label: "Nombre completo", placeholder: "Tu nombre completo" },
  { key: "age", type: "number", required: true, label: "Edad", placeholder: "Tu edad" },
  { key: "email", type: "string", required: true, label: "Correo electrónico", placeholder: "tu@email.com" },
  { key: "phone", type: "string", required: true, label: "Teléfono", placeholder: "+52 123 456 7890" },
  { key: "city", type: "string", required: false, label: "Ciudad de origen", placeholder: "Tu ciudad" },
  { key: "runClub", type: "string", required: false, label: "Club de corredores", placeholder: "Nombre de tu club" },
  { key: "transportLodging", type: "text", required: false, label: "Ayuda adicional: Transporte / Hospedaje", placeholder: "Describe tus necesidades..." },
  { key: "specialNeeds", type: "text", required: false, label: "Necesidades especiales", placeholder: "Menciona cualquier condición o enfermedad crónica..." }
];

// Default special instructions
export const DEFAULT_SPECIAL_INSTRUCTIONS = [
  "El registro es **individual** por corredor.",
  "Si necesitas ayuda con transporte u hospedaje, menciónalo para poder asistirte.",
  "Si padeces alguna condición o enfermedad crónica, por favor notifícanos."
];

// Default confirmation page message
export const DEFAULT_CONFIRMATION_MESSAGE = "Registro confirmado! Gracias por unirte al 1ER Medio Maratón de Zirahuén 2025. Te hemos enviado un correo de confirmación con todos los detalles del evento.";

// Default confirmation email
export const DEFAULT_CONFIRMATION_EMAIL: ConfirmationEmail = {
  from: "Guardiianes@gmail.com",
  subject: "Registro confirmado - 1ER Medio Maratón de Zirahuén 2025",
  htmlBody: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">¡Gracias por unirte al 1ER Medio Maratón de Zirahuén 2025!</h2>
      
      <p>Hola {{attendee_name}},</p>
      
      <p>Tu registro ha sido confirmado exitosamente. Estamos emocionados de tenerte como parte de este evento especial.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Detalles del Evento</h3>
        <p><strong>Evento:</strong> {{event_title}}</p>
        <p><strong>Fecha principal:</strong> {{primary_event_date}}</p>
        <p><strong>Ubicación:</strong> {{location}}</p>
        <p><strong>Recogida de kit:</strong> {{kit_pickup_date}} en {{kit_pickup_location}}</p>
        <p><strong>Distancia seleccionada:</strong> {{ticket_name}}</p>
      </div>
      
      <p>Al participar en este evento, estás contribuyendo a una causa importante que impacta positivamente a nuestra comunidad.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          #MedioMaratónZirahuén #CorreConCausa
        </p>
      </div>
      
      <p>¡Nos vemos en la línea de salida!</p>
      
      <p>El equipo de OPCIION</p>
    </div>
  `
};
