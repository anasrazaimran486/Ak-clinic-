import React from 'react';
import { Mail, Phone, MapPin, Facebook, MessageSquare, Lock, Heart } from 'lucide-react';
import { CLINIC_INFO } from '../data';
import ClinicLogo from './ClinicLogo';

interface FooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Footer({ activeTab, setActiveTab }: FooterProps) {
  
  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900" id="main-clinic-footer">
      
      {/* Top Footer Segment (4 columns grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & Tagline */}
        <div className="space-y-4 text-left">
          <ClinicLogo size={36} showText={true} textColor="text-white" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Quality Healthcare with Compassion & Care. Providing dedicated OPD diagnostics, free blood pressure checking, weight monitors, and pediatric clinical consultation.
          </p>
          
          {/* Social Icons row */}
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-all"
              aria-label="Visit Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a 
              href={CLINIC_INFO.whatsappLink} 
              target="_blank" 
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-lg bg-gray-900 border border-gray-800 hover:border-[#25D366] text-gray-400 hover:text-[#25D366] flex items-center justify-center transition-all"
              aria-label="Connect on WhatsApp"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
            <a 
              href={`mailto:${CLINIC_INFO.email}`}
              className="h-8 w-8 rounded-lg bg-gray-900 border border-gray-800 hover:border-[#E74C4C] text-gray-400 hover:text-[#E74C4C] flex items-center justify-center transition-all"
              aria-label="Send Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            {quickLinks.map(lnk => (
              <li key={lnk.id}>
                <button
                  onClick={() => handleLinkClick(lnk.id)}
                  className={`hover:text-white transition-all focus:outline-none ${activeTab === lnk.id ? 'text-[#E74C4C] font-bold' : ''}`}
                >
                  {lnk.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Clinic Contact Lines */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Outpatient Helplines
          </h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex gap-2.5 items-start">
              <Phone className="h-4 w-4 text-[#E74C4C] shrink-0 mt-0.5" />
              <div>
                <a href="tel:+923278259230" className="hover:text-white font-semibold block">
                  +92 327 8259230
                </a>
                <a href="tel:+9278259230" className="hover:text-white block mt-0.5">
                  +92 78 25 92 30
                </a>
              </div>
            </li>
            <li className="flex gap-2.5 items-start">
              <Mail className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
              <a href="mailto:a.k.clinicofficial@gmail.com" className="hover:text-white truncate">
                {CLINIC_INFO.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Physical Location */}
        <div className="space-y-4 text-left">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Physical Address
          </h4>
          <div className="flex gap-2.5 items-start text-xs text-gray-400">
            <MapPin className="h-4.5 w-4.5 text-[#E74C4C] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Hijri Road near Sania Tower, opposite Incholi Society Gate, Karachi, Pakistan 76000
            </p>
          </div>
          <div className="pt-2 text-[10px] text-gray-500">
            <span>OPD Consultation Hours:</span>
            <span className="block font-semibold mt-0.5 text-gray-400">05:00 PM - 09:30 PM (Mon-Sat)</span>
          </div>
        </div>

      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-gray-900 pt-6 pb-24 md:pb-6 px-4 bg-gray-950" id="footer-bottom-bar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            <span>© 2026 A K Clinic. All Rights Reserved.</span>
          </div>
          
          {/* Subtle credits with admin trigger */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>Made for health with</span>
              <Heart className="h-3 w-3 text-[#E74C4C] fill-current" />
            </span>
            <span>•</span>
            
            {/* Discreet Admin Portal Entry */}
            <button
              onClick={() => handleLinkClick('admin')}
              className={`flex items-center gap-1.5 hover:text-white transition-all text-[11px] font-semibold ${
                activeTab === 'admin' ? 'text-[#E74C4C]' : ''
              }`}
              id="admin-portal-footer-trigger"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
