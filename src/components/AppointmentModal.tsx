import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CheckCircle, Phone, ArrowRight, Stethoscope } from 'lucide-react';
import { SERVICES } from '../data';
import { AppointmentRequest } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
  onSuccess?: () => void;
}

export default function AppointmentModal({ isOpen, onClose, preSelectedService = '', onSuccess }: AppointmentModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(preSelectedService || SERVICES[0].title);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('05:30 PM - 06:00 PM');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<AppointmentRequest | null>(null);

  React.useEffect(() => {
    if (preSelectedService) {
      setService(preSelectedService);
    }
  }, [preSelectedService]);

  const timeSlots = [
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM",
    "06:00 PM - 06:30 PM",
    "06:30 PM - 07:00 PM",
    "07:00 PM - 07:30 PM",
    "07:30 PM - 08:00 PM",
    "08:00 PM - 08:30 PM",
    "08:30 PM - 09:00 PM",
    "09:00 PM - 09:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert("Please fill in your name and phone number so we can contact you.");
      return;
    }

    setIsSubmitting(true);

    // Simulate clinical dispatch delay for realistic trust building
    setTimeout(() => {
      const newRequest: AppointmentRequest = {
        id: 'APT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        fullName,
        phone,
        email: email || 'No email provided',
        service,
        date: date || new Date().toISOString().split('T')[0],
        timeSlot,
        message,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existing = localStorage.getItem('ak_clinic_appointments');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRequest);
      localStorage.setItem('ak_clinic_appointments', JSON.stringify(list));

      setSubmittedRequest(newRequest);
      setIsSubmitting(false);

      // Trigger custom success tracking
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setService(SERVICES[0].title);
    setDate('');
    setTimeSlot('05:30 PM - 06:00 PM');
    setMessage('');
    setSubmittedRequest(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-start justify-center md:items-center" id="appointment-modal-overlay">
          {/* Backdrop with elegant blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl my-4 md:my-8"
          >
            {/* Elegant Header Accent */}
            <div className="h-2 bg-gradient-to-r from-[#E74C4C] via-[#EF4444] to-[#F87171]" />

            <button
              onClick={handleReset}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              aria-label="Close modal"
              id="close-modal-btn"
            >
              <X className="h-6 w-6" />
            </button>

            {!submittedRequest ? (
              <div className="p-6 md:p-8" id="appointment-form-container">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#E74C4C]/10 px-3 py-1 text-sm font-semibold text-[#E74C4C]">
                    <Stethoscope className="h-4 w-4" />
                    <span>Appointment Request</span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold font-display text-gray-900">
                    Consultation Booking
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fill out the form below. Our medical assistant will contact you to confirm your timing slot.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="e.g. Muhammad Ahmed"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all"
                      id="input-full-name"
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all"
                        id="input-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. email@example.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all"
                        id="input-email"
                      />
                    </div>
                  </div>

                  {/* Service Needed */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Healthcare Service Needed
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all bg-white"
                      id="select-service"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Slot Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all"
                          id="input-date"
                        />
                        <Calendar className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Time Slot
                      </label>
                      <div className="relative">
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all bg-white"
                          id="select-timeslot"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <Clock className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Brief Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Brief Message or Symptoms (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the patient or any symptoms (e.g. fever, seasonal checkup)"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all resize-none"
                      id="input-message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E74C4C] to-[#EF4444] px-4 py-3 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-75 shadow-md shadow-[#E74C4C]/10"
                    id="submit-appointment-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting request...
                      </span>
                    ) : (
                      <>
                        <span>Submit Appointment Request</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-8 text-center"
                id="appointment-success-container"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-10 w-10" />
                </div>

                <h3 className="mt-4 text-2xl font-bold font-display text-gray-950">
                  Request Received!
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your appointment request has been recorded. Our healthcare manager is reviewing clinical slots.
                </p>

                {/* Patient Voucher */}
                <div className="my-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-left font-mono text-xs text-gray-700">
                  <div className="flex justify-between border-b border-gray-200 pb-2 mb-2 font-bold text-gray-900 uppercase">
                    <span>Reference Ticket</span>
                    <span className="text-[#E74C4C]">{submittedRequest.id}</span>
                  </div>
                  <div className="space-y-1.5">
                    <p><span className="text-gray-400">Patient:</span> <strong className="text-gray-900">{submittedRequest.fullName}</strong></p>
                    <p><span className="text-gray-400">Phone:</span> <strong className="text-gray-900">{submittedRequest.phone}</strong></p>
                    <p><span className="text-gray-400">Service:</span> <strong className="text-gray-900">{submittedRequest.service}</strong></p>
                    <p><span className="text-gray-400">Date:</span> <strong className="text-gray-900">{submittedRequest.date}</strong></p>
                    <p><span className="text-gray-400">Time Window:</span> <strong className="text-gray-900">{submittedRequest.timeSlot}</strong></p>
                    <p><span className="text-gray-400">Status:</span> <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 uppercase tracking-wider font-sans">Pending Call</span></p>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-50 p-3.5 text-xs text-emerald-800 text-left mb-6 flex gap-2.5 items-start">
                  <Phone className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">What happens next?</span>
                    We will ring you shortly on <strong className="underline">{submittedRequest.phone}</strong> to confirm your slot. If urgent, feel free to tap the WhatsApp button below.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/923278259230"
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-105 active:scale-[0.98] transition-all"
                  >
                    <span>Instant WhatsApp</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-[0.98] transition-all"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
