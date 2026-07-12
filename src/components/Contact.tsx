import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Stethoscope, MessageSquare } from 'lucide-react';
import { CLINIC_INFO, SERVICES } from '../data';
import { AppointmentRequest } from '../types';
import { db, doc, setDoc } from '../lib/firebase';

interface ContactProps {
  onSuccess?: () => void;
}

export default function Contact({ onSuccess }: ContactProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(SERVICES[0].title);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      const newId = 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const newRequest: AppointmentRequest = {
        id: newId,
        fullName,
        phone,
        email: 'No email provided',
        service,
        date: new Date().toISOString().split('T')[0],
        timeSlot: "05:30 PM - 06:00 PM (Default)",
        message,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      try {
        // Save to Firebase Firestore
        await setDoc(doc(db, 'appointments', newRequest.id), newRequest);
      } catch (err) {
        console.error("Error saving contact request to Firebase Firestore:", err);
      }

      // Save to localStorage
      const existing = localStorage.getItem('ak_clinic_appointments');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRequest);
      localStorage.setItem('ak_clinic_appointments', JSON.stringify(list));

      setTicketId(newId);
      setSuccess(true);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess();
      }

      // Reset form states
      setFullName('');
      setPhone('');
      setService(SERVICES[0].title);
      setMessage('');
    }, 1200);
  };

  return (
    <div className="bg-white py-12 md:py-20" id="contact-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Connect Now</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
            Contact A K Clinic
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Send an appointment request, explore clinic locations, or call our outpatient medical desk directly.
          </p>
        </div>

        {/* Master Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16" id="contact-elements-grid">
          
          {/* Left Side: Contact Information & Hours (5cols) */}
          <div className="lg:col-span-5 space-y-6 text-left" id="contact-info-panel">
            <h2 className="text-2xl font-bold font-display text-gray-950">
              Get in Touch Directly
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We operate an appointment-based outpatient clinic in Karachi. Feel free to visit or contact us through any of the active channels below:
            </p>

            <div className="space-y-4">
              {/* Address card */}
              <div className="rounded-xl border border-gray-200 p-4 bg-slate-50 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Clinic Address</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Hijri Road near Sania Tower, opposite Incholi Society Gate, Karachi, Pakistan 76000
                  </p>
                </div>
              </div>

              {/* Phone card */}
              <div className="rounded-xl border border-gray-200 p-4 bg-slate-50 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Phone Numbers</h4>
                  <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1">
                    <a href="tel:+923278259230" className="hover:underline hover:text-gray-900 font-semibold">
                      +92 327 8259230 (WhatsApp Support)
                    </a>
                    <a href="tel:+9278259230" className="hover:underline">
                      +92 78 25 92 30 (Alternate OPD Line)
                    </a>
                  </div>
                </div>
              </div>

              {/* Email card */}
              <div className="rounded-xl border border-gray-200 p-4 bg-slate-50 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">Email Support</h4>
                  <a href="mailto:a.k.clinicofficial@gmail.com" className="text-xs text-[#EF4444] hover:underline block mt-1">
                    {CLINIC_INFO.email}
                  </a>
                </div>
              </div>

              {/* Timing card */}
              <div className="rounded-xl border border-gray-200 p-4 bg-slate-50 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-950">OPD Consultation Hours</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Monday - Saturday: 05:00 PM - 09:30 PM
                  </p>
                  <span className="inline-block mt-1.5 rounded bg-amber-100 text-[9px] font-bold text-amber-800 px-2 py-0.5 uppercase tracking-wider">
                    Closed on Sundays
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Appointment Request Form (7cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-gray-200 rounded-2xl p-6 md:p-8 text-left" id="contact-form-panel">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-xl font-bold font-display text-gray-950">
                    Send Appointment Request
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide active contact information so we can dispatch clinical confirmation.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-[#E74C4C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bilal Raza"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none bg-white transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number <span className="text-[#E74C4C]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 03278259230"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none bg-white transition-all"
                  />
                </div>

                {/* Service Needed */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Service Needed
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none bg-white transition-all"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brief Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Message or Medical Concerns
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter details of your symptoms or preferred consultation timings."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none bg-white resize-none transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E74C4C] to-[#EF4444] px-5 py-3 font-semibold text-white hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-75 shadow-md shadow-[#E74C4C]/15"
                  id="contact-form-submit-btn"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4.5 w-4.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Transmitting Inquiry...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4.5 w-4.5" />
                      <span>Send Appointment Request</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
                id="contact-form-success"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950 font-display">Request Sent!</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your clinical inquiry has been processed successfully. Your Reference Ticket ID is <strong className="font-mono text-gray-950 bg-gray-200 px-2 py-0.5 rounded">{ticketId}</strong>.
                </p>
                <p className="text-xs text-gray-400">
                  A K Clinic's medical coordinator will call or message your mobile line within 1 hour to schedule your slot.
                </p>
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Send Another Request
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </div>

        {/* Google Maps Section with real embed showing the specified location */}
        <div className="border-t border-gray-100 pt-16" id="google-maps-embed-panel">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold font-display text-gray-900">
              Our Location in Karachi
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Located on Hijri Road, very near to Sania Tower and right opposite to the Incholi Society main gate.
            </p>
          </div>

          {/* Map Frame Container */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-slate-100 h-96 relative">
            <iframe
              title="A K Clinic Karachi Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9023348123284!2d67.0782354!3d24.9354085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f67a2cb69df%3A0xc66cbb41132ba065!2sSania%20Tower%2C%20Block%2014%20Gulberg%20Town%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
