import React, { useState } from 'react';
import { Menu, X, Phone, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { CLINIC_INFO } from '../data';
import ClinicLogo from './ClinicLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onBookClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'awareness', label: 'Health Awareness' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm" id="main-clinic-header">
      {/* Top Clinical Ribbon */}
      <div className="bg-gradient-to-r from-[#E74C4C] to-[#EF4444] text-white py-2 px-4 text-xs font-medium" id="clinic-top-ribbon">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-red-100" />
              <span>OPD Timings: Mon - Sat (05:00 PM - 09:30 PM)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-100">Emergency Call:</span>
            <a href="tel:+923278259230" className="hover:underline font-bold transition-all flex items-center gap-1">
              <Phone className="h-3 w-3 shrink-0" />
              <span>+92 327 8259230</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between" id="navbar-main">
        {/* Brand Logo Accent */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="logo-container"
        >
          <ClinicLogo size={44} showText={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-menu">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === item.id
                  ? 'text-[#E74C4C] bg-[#E74C4C]/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#E74C4C] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop CTA Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onBookClick}
            className="rounded-lg bg-[#E74C4C] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#E74C4C]/90 active:scale-[0.98] transition-all"
            id="nav-book-apt-btn"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition-all"
          aria-label="Toggle Navigation Menu"
          id="mobile-menu-burger"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Panel */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white" id="mobile-nav-panel">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-between transition-all ${
                  activeTab === item.id
                    ? 'text-[#E74C4C] bg-[#E74C4C]/5 border-l-4 border-[#E74C4C]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-55" />
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onBookClick();
                }}
                className="w-full flex justify-center rounded-lg bg-[#E74C4C] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#E74C4C]/90 transition-all"
                id="mobile-drawer-book-btn"
              >
                Book Appointment
              </button>
              <a
                href="tel:+923278259230"
                className="w-full flex justify-center items-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>Call Quick Assistance</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
