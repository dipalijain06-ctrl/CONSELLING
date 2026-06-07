import React, { useState } from 'react';
import { ValidationError } from '../types';

interface ContactFormProps {
  onSuccessTriggered: () => void;
}

export default function ContactForm({ onSuccessTriggered }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<{ name: string; message: string } | null>(null);

  // Client validations according to constraints
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Name Field: Required, Min 2, only alphabets and spaces
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name can only contain alphabets and spaces';
    }

    // 2. Email Field: Required, valid format
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    // 3. Phone Field: Required, exactly 10 digits, numeric only
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(cleanPhone)) {
      newErrors.phone = 'Phone number must contain only numeric characters';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // 4. Message Field: Required, min 10 characters
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const apiValidationErrors: Record<string, string> = {};
          data.errors.forEach((err: ValidationError) => {
            apiValidationErrors[err.field] = err.message;
          });
          setErrors(apiValidationErrors);
          throw new Error('Server detected validation errors.');
        } else {
          throw new Error(data.message || 'Server returned an error.');
        }
      }

      setLatestSubmission({ name: name.trim(), message: message.trim() });
      setApiSuccess(data.message || 'Message sent successfully!');
      
      // Clear inputs
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setErrors({});
      onSuccessTriggered(); // trigger diagnostic logs feed update
    } catch (err: any) {
      setApiError(err.message || 'Failed to submit form. Check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (apiSuccess) {
    const counselorWhatsAppNo = '917828689161';
    const whatsappMsgText = `Hello Nistaran Counselling, I have sent a contact message!\n\nName: ${latestSubmission?.name || 'Inquirer'}\nMessage: "${latestSubmission?.message || ''}"\n\nPlease let me know when we can connect.`;
    const whatsappHref = `https://wa.me/${counselorWhatsAppNo}?text=${encodeURIComponent(whatsappMsgText)}`;

    return (
      <div className="bg-[#1c2b24] text-[#faf7f2] border border-sage/20 rounded-3xl p-6 md:p-8 shadow-xl max-w-lg mx-auto text-center font-sans" id="contact-success-card">
        <div className="w-16 h-16 bg-cream/10 text-[#faf7f2] rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner">
          ✉️
        </div>
        <h3 className="font-serif text-2xl text-[#eae0d5] font-bold mb-3">
          Message Sent Successfully!
        </h3>
        <p className="text-sage-light text-xs md:text-sm mb-6 leading-relaxed">
          Your inquiry has been stored securely in our counselor logs under strict confidentiality rule sets. We will review your message shortly.
        </p>

        {/* Client-to-Counselor Direct WhatsApp Action */}
        <div className="bg-cream/5 p-4 rounded-2xl border border-sage/20 mb-6">
          <p className="text-xs text-sage/90 mb-3 font-semibold">
            ⚡ Want a Real-time Conversation Now?
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all font-bold text-sm rounded-full shadow-lg cursor-pointer"
          >
            💬 Send Message on WhatsApp
          </a>
          <p className="text-[10px] text-sage/70 mt-2 text-center leading-normal">
            Bypasses email cues and opens a secure chat session immediately on WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            setApiSuccess(null);
            setLatestSubmission(null);
          }}
          className="text-xs text-[#faf7f2]/60 hover:text-[#faf7f2] underline transition-colors cursor-pointer"
        >
          &larr; Write Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[rgba(90,122,106,0.1)] rounded-3xl p-6 md:p-8 shadow-sm" id="contact-form-card">
      <h3 className="font-serif text-2xl text-sage-dark font-medium mb-4">
        Send Us a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate id="contact-form">
        
        {/* Name Field */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-sage-dark uppercase tracking-wider mb-1">
            Full Name <span className="text-warm font-bold">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="e.g. Rahul Sen"
            value={name}
            disabled={isSubmitting}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors(prev => {
                  const copy = { ...prev };
                  delete copy.name;
                  return copy;
                });
              }
            }}
            className={`w-full px-4 py-2.5 rounded-full border text-sm font-sans outline-none bg-cream/20 text-[#1c2b24] transition-all ${
              errors.name 
                ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                : 'border-sage/20 focus:border-sage'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 pl-3 font-medium animate-pulse" id="contact-name-error">
              ⚠️ {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-sage-dark uppercase tracking-wider mb-1">
            Email Address <span className="text-warm font-bold">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="e.g. rahul@domain.com"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors(prev => {
                  const copy = { ...prev };
                  delete copy.email;
                  return copy;
                });
              }
            }}
            className={`w-full px-4 py-2.5 rounded-full border text-sm font-sans outline-none bg-cream/20 text-[#1c2b24] transition-all ${
              errors.email 
                ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                : 'border-sage/20 focus:border-sage'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 pl-3 font-medium animate-pulse" id="contact-email-error">
              ⚠️ {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="contact-phone" className="block text-xs font-semibold text-sage-dark uppercase tracking-wider mb-1">
            Phone Number <span className="text-warm font-bold">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted/80 font-sans">
              +91
            </span>
            <input
              id="contact-phone"
              type="tel"
              placeholder="98XXXXXXXX"
              value={phone}
              disabled={isSubmitting}
              maxLength={10}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, '');
                setPhone(numericOnly);
                if (errors.phone) {
                  setErrors(prev => {
                    const copy = { ...prev };
                    delete copy.phone;
                    return copy;
                  });
                }
              }}
              className={`w-full pl-12 pr-4 py-2.5 rounded-full border text-sm font-sans outline-none bg-cream/20 text-[#1c2b24] transition-all ${
                errors.phone 
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                  : 'border-sage/20 focus:border-sage'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 pl-3 font-medium animate-pulse" id="contact-phone-error">
              ⚠️ {errors.phone}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold text-sage-dark uppercase tracking-wider mb-1">
            How can we help? <span className="text-warm font-bold">*</span>
          </label>
          <textarea
            id="contact-message"
            placeholder="Please write down your concerns or questions..."
            value={message}
            disabled={isSubmitting}
            rows={4}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) {
                setErrors(prev => {
                  const copy = { ...prev };
                  delete copy.message;
                  return copy;
                });
              }
            }}
            className={`w-full px-4 py-3 rounded-2xl border text-sm font-sans outline-none bg-cream/20 text-[#1c2b24] transition-all resize-none ${
              errors.message 
                ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                : 'border-sage/20 focus:border-sage'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1 pl-3 font-medium animate-pulse" id="contact-message-error">
              ⚠️ {errors.message}
            </p>
          )}
        </div>

        {/* Error/Success Alert Box */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium" id="contact-api-error">
            {apiError}
          </div>
        )}
        {apiSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium" id="contact-api-success">
            ✨ {apiSuccess}
          </div>
        )}

        {/* Submit button */}
        <button
          id="contact-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sage-dark text-white rounded-full font-sans font-semibold py-3 transition-all flex items-center justify-center gap-2 text-sm shadow-sm md:hover:bg-sage cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting Inquiry...</span>
            </>
          ) : (
            <span>Send Message &rarr;</span>
          )}
        </button>
      </form>
    </div>
  );
}
