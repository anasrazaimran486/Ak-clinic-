import React, { useState } from 'react';
import { Plus, Trash2, Power, AlertCircle, Sparkles } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorManagementProps {
  doctors: Doctor[];
  onAddDoctor: (name: string, specialization: string, fee: number) => void;
  onToggleDoctorActive: (id: string) => void;
  onDeleteDoctor: (id: string) => void;
}

export default function DoctorManagement({
  doctors,
  onAddDoctor,
  onToggleDoctorActive,
  onDeleteDoctor
}: DoctorManagementProps) {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('General Physician');
  const [fee, setFee] = useState<number>(500);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Doctor ka naam zaroori hai.');
      return;
    }

    if (!specialization.trim()) {
      setError('Specialization zaroori hai.');
      return;
    }

    if (fee <= 0) {
      setError('Fee 0 ya minus mein nahi ho sakti.');
      return;
    }

    onAddDoctor(name.trim(), specialization.trim(), fee);
    setName('');
    setSuccess(`Dr. ${name} ko kamyabi se list mein shamil kar liya gaya hai!`);
    
    // Clear success alert after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left" id="doctor-management-panel">
      
      {/* Left Form Column */}
      <div className="lg:col-span-1 rounded-xl bg-white p-6 shadow-sm border border-gray-200 h-fit">
        <h2 className="text-lg font-bold font-display text-gray-950 mb-4 flex items-center gap-1.5">
          <Plus className="h-5 w-5 text-[#E74C4C]" />
          <span>Add New Doctor</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Doctor Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Dr. Ali Raza Imran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Specialization *</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
            >
              <option value="General Physician">General Physician (GP)</option>
              <option value="Pediatric Specialist">Pediatric Specialist (Child Doctor)</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist (Skin Specialist)</option>
              <option value="Cardiologist">Cardiologist (Heart Specialist)</option>
              <option value="General Surgeon">General Surgeon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Consultation Fee (Rs.) *</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={fee || ''}
              onChange={(e) => setFee(Number(e.target.value))}
              min="0"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all"
              required
            />
          </div>

          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 animate-fade-in">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full justify-center rounded-lg bg-[#E74C4C] hover:bg-[#E74C4C]/90 px-4 py-3 font-semibold text-white text-sm transition-all shadow-md shadow-[#E74C4C]/10 flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Doctor to Roster</span>
          </button>
        </form>
      </div>

      {/* Right List Column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-display text-gray-950">Active Clinic Roster ({doctors.length})</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-semibold">Live Feed</span>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              No doctors shamil hain roster mein. Please add one on the left.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className={`relative p-5 rounded-xl border transition-all flex flex-col justify-between h-44 ${
                    doc.isActive 
                      ? 'bg-white border-gray-200 shadow-sm hover:border-gray-300' 
                      : 'bg-gray-50 border-gray-200 opacity-65'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-950 text-base leading-tight">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-[#E74C4C] font-semibold mt-1">
                          {doc.specialization}
                        </p>
                      </div>

                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        doc.isActive 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {doc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block">Consultation Fee</span>
                      <span className="text-lg font-extrabold text-gray-900">
                        Rs. {doc.fee}/-
                      </span>
                    </div>
                  </div>

                  {/* Action buttons at the bottom of card */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <button
                      onClick={() => onToggleDoctorActive(doc.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        doc.isActive
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                      title={doc.isActive ? "Mark Inactive" : "Mark Active"}
                    >
                      <Power className="h-3.5 w-3.5" />
                      <span>{doc.isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteDoctor(doc.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all border border-gray-100"
                      title="Delete Doctor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
