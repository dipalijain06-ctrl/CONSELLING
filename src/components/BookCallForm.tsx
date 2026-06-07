import React, { useState } from 'react';
import { ValidationError } from '../types';

interface BookCallFormProps {
  onSuccessTriggered: () => void;
}

export default function BookCallForm({ onSuccessTriggered }: BookCallFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Mental Health Counselling');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call' | 'either'>('whatsapp');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<{ name: string; area: string } | null>(null);

  // Client-side validations
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name Validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must only contain alphabets and spaces';
    }

    // Phone Validation
    const strippedPhone = phone.trim();
    if (!strippedPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(strippedPhone)) {
      newErrors.phone = 'Phone number must only contain digits';
    } else if (strippedPhone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Area Validation
    if (!area) {
      newErrors.area = 'Please select a counseling area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    // Run client side checks
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/book-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area,
          preferredContact,
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
          throw new Error('Validation failed server-side');
        } else {
          throw new Error(data.message || 'An unexpected server error occurred.');
        }
      }

      setLatestBooking({ name: name.trim(), area });
      setApiSuccess(data.message || 'Call successfully booked!');
      
      // Reset form on success
      setName('');
      setPhone('');
      setErrors({});
      onSuccessTriggered(); // update diagnostics log viewer
    } catch (err: any) {
      setApiError(err.message || 'Could not connect to the booking server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (apiSuccess) {
    const counselorWhatsAppNo = '917828689161';
    const whatsappMsgText = `Hello Nistaran Counselling, I have just booked my free consultation!\n\nName: ${latestBooking?.name || 'Client'}\nCounseling Area: ${latestBooking?.area || 'Support'}\n\nPlease let me know when we can connect.`;
    const whatsappHref = `https://wa.me/${counselorWhatsAppNo}?text=${encodeURIComponent(whatsappMsgText)}`;

    return (
      <div className="bg-[#1c2b24] text-[#faf7f2] border border-sage/20 rounded-3xl p-6 md:p-8 shadow-xl max-w-lg mx-auto text-center font-sans" id="booking-success-card">
        <div className="w-16 h-16 bg-cream/10 text-[#faf7f2] rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner">
          ✨
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-[#eae0d5] font-bold mb-3">
          Call Booking Received!
        </h3>
        <p className="text-sage-light text-xs md:text-sm mb-6 leading-relaxed">
          Your free introductory session has been registered under India's strict client privacy guidelines. We will contact you back shortly.
        </p>

        {/* Real Dynamic WhatsApp CTA Action */}
        <div className="bg-cream/5 p-4 rounded-2xl border border-sage/20 mb-6">
          <p className="text-xs text-sage/90 mb-3 font-semibold">
            ⚡ Want to Connect with Counselor Immediately?
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] active:scale-95 transition-all font-bold text-sm rounded-full shadow-lg cursor-pointer"
          >
            💬 Open Chat & Send on WhatsApp
          </a>
          <p className="text-[10px] text-sage/70 mt-2 text-center leading-normal">
            Launches our official support helpline chat directly in your WhatsApp.
          </p>
        </div>

        <button
          onClick={() => {
            setApiSuccess(null);
            setLatestBooking(null);
          }}
          className="text-xs text-[#faf7f2]/60 hover:text-[#faf7f2] underline transition-colors cursor-pointer"
        >
          &larr; Book Another Counseling Slot
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[rgba(90,122,106,0.12)] rounded-3xl p-6 md:p-8 shadow-md max-w-lg mx-auto" id="book-call-card">
      <h3 className="font-serif text-2xl md:text-3xl text-sage-dark font-semibold mb-2">
        Schedule Your Free Call
      </h3>
      <p className="text-muted text-sm mb-6 leading-relaxed">
        Our consultation is virtual, completely free, and strictly confidential. Let us know how to reach you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate id="booking-form">
        {/* Name Field */}
        <div>
          <label htmlFor="booking-name" className="block text-xs font-medium text-sage-dark uppercase tracking-wider mb-1">
            Full Name <span className="text-warm font-bold">*</span>
          </label>
          <input
            id="booking-name"
            type="text"
            placeholder="e.g. Priya Sharma"
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
            className={`w-full px-4 py-2.5 rounded-full border text-sm font-sans outline-none bg-cream/30 text-[#1c2b24] transition-all ${
              errors.name 
                ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                : 'border-sage/20 focus:border-sage'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 pl-3 align-middle font-medium" id="booking-name-error">
              ⚠️ {errors.name}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="booking-phone" className="block text-xs font-medium text-sage-dark uppercase tracking-wider mb-1">
            Phone / WhatsApp Number <span className="text-warm font-bold">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted/80 font-sans">
              +91
            </span>
            <input
              id="booking-phone"
              type="tel"
              placeholder="7XXXX XXXXX"
              value={phone}
              disabled={isSubmitting}
              maxLength={10}
              onChange={(e) => {
                // Keep only numeric
                const cleanInput = e.target.value.replace(/\D/g, '');
                setPhone(cleanInput);
                if (errors.phone) {
                  setErrors(prev => {
                    const copy = { ...prev };
                    delete copy.phone;
                    return copy;
                  });
                }
              }}
              className={`w-full pl-12 pr-4 py-2.5 rounded-full border text-sm font-sans outline-none bg-cream/30 text-[#1c2b24] transition-all ${
                errors.phone 
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
                  : 'border-sage/20 focus:border-sage'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 pl-3 font-medium" id="booking-phone-error">
              ⚠️ {errors.phone}
            </p>
          )}
        </div>

        {/* Counseling Area Selector */}
        <div>
          <label htmlFor="booking-area" className="block text-xs font-medium text-sage-dark uppercase tracking-wider mb-1">
            Support Needed For <span className="text-warm font-bold">*</span>
          </label>
          <select
            id="booking-area"
            value={area}
            disabled={isSubmitting}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full border border-sage/20 focus:border-sage text-sm font-sans outline-none bg-white text-[#1c2b24] transition-all cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%235a7a6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
          >
            <option value="Mental Health Counselling">Mental Health Counselling (Anxiety & Stress)</option>
            <option value="Career & Student Counselling">Career & Student Counselling (Guidance)</option>
            <option value="Marriage & Relationship">Marriage & Relationship Counselling</option>
            <option value="Life Coaching & Motivation">Life Coaching & Motivation</option>
            <option value="Emotional & Spiritual Counselling">Emotional & Spiritual Support</option>
          </select>
        </div>

        {/* Preferred Connection Method */}
        <div>
          <label className="block text-xs font-medium text-sage-dark uppercase tracking-wider mb-2">
            Preferred Way To Connect <span className="text-warm font-bold">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['whatsapp', 'call', 'either'] as const).map((method) => (
              <label
                key={method}
                className={`flex items-center justify-center p-2 rounded-full border text-xs font-medium cursor-pointer transition-all select-none ${
                  preferredContact === method
                    ? 'border-sage bg-sage-light text-sage-dark shadow-sm'
                    : 'border-sage/20 bg-transparent text-muted hover:bg-sage-light/30'
                }`}
              >
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  disabled={isSubmitting}
                  checked={preferredContact === method}
                  onChange={() => setPreferredContact(method)}
                  className="sr-only"
                />
                <span className="capitalize">
                  {method === 'either' ? 'Any Method' : method}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Success/Error API notification alerts */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium" id="booking-api-error">
            {apiError}
          </div>
        )}
        {apiSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium shadow-sm" id="booking-api-success">
            ✨ {apiSuccess}
          </div>
        )}

        {/* Action Button */}
        <button
          id="booking-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sage-dark text-white rounded-full font-sans font-semibold py-3 transition-all flex items-center justify-center gap-2 text-sm shadow-sm md:hover:bg-sage md:hover:shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Booking Call...</span>
            </>
          ) : (
            <span>Book Free Call &rarr;</span>
          )}
        </button>

        <p className="text-center text-[11px] text-muted leading-none">
          ✓ Free Call &nbsp; · &nbsp; ✓ Strictly Private &nbsp; · &nbsp; ✓ Zoom / Meet / WhatsApp
        </p>
      </form>
    </div>
  );
}
