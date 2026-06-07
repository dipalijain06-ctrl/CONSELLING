import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  ContactSubmission, 
  BookingSubmission, 
  NotificationLog, 
  ValidationError 
} from './src/types';

// In-memory data store for live diagnostics
const contactSubmissions: ContactSubmission[] = [];
const bookingSubmissions: BookingSubmission[] = [];
const notificationLogs: NotificationLog[] = [];

function validateName(name: any): string | null {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }
  const stripped = name.trim();
  if (stripped.length < 2) {
    return 'Name must be at least 2 characters';
  }
  // Allow only alphabets and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(stripped)) {
    return 'Name can only contain alphabets and spaces';
  }
  return null;
}

function validateEmail(email: any): string | null {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

function validatePhone(phone: any): string | null {
  if (!phone || typeof phone !== 'string') {
    return 'Phone number is required';
  }
  const stripped = phone.trim();
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(stripped)) {
    return 'Phone number must be exactly 10 digits and contain only numeric values';
  }
  return null;
}

function validateMessage(message: any): string | null {
  if (!message || typeof message !== 'string') {
    return 'Message is required';
  }
  if (message.trim().length < 10) {
    return 'Message must be at least 10 characters';
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Contact submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;
    const errors: ValidationError[] = [];

    // Server-side validation
    const nameErr = validateName(name);
    if (nameErr) errors.push({ field: 'name', message: nameErr });

    const emailErr = validateEmail(email);
    if (emailErr) errors.push({ field: 'email', message: emailErr });

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push({ field: 'phone', message: phoneErr });

    const messageErr = validateMessage(message);
    if (messageErr) errors.push({ field: 'message', message: messageErr });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const cleanSubmission: ContactSubmission = {
      id: `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    contactSubmissions.push(cleanSubmission);

    // Trigger Simulated Email Notification
    const emailLog: NotificationLog = {
      id: `notif-${Date.now()}-1`,
      type: 'email',
      to: 'nistaran3@gmail.com',
      subject: `New Contact Submission from ${cleanSubmission.name}`,
      content: `Hello Nistaran Team,\n\nYou have received a new contact inquiry:
Name: ${cleanSubmission.name}
Email: ${cleanSubmission.email}
Phone: ${cleanSubmission.phone}
Message: ${cleanSubmission.message}

Submitted at: ${cleanSubmission.createdAt}`,
      timestamp: new Date().toISOString(),
    };
    notificationLogs.push(emailLog);

    // Trigger Simulated Auto-Responder to therapist nistaran3@gmail.com
    console.log('\n=======================================');
    console.log('📬 NEW INBOUND EMAIL SENT TO nistaran3@gmail.com');
    console.log(`From: noreply@nistaran.org`);
    console.log(`Subject: ${emailLog.subject}`);
    console.log(`Content:\n${emailLog.content}`);
    console.log('=======================================\n');

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  });

  // API Route: Book Call submission
  app.post('/api/book-call', (req: Request, res: Response) => {
    const { name, phone, area, preferredContact } = req.body;
    const errors: ValidationError[] = [];

    // Server-side validation
    const nameErr = validateName(name);
    if (nameErr) errors.push({ field: 'name', message: nameErr });

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push({ field: 'phone', message: phoneErr });

    if (!area || typeof area !== 'string' || area.trim() === '') {
      errors.push({ field: 'area', message: 'Counseling area selection is required' });
    }

    const validContactMethods = ['whatsapp', 'call', 'either'];
    if (!preferredContact || !validContactMethods.includes(preferredContact)) {
      errors.push({ field: 'preferredContact', message: 'Preferred contact method is required' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const cleanSubmission: BookingSubmission = {
      id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      phone: phone.trim(),
      area: area.trim(),
      preferredContact: preferredContact as 'whatsapp' | 'call' | 'either',
      createdAt: new Date().toISOString(),
    };

    bookingSubmissions.push(cleanSubmission);

    // Trigger Email Notification to Admin
    const emailLog: NotificationLog = {
      id: `notif-${Date.now()}-2`,
      type: 'email',
      to: 'nistaran3@gmail.com',
      subject: `🚨 Urgent: New Free 15-min Call Booked by ${cleanSubmission.name}`,
      content: `Hello Nistaran Team,\n\nA free introductory call has been requested:
Name: ${cleanSubmission.name}
Phone/WhatsApp: ${cleanSubmission.phone}
Target Area: ${cleanSubmission.area}
Preferred Contact via: ${cleanSubmission.preferredContact}

Action required: Please reach out to setup the 15-minute call.
Booked at: ${cleanSubmission.createdAt}`,
      timestamp: new Date().toISOString(),
    };
    notificationLogs.push(emailLog);

    // Trigger Simulated SMS/WhatsApp Callback Notification to Client
    const callbackLog: NotificationLog = {
      id: `notif-${Date.now()}-3`,
      type: 'callback',
      to: cleanSubmission.phone,
      content: `Hi ${cleanSubmission.name}, thank you for booking a free 15-minute intro consultation with Nistaran Counselling. A certified counsellor will contact you shortly via ${cleanSubmission.preferredContact} regarding your requested session on ${cleanSubmission.area}.`,
      timestamp: new Date().toISOString(),
    };
    notificationLogs.push(callbackLog);

    // Trigger Simulated SMS/WhatsApp Notifications to Counselor Numbers with all booking details
    const counselorNumbers = ['+91 7828689161', '+91 7014364370'];
    counselorNumbers.forEach((num, index) => {
      const counselorLog: NotificationLog = {
        id: `notif-${Date.now()}-counselor-${index}`,
        type: 'callback',
        to: num,
        content: `🚨 Nistaran Alert: New Booking Received!\nClient Name: ${cleanSubmission.name}\nContact Phone: +91 ${cleanSubmission.phone}\nCounseling Support: ${cleanSubmission.area}\nPreferred Channel: ${cleanSubmission.preferredContact}\nRequest Time: ${cleanSubmission.createdAt}`,
        timestamp: new Date().toISOString(),
      };
      notificationLogs.push(counselorLog);
    });

    // Log to terminal
    console.log('\n=======================================');
    console.log('🚨 URGENT BOOKING NOTIFICATIONS DISPATCHED');
    console.log(`Email Send Action Target: nistaran3@gmail.com`);
    console.log(`SMS/WhatsApp Callback Target Client: ${cleanSubmission.phone}`);
    console.log(`SMS/WhatsApp Alerts dispatched to Counselors: ${counselorNumbers.join(', ')}`);
    console.log('=======================================\n');

    return res.status(200).json({
      success: true,
      message: 'Success! Your free 15-minute introductory call has been booked. A counsellor will reach out shortly.',
    });
  });

  // API Route: Diagnostic/Audit endpoints for the client-side Admin dev panel
  app.get('/api/diagnostics', (req: Request, res: Response) => {
    res.json({
      contactSubmissions,
      bookingSubmissions,
      notificationLogs,
    });
  });

  // Clear diagnostics logs (for testing resets)
  app.post('/api/diagnostics/clear', (req: Request, res: Response) => {
    contactSubmissions.length = 0;
    bookingSubmissions.length = 0;
    notificationLogs.length = 0;
    res.json({ success: true, message: 'Logs cleared' });
  });

  // Vite Developer Server Integration / Static Hosting
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isProductionMode = process.env.NODE_ENV === 'production' || indexHtmlExists;

  if (!isProductionMode) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start server', err);
});
