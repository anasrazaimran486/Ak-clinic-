import React from 'react';
import { SERVICES } from '../data';
import { ServiceIcon } from './Home';
import { CheckCircle2, ArrowRight, Activity } from 'lucide-react';

interface ServicesProps {
  onBookClick: (serviceTitle?: string) => void;
}

export default function Services({ onBookClick }: ServicesProps) {
  return (
    <div className="bg-[#F7FAFC] py-12 md:py-20" id="services-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Clinical Catalog</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
            Our Outpatient Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            A K Clinic delivers high-integrity primary healthcare, meticulous diagnostics, and pre-consultation vitals monitoring at our Karachi facility.
          </p>
        </div>

        {/* Detailed Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="services-detailed-grid">
          {SERVICES.map((srv) => (
            <div 
              key={srv.id} 
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left"
              id={`service-card-${srv.id}`}
            >
              <div>
                {/* Icon & Title Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-[#E74C4C]/10 text-[#E74C4C] flex items-center justify-center shrink-0">
                    <ServiceIcon name={srv.iconName} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl font-display text-gray-950">
                      {srv.title}
                    </h3>
                    {/* Complementary Tag for Free services */}
                    {(srv.id === 'bp-monitoring' || srv.id === 'weight-assessment' || srv.id === 'pulse-check') && (
                      <span className="inline-block rounded bg-emerald-100 text-[10px] font-bold text-emerald-800 px-2 py-0.5 uppercase tracking-wider mt-1">
                        Complimentary (Free Vitals)
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {srv.description}
                </p>

                {/* Sub-details lists */}
                {srv.details && srv.details.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Included Parameters:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-600">
                      {srv.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Booking Trigger Link */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-400 font-medium">
                  Appointment Consultation Requested
                </span>
                <button
                  onClick={() => onBookClick(srv.title)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#E74C4C] hover:bg-[#E74C4C]/90 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-xs"
                  id={`btn-book-${srv.id}`}
                >
                  <span>Book {srv.id === 'bp-monitoring' || srv.id === 'weight-assessment' || srv.id === 'pulse-check' ? 'Vitals Check' : 'Consultation'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Free vital sign notice card */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-[#E74C4C]/10 to-[#EF4444]/10 border border-[#E74C4C]/20 p-6 md:p-8 text-left max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6" id="vitals-signboard">
          <div className="h-16 w-16 rounded-full bg-white text-[#E74C4C] flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#E74C4C] uppercase tracking-wider">Clinical Care Guarantee</span>
            <h4 className="text-lg font-bold text-gray-900 font-display">Complimentary Blood Pressure, Pulse, and Weight Screening</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              At A K Clinic, patient diagnostics always precede consultation. We screen these three vital signs for every patient, free of charge, during standard triage. This improves diagnostic precision for bronchitis, pediatric development, and hypertensive monitoring.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
