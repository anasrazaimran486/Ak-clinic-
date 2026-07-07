import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, Plus, Send, Heart, User, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import { Review } from '../types';

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ak_clinic_reviews');
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      localStorage.setItem('ak_clinic_reviews', JSON.stringify(TESTIMONIALS));
      setReviews(TESTIMONIALS);
    }
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      alert("Please fill in both your name and feedback comment.");
      return;
    }

    const newReview: Review = {
      id: 'REV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('ak_clinic_reviews', JSON.stringify(updated));

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setRating(5);
      setComment('');
      setShowForm(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="bg-white py-12 md:py-20" id="testimonials-tab-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-bold text-[#E74C4C] tracking-widest uppercase block mb-2">Patient Feedback</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-gray-900">
              Verified Patient Reviews
            </h1>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Read transparent feedback from families near Incholi Society, Sania Tower, and other Karachi neighborhoods. Your healing is our highest honor.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E74C4C] hover:bg-[#E74C4C]/90 px-5 py-3 text-sm font-bold text-white transition-all shadow-md self-start md:self-end"
            id="write-review-toggle-btn"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Dynamic Review Submission Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12 max-w-2xl mx-auto"
              id="new-review-form"
            >
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6 md:p-8 text-left">
                {!submitted ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h3 className="font-bold text-lg font-display text-gray-900 mb-2">
                      Write Patient Feedback
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Sana Malik"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
                        />
                      </div>
                      
                      {/* Rating input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Clinic Rating</label>
                        <div className="flex items-center gap-1.5 h-10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 focus:outline-none"
                            >
                              <Star className={`h-6 w-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Comment input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Review Message</label>
                      <textarea
                        required
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share details of your consultation, clinic cleanliness, or vital sign evaluation..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all resize-none bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#E74C4C] to-[#EF4444] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-105 active:scale-[0.98] transition-all shadow-xs"
                      id="submit-review-btn"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Patient Review</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-950 font-display">Feedback Recorded!</h4>
                    <p className="text-xs text-gray-500">Thank you for helping us improve our health consultations in Karachi.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="testimonials-grid">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-xs text-left hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Stars and Verification */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`h-4 w-4 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>Verified Patient</span>
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Date info */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{rev.name}</h4>
                  <span className="block text-[10px] text-gray-400">Published: {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badging Footer */}
        <div className="mt-16 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
          <Heart className="h-6 w-6 text-[#E74C4C] animate-pulse" />
          <p>Clinical trust is earned. Reviews represent genuine experiences of A K Clinic patients.</p>
        </div>

      </div>
    </div>
  );
}
