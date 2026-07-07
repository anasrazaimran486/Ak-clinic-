import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import { Camera, Image as ImageIcon, CheckCircle, HelpCircle } from 'lucide-react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Clinic Exterior', 'Reception Area', 'Consultation Area', 'Patient Facilities', 'Health Awareness Activities'];

  const filteredItems = activeCategory === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#F7FAFC] py-12 md:py-20" id="gallery-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Visual Tour</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
            A K Clinic Gallery
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500">
            Take a visual tour of our healthcare facilities in Karachi. We pride ourselves on pristine clinical hygiene and comfortable waiting spaces.
          </p>
        </div>

        {/* Category Filters Ribbon */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" id="gallery-filters-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#E74C4C] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" id="gallery-items-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs hover:shadow-md transition-all text-left"
            >
              {/* Image box with overlay */}
              <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  referrerPolicy="no-referrer"
                  className="object-cover w-full h-full transform group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-[10px] font-bold text-[#E74C4C] bg-white rounded px-2 py-0.5 uppercase tracking-wider shadow-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Text Card content */}
              <div className="p-5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  {item.category}
                </span>
                <h3 className="font-bold text-base text-gray-900 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.altText}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hygiene Guarantee Stamp */}
        <div className="mt-16 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-5">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="font-bold text-sm text-gray-950 font-display">Karachi Clinical Sanitation Standards</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our clinical facility is sanitized thrice daily. All diagnostic equipment, including sphygmomanometers, infant weight scales, and consultation chairs, are disinfected before patient admissions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
