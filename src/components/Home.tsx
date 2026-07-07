import React from 'react';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Activity, 
  Scale, 
  Heart, 
  Baby, 
  Wind, 
  ShieldAlert, 
  CalendarClock, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { SERVICES, CLINIC_INFO } from '../data';
import ClinicLogo from './ClinicLogo';

// Helper component to render specific Lucide icons from strings
export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string, className?: string }) {
  switch (name) {
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Wind': return <Wind className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'CalendarClock': return <CalendarClock className={className} />;
    default: return <Stethoscope className={className} />;
  }
}

interface HomeProps {
  onBookClick: (serviceTitle?: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Home({ onBookClick, setActiveTab }: HomeProps) {
  
  const features = [
    {
      title: "Clean & Safe Environment",
      description: "Comfortable and hygienic clinic setting focused on patient wellbeing.",
      icon: <ShieldCheck className="h-6 w-6 text-[#E74C4C]" />,
      color: "bg-[#E74C4C]/10"
    },
    {
      title: "Experienced Medical Care",
      description: "Professional consultation and healthcare guidance.",
      icon: <Award className="h-6 w-6 text-[#EF4444]" />,
      color: "bg-[#EF4444]/10"
    },
    {
      title: "Free Vital Checks",
      description: "Blood Pressure, Weight & Pulse Check before consultation.",
      icon: <Activity className="h-6 w-6 text-[#E74C4C]" />,
      color: "bg-[#E74C4C]/10"
    },
    {
      title: "Patient-Centered Care",
      description: "Compassionate treatment for children, adults and seniors.",
      icon: <Heart className="h-6 w-6 text-emerald-600" />,
      color: "bg-emerald-100/60"
    }
  ];

  return (
    <div id="home-tab-view">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E74C4C]/5 via-white to-white py-16 lg:py-24" id="hero-section">
        {/* Subtle decorative circles for modern tech-clinic theme */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#E74C4C]/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-[#E74C4C]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E74C4C]/10 px-3.5 py-1.5 text-xs font-bold text-[#E74C4C]">
                <Sparkles className="h-3.5 w-3.5 text-[#E74C4C] animate-pulse" />
                <span>Now Booking OPD Consultations in Karachi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-gray-900 leading-tight">
                Trusted Healthcare for <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E74C4C] to-[#EF4444]">
                  You & Your Family
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                A clean and professional OPD clinic in Karachi offering quality consultations, 
                <strong className="text-gray-900"> free blood pressure checks, weight monitoring, pulse assessments</strong>, 
                and personalized patient care in a comfortable environment.
              </p>

              {/* Patient Quick Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Free Vital Signs Checkup</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Hygienic Consultation Area</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Appointment-Based (No long waits)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Pediatric & Respiratory Care</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => onBookClick()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E74C4C] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#E74C4C]/15 hover:bg-[#E74C4C]/95 hover:translate-y-[-1px] transition-all"
                  id="hero-book-btn"
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a
                  href="tel:+923278259230"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-4 text-base font-bold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
                  id="hero-call-btn"
                >
                  <Phone className="h-5 w-5 text-[#E74C4C]" />
                  <span>Call: +92 327 8259230</span>
                </a>
              </div>

              {/* Highlight Contact info */}
              <div className="pt-2 text-xs text-gray-400">
                <span>Address: Hijri Road near Sania Tower, opposite Incholi Society Gate, Karachi.</span>
              </div>
            </div>

            {/* Right Column: Visual Graphic (Trust-building clinical panel) */}
            <div className="lg:col-span-5 relative" id="hero-graphic-container">
              <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
                {/* Back decorative colored card */}
                <div className="absolute inset-0 transform translate-x-3 translate-y-3 rounded-2xl bg-gradient-to-br from-[#E74C4C] to-[#EF4444] opacity-10 pointer-events-none" />
                
                {/* Main Visual Card */}
                <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-xl space-y-6">
                  {/* Doctor Profile Banner */}
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <ClinicLogo size={56} showText={false} className="shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 font-display">A K Clinic Outpatient Care</h4>
                      <p className="text-xs text-gray-500">Quality consultations with experienced physicians</p>
                    </div>
                  </div>

                  {/* Free BP, Weight, Heart check banner */}
                  <div className="bg-[#F7FAFC] rounded-xl p-4 border border-dashed border-[#E74C4C]/20">
                    <span className="block text-[10px] font-bold text-[#E74C4C] uppercase tracking-wider mb-2">Patient Entry Protocol</span>
                    <h5 className="font-bold text-sm text-gray-900 mb-2">Complimentary Vital Sign Checks</h5>
                    
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-white rounded-lg p-2.5 text-center shadow-xs border border-gray-100">
                        <Activity className="h-5 w-5 text-[#E74C4C] mx-auto mb-1" />
                        <span className="block text-[10px] font-bold text-gray-900 leading-tight">Blood Pressure</span>
                        <span className="block text-[9px] text-gray-400">Free Check</span>
                      </div>
                      <div className="bg-white rounded-lg p-2.5 text-center shadow-xs border border-gray-100">
                        <Scale className="h-5 w-5 text-[#E74C4C] mx-auto mb-1" />
                        <span className="block text-[10px] font-bold text-gray-900 leading-tight">Body Weight</span>
                        <span className="block text-[9px] text-gray-400">Free Check</span>
                      </div>
                      <div className="bg-white rounded-lg p-2.5 text-center shadow-xs border border-gray-100">
                        <Heart className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                        <span className="block text-[10px] font-bold text-gray-900 leading-tight">Pulse Rate</span>
                        <span className="block text-[9px] text-gray-400">Free Check</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time booking indicator widget */}
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 border border-emerald-100">
                    <div className="flex items-center gap-2.5 text-xs text-emerald-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>Accepting Consultation Requests Today</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-emerald-700 bg-white rounded px-1.5 py-0.5 border border-emerald-200">
                      Mon - Sat
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Why Choose A K Clinic */}
      <section className="bg-gradient-to-b from-white to-[#F7FAFC] py-16 border-t border-gray-100" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Our Clinical Integrity</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900">
              Why Choose A K Clinic?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500">
              We understand that clinical consultations should feel supportive, accurate, and dignified. 
              Our setup is tailored to bring Karachi families the utmost clinical comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="why-choose-grid">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col text-left hover:shadow-md transition-all"
              >
                <div className={`h-11 w-11 rounded-lg ${feat.color} flex items-center justify-center mb-4 shrink-0`}>
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg font-display text-gray-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Services Preview */}
      <section className="bg-white py-16" id="services-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="text-left max-w-2xl">
              <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Our OPD Offerings</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900">
                Comprehensive Healthcare Services
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-500">
                Explore our main diagnostic and primary care procedures. Book a consultation for any of these parameters.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#E74C4C] hover:text-[#EF4444] transition-colors self-start md:self-end"
            >
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="services-preview-grid">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left h-full"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] flex items-center justify-center mb-4 transition-all group-hover:bg-[#E74C4C] group-hover:text-white">
                    <ServiceIcon name={srv.iconName} className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base font-display text-gray-950 mb-1 group-hover:text-[#E74C4C] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {srv.description}
                  </p>
                </div>

                <button
                  onClick={() => onBookClick(srv.title)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#E74C4C] hover:underline"
                >
                  <span>Select & Book</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Call To Action Banner */}
      <section className="py-12 bg-white" id="cta-banner-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E74C4C] to-[#EF4444] px-6 py-12 md:p-12 text-center text-white shadow-xl" id="cta-banner">
            <div className="absolute top-0 right-0 transform translate-x-20 -translate-y-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 transform -translate-x-20 translate-y-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight">
                Need Professional Medical Advice Today?
              </h3>
              <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto leading-relaxed">
                Connect with our doctor for expert diagnostics, cough/bronchitis management, 
                pediatric physical evaluations, and routine medicine.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={() => onBookClick()}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E74C4C] hover:bg-[#E74C4C]/95 px-6 py-3 font-bold text-white transition-all shadow-md"
                  id="cta-book-btn"
                >
                  <span>Book an Appointment</span>
                </button>
                <a
                  href="tel:+923278259230"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-6 py-3 font-bold text-white transition-all"
                >
                  <Phone className="h-4.5 w-4.5" />
                  <span>Call: +92 327 8259230</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
