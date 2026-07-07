import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AWARENESS_TOPICS } from '../data';
import { Baby, Wind, Activity, Heart, Clock, ChevronRight, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AwarenessTopic } from '../types';

export function TopicIcon({ name, className = "h-5 w-5" }: { name: string, className?: string }) {
  switch (name) {
    case 'Baby': return <Baby className={className} />;
    case 'Wind': return <Wind className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Heart': return <Heart className={className} />;
    default: return <ShieldAlert className={className} />;
  }
}

export default function HealthAwareness() {
  const [selectedTopic, setSelectedTopic] = useState<AwarenessTopic | null>(null);

  return (
    <div className="bg-[#F7FAFC] py-12 md:py-20" id="health-awareness-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Patient Education</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
            Health Awareness Journal
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            A K Clinic believes in preventive medicine and educational guidelines. Explore our research-backed summaries on chronic diagnostics and seasonal chest infections.
          </p>
        </div>

        {/* Master Journal View */}
        {!selectedTopic ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="topics-cards-grid">
            {AWARENESS_TOPICS.map((topic) => (
              <div 
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs hover:shadow-md hover:border-[#E74C4C]/30 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block rounded-lg bg-[#E74C4C]/10 px-2.5 py-1 text-xs font-bold text-[#E74C4C] uppercase tracking-wider">
                      {topic.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{topic.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-xl font-display text-gray-950 mb-3 group-hover:text-[#E74C4C] transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {topic.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#E74C4C] group-hover:text-[#EF4444]">
                  <span>Read Clinical Details</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single Article Expanded View */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 text-left max-w-3xl mx-auto shadow-md"
            id="expanded-topic-article"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedTopic(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors mb-8 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to awareness topics</span>
            </button>

            {/* Header */}
            <div className="space-y-4 mb-8">
              <span className="inline-block rounded-lg bg-[#E74C4C]/10 px-3 py-1 text-xs font-bold text-[#E74C4C] uppercase tracking-wider">
                {selectedTopic.category}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-gray-950">
                {selectedTopic.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-gray-400 border-b border-gray-100 pb-5">
                <span className="flex items-center gap-1">
                  <TopicIcon name={selectedTopic.iconName} className="h-4 w-4 text-[#E74C4C]" />
                  <span>Verified Clinical Topic</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedTopic.readTime}</span>
                </span>
              </div>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-5 text-sm sm:text-base text-gray-600 leading-relaxed" id="article-paragraphs">
              {selectedTopic.content.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Clinical Callout Footer */}
            <div className="mt-10 rounded-xl bg-slate-50 border border-slate-200 p-5 text-xs text-gray-500 leading-relaxed">
              <strong>Clinical Disclaimer:</strong> The articles in this health awareness ledger represent standard outpatient instructions and general wellness counseling. They are intended for educational tracking and do not substitute for custom diagnosis, personalized chest examinations, or customized prescription therapies by a registered physician. Always book a proper consultation for physical assessments.
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
