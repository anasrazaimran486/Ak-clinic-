import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import HealthAwareness from './components/HealthAwareness';
import FAQ from './components/FAQ';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import AppointmentModal from './components/AppointmentModal';
import AdminPortal from './components/AdminPortal';
import { Phone, MessageSquare, Calendar, Shield, X, HelpCircle, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const triggerBookModal = (serviceTitle: string = '') => {
    setPreSelectedService(serviceTitle);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    // Show a high-contrast toast notification
    setNotification("Appointment request captured successfully! See details in the voucher.");
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <Home onBookClick={triggerBookModal} setActiveTab={setActiveTab} />;
      case 'about':
        return <About />;
      case 'services':
        return <Services onBookClick={triggerBookModal} />;
      case 'gallery':
        return <Gallery />;
      case 'awareness':
        return <HealthAwareness />;
      case 'faqs':
        return <FAQ />;
      case 'testimonials':
        return <Testimonials />;
      case 'contact':
        return <Contact onSuccess={handleBookingSuccess} />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <Home onBookClick={triggerBookModal} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900" id="ak-clinic-app">
      
      {/* Clinic Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onBookClick={() => triggerBookModal('')} 
      />

      {/* Global Success Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 max-w-sm rounded-xl bg-emerald-600 text-white p-4 shadow-xl flex items-start gap-3 border border-emerald-500 animate-slide-in" id="global-toast">
          <Activity className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-left text-xs">
            <p className="font-bold">Clinical Triage Confirmed</p>
            <p className="mt-0.5 opacity-90">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Dynamic View Content */}
      <main className="flex-grow">
        {renderActiveView()}
      </main>

      {/* Clinic Footer */}
      <Footer 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* CONVERSION & LEAD GENERATION FEATURES */}

      {/* 1. Desktop Sticky Call & WhatsApp sidebar (Hidden on Mobile, shown on md screens up) */}
      <div className="fixed bottom-24 right-6 z-40 hidden md:flex flex-col gap-3" id="desktop-floating-actions">
        {/* Sticky Call Button */}
        <a
          href="tel:+923278259230"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[#E74C4C] text-white shadow-lg hover:bg-[#E74C4C]/95 hover:scale-105 active:scale-95 transition-all group"
          title="Call A K Clinic Support"
        >
          <Phone className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        </a>

        {/* Sticky WhatsApp Button */}
        <a
          href="https://wa.me/923278259230"
          target="_blank"
          rel="noreferrer"
          referrerPolicy="no-referrer"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#25D366]/95 hover:scale-105 active:scale-95 transition-all group"
          title="WhatsApp Patient Desk"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>

        {/* Floating Appointment Button */}
        <button
          onClick={() => triggerBookModal('')}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[#E74C4C] text-white shadow-lg hover:bg-[#E74C4C]/95 hover:scale-105 active:scale-95 transition-all group"
          title="Instant Appointment Booking"
        >
          <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* 2. Mobile Quick Action Bar (Hidden on Desktop/Tablet, fixed at bottom of viewport on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-xl" id="mobile-quick-action-bar">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {/* Quick Call */}
          <a
            href="tel:+923278259230"
            className="flex flex-col items-center justify-center py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all gap-1"
          >
            <Phone className="h-5 w-5 text-[#E74C4C]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Call Now</span>
          </a>

          {/* Quick WhatsApp */}
          <a
            href="https://wa.me/923278259230"
            target="_blank"
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="flex flex-col items-center justify-center py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all gap-1"
          >
            <MessageSquare className="h-5 w-5 text-[#25D366]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">WhatsApp</span>
          </a>

          {/* Quick Booking */}
          <button
            onClick={() => triggerBookModal('')}
            className="flex flex-col items-center justify-center py-3 text-gray-700 hover:bg-[#E74C4C]/5 active:bg-[#E74C4C]/10 transition-all gap-1"
          >
            <Calendar className="h-5 w-5 text-[#E74C4C]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Book OPD</span>
          </button>
        </div>
      </div>

      {/* Universal Patient Consultation Modal */}
      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        preSelectedService={preSelectedService}
        onSuccess={handleBookingSuccess}
      />

    </div>
  );
}
