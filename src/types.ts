export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface BookingSubmission {
  id: string;
  name: string;
  phone: string;
  area: string;
  preferredContact: 'whatsapp' | 'call' | 'either';
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'email' | 'callback';
  to: string;
  subject?: string;
  content: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
}
