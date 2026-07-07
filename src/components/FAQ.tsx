import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../data';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Phone } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-12 md:py-20" id="faqs-tab-view">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Help Desk</span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            Have questions about outpatient registrations, pre-consultation vitals checklists, or timing slots? Browse our quick answers.
          </p>
        </div>

        {/* Accordion Layout */}
        <div className="space-y-4" id="faq-accordions-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-xl border transition-all text-left overflow-hidden ${
                  isOpen 
                    ? 'border-[#E74C4C] bg-[#E74C4C]/5 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-950 focus:outline-none transition-all"
                  aria-expanded={isOpen}
                  id={`faq-trigger-${idx}`}
                >
                  <span className="text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <span className={`p-1.5 rounded-lg shrink-0 ${isOpen ? 'bg-[#E74C4C]/10 text-[#E74C4C]' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>

                {/* Animated Drawer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/60" id={`faq-answer-${idx}`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Missing Question Contact Helper */}
        <div className="mt-16 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center max-w-2xl mx-auto space-y-4">
          <HelpCircle className="h-7 w-7 text-[#E74C4C] mx-auto" />
          <h4 className="font-bold text-gray-950 font-display">Have a Different Inquiry?</h4>
          <p className="text-xs text-gray-500">
            If you have other specific concerns regarding acute chest issues, pediatric milestones, or follow-up timelines, feel free to contact our medical desk directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="tel:+923278259230"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs"
            >
              <Phone className="h-3.5 w-3.5 text-[#E74C4C]" />
              <span>Call +92 327 8259230</span>
            </a>
            <a
              href="https://wa.me/923278259230"
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:brightness-105 px-4 py-2 text-xs font-semibold text-white"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
