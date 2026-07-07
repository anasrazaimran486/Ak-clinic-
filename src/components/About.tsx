import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Target, Eye, Users, Award, ShieldAlert } from 'lucide-react';
import { CLINIC_INFO } from '../data';

export default function About() {
  const values = [
    {
      title: "Compassionate Care",
      desc: "Treating every child, adult, and elder patient with supreme courtesy, patience, and empathetic concern.",
      icon: <Heart className="h-5 w-5 text-[#E74C4C]" />
    },
    {
      title: "Clinical Accuracy",
      desc: "Mandatory double-checking of patient blood pressure, heart rates, and body weights to assure pristine diagnostic inputs.",
      icon: <ShieldCheck className="h-5 w-5 text-[#E74C4C]" />
    },
    {
      title: "Hygienic Environment",
      desc: "Meticulous sanitization protocols observed inside outpatient rooms to guarantee safe, infection-free consultation spaces.",
      icon: <Users className="h-5 w-5 text-[#EF4444]" />
    }
  ];

  return (
    <div className="bg-white py-12 md:py-20" id="about-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Our Identity</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
            About A K Clinic
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Dedicated outpatient medical services focusing on clinical safety and community wellbeing in Karachi.
          </p>
        </div>

        {/* Narrative Section with Left/Right content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20" id="about-narrative">
          
          {/* Left Column: Mission Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-950">
              Community-Focused Healthcare with Compassion
            </h2>
            
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              A K Clinic is a community-focused healthcare facility in Karachi dedicated to providing quality outpatient medical services in a clean, safe, and welcoming environment.
            </p>
            
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Our mission is to deliver accessible healthcare while ensuring every patient receives personalized attention and compassionate treatment. We operate on a patient-first outpatient model that streamlines triage.
            </p>

            <div className="rounded-xl border border-dashed border-[#E74C4C]/30 bg-[#E74C4C]/5 p-5">
              <h4 className="font-bold text-[#E74C4C] flex items-center gap-2 mb-2">
                <Award className="h-5 w-5" />
                <span>Complimentary Pre-Consultation Diagnostics</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Before every consultation, patients benefit from complimentary vital assessments including blood pressure, pulse, and weight checks to support better clinical evaluation and track medical trendlines.
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              The clinic serves children, adults, and elderly patients with a strong focus on preventive care, general OPD medicine, seasonal illness diagnostics, respiratory checkups, and overall wellness.
            </p>
          </div>

          {/* Right Column: Interactive Side Panel with Mission & Vision cards */}
          <div className="lg:col-span-5 space-y-6" id="about-mission-vision">
            {/* Mission Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs text-left hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg font-display text-gray-900 mb-2">
                Our Mission
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                To improve community health through reliable, affordable, and compassionate healthcare services. Ensuring diagnostic transparency and respectful medical therapy for everyone.
              </p>
            </div>

            {/* Vision Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs text-left hover:shadow-md transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] mb-4">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg font-display text-gray-900 mb-2">
                Our Vision
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                To become one of Karachi's most trusted neighborhood healthcare clinics. Establishing standards of pristine hygiene, immediate vitals monitoring, and accessible OPD consultation.
              </p>
            </div>
          </div>

        </div>

        {/* 3. Core Values Section */}
        <div className="border-t border-gray-100 pt-16" id="about-values">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-gray-900">
              Our Core Clinical Standards
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              The foundational guidelines we implement in our clinical workspace on a daily basis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="rounded-xl bg-slate-50 border border-slate-100 p-6 text-left">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-xs mb-4">
                  {val.icon}
                </div>
                <h4 className="font-bold text-base text-gray-900 mb-2 font-display">{val.title}</h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
