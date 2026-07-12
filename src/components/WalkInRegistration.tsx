import React, { useState, useMemo } from 'react';
import { Printer, Search, Plus, Calendar, User, Clock, Check, X, ShieldAlert, CheckCircle2, RotateCw } from 'lucide-react';
import { Doctor, Token } from '../types';

interface WalkInRegistrationProps {
  doctors: Doctor[];
  tokens: Token[];
  onGenerateToken: (
    fullName: string,
    dob: string,
    age: number,
    gender: 'Male' | 'Female' | 'Other',
    doctorId: string,
    paymentStatus: 'Paid' | 'Pending',
    paymentMethod: 'Cash' | 'Online',
    treatment?: string
  ) => Token;
  onUpdateTokenStatus: (id: string, status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => void;
  onPrintToken: (token: Token) => void;
  onPrintInvoiceByTokenId: (tokenId: string) => void;
}

export default function WalkInRegistration({
  doctors,
  tokens,
  onGenerateToken,
  onUpdateTokenStatus,
  onPrintToken,
  onPrintInvoiceByTokenId
}: WalkInRegistrationProps) {
  // Form states
  const [fullName, setFullName] = useState('');
  const [ageValue, setAgeValue] = useState('');
  const [ageUnit, setAgeUnit] = useState<'Years' | 'Months'>('Years');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [doctorId, setDoctorId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Online'>('Cash');
  const [treatment, setTreatment] = useState('Regular Checkup');
  const [customTreatment, setCustomTreatment] = useState('');
  
  // UI States
  const [previewTab, setPreviewTab] = useState<'token' | 'bill'>('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active (not completed or cancelled) vs All tokens
  const [queueFilter, setQueueFilter] = useState<'Active' | 'All'>('Active');

  // Submit and register
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Patient ka naam zaroori hai.');
      return;
    }
    if (!ageValue.trim()) {
      setError('Patient ki umar (Age) likhna zaroori hai.');
      return;
    }

    const parsedAgeNum = Number(ageValue);
    if (isNaN(parsedAgeNum) || parsedAgeNum <= 0) {
      setError('Umar (Age) ka sahi number likhein (Jaise 25 ya 6).');
      return;
    }

    if (!doctorId) {
      setError('Doctor select karna zaroori hai.');
      return;
    }

    const assignedDoctor = doctors.find(d => d.id === doctorId);
    if (!assignedDoctor) {
      setError('Selected doctor invalid hai.');
      return;
    }

    // Format DOB description as custom age string and get raw age number
    const dobString = ageUnit === 'Years' ? `${ageValue} Years` : `${ageValue} Months`;
    const finalAge = ageUnit === 'Years' ? parsedAgeNum : 0;
    const finalTreatment = treatment === 'Other' ? (customTreatment.trim() || 'Other') : treatment;

    // Generate token
    const token = onGenerateToken(
      fullName.trim(),
      dobString,
      finalAge,
      gender,
      doctorId,
      paymentStatus,
      paymentMethod,
      finalTreatment
    );

    setFullName('');
    setAgeValue('');
    setAgeUnit('Years');
    setDoctorId('');
    setTreatment('Regular Checkup');
    setCustomTreatment('');
    
    // Alert the receptionist and auto trigger print
    setSuccess(`Token ${token.tokenNumber} generated successfully for ${token.fullName}!`);
    setTimeout(() => setSuccess(''), 4000);
  };

  // Today's YYYY-MM-DD
  const todayString = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Today's filtered tokens
  const todayTokens = useMemo(() => {
    return tokens.filter(t => {
      // Check if generated today (matches prefix of date or matching date key)
      const isToday = t.date === todayString;
      const matchesSearch = 
        t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tokenNumber.includes(searchQuery);

      const matchesFilter = 
        queueFilter === 'All' || 
        (queueFilter === 'Active' && (t.status === 'WAITING' || t.status === 'IN_PROGRESS'));

      return isToday && matchesSearch && matchesFilter;
    }).sort((a, b) => {
      // WAITING and IN_PROGRESS should go first, then completed/cancelled
      const statusOrder: Record<string, number> = {
        'IN_PROGRESS': 0,
        'WAITING': 1,
        'COMPLETED': 2,
        'CANCELLED': 3
      };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.tokenNumber.localeCompare(a.tokenNumber); // latest numbers first
    });
  }, [tokens, todayString, searchQuery, queueFilter]);

  // Today's waiting patient counts
  const totalWaiting = useMemo(() => {
    return tokens.filter(t => t.date === todayString && (t.status === 'WAITING' || t.status === 'IN_PROGRESS')).length;
  }, [tokens, todayString]);

  // Active doctors list helper
  const activeDoctors = useMemo(() => {
    return doctors.filter(d => d.isActive);
  }, [doctors]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left" id="walk-in-registration-panel">
      {/* LEFT COLUMN: Registration form (4 cols on wide screens) */}
      <div className="xl:col-span-5 space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-xl font-extrabold text-gray-950 font-display flex items-center gap-2">
              <User className="h-5.5 w-5.5 text-[#E74C4C]" />
              <span>Walk-in Patient Registration</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Bina phone number ke, sirf 4 fields bharein aur instant parchi generate karein.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Mohammad Ahmed"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Patient Age Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Patient Age (Umar) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Age Value Input */}
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 25, 6, 12"
                    value={ageValue}
                    onChange={(e) => setAgeValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all font-semibold text-gray-950"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold pointer-events-none uppercase">
                    Value
                  </span>
                </div>

                {/* Age Unit Selector Button Group */}
                <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 shadow-inner">
                  <button
                    key="Years"
                    type="button"
                    onClick={() => setAgeUnit('Years')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      ageUnit === 'Years'
                        ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-100'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Saal / Years
                  </button>
                  <button
                    key="Months"
                    type="button"
                    onClick={() => setAgeUnit('Months')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                      ageUnit === 'Months'
                        ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-100'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Mahine / Months
                  </button>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Gender *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-lg py-2 text-sm font-semibold border transition-all ${
                      gender === g
                        ? 'border-[#E74C4C] bg-[#E74C4C]/5 text-[#E74C4C]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Attending Doctor *</label>
              {activeDoctors.length === 0 ? (
                <div className="text-xs text-red-600 border border-red-100 rounded-lg p-3 bg-red-50 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>No active doctors available! Set up active doctors in the Doctors tab first.</span>
                </div>
              ) : (
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white font-semibold text-gray-950"
                  required
                >
                  <option value="">-- Choose Attending Doctor for Parchi --</option>
                  {activeDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization} (Fee: Rs. {doc.fee})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Treatment / Complaint */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Treatment Type *</label>
              <select
                value={treatment}
                onChange={(e) => {
                  setTreatment(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomTreatment('');
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white font-semibold text-gray-950"
                required
              >
                <option value="Regular Checkup">Regular Checkup / Aam Checkup</option>
                <option value="General Consultation">General Consultation / Mashwara</option>
                <option value="Follow-up">Follow-up / Dobara Checkup</option>
                <option value="Vaccination">Vaccination / Hifazati Teeke</option>
                <option value="Pediatric Health Guidance">Pediatric Health / Bachon Ki Sehat</option>
                <option value="Respiratory Health Care">Respiratory Care / Saans & Khansi</option>
                <option value="Blood Pressure & Pulse Monitoring">Blood Pressure & Pulse Monitoring</option>
                <option value="Weight Assessment & Vital Check">Weight Assessment & Vital Check</option>
                <option value="Other">Other / Koi Aur Masla (Type below)</option>
              </select>
            </div>

            {treatment === 'Other' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Specify Other Treatment / Complaint *</label>
                <input
                  type="text"
                  placeholder="e.g. Skin Allergy, Stomach Ache, Routine Medical Cert"
                  value={customTreatment}
                  onChange={(e) => setCustomTreatment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all font-semibold text-gray-950"
                  required
                />
              </div>
            )}

            {/* Payment status & method for quick bill setup */}
            <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Receipt Billing Status</label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-l-md border ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Pending')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-r-md border-y border-r ${
                      paymentStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Unpaid
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Method</label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-l-md border ${
                      paymentMethod === 'Cash'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Online')}
                    className={`flex-1 text-center py-1.5 text-xs font-bold rounded-r-md border-y border-r ${
                      paymentMethod === 'Online'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800">
                <Clock className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-2.5 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={activeDoctors.length === 0}
              className={`w-full justify-center rounded-lg px-4 py-3.5 font-bold text-white text-sm transition-all shadow-md flex items-center gap-2 active:scale-[0.98] ${
                activeDoctors.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              }`}
            >
              <Printer className="h-4.5 w-4.5" />
              <span>🖨️ Print Token Parchi</span>
            </button>
          </form>
        </div>

        {/* REAL-TIME RECEIPT/PARCHI PREVIEW */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-4 animate-fade-in" id="realtime-parchi-preview">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-gray-950 font-display flex items-center gap-1.5">
                <Printer className="h-4 w-4 text-[#E74C4C]" />
                <span>Parchi Preview (Live Simulation)</span>
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">
                Renders instantly as parameters are configured above
              </p>
            </div>
            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 self-start sm:self-auto shadow-inner">
              <button
                type="button"
                onClick={() => setPreviewTab('token')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  previewTab === 'token'
                    ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Token Ticket
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('bill')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  previewTab === 'bill'
                    ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Billing Invoice
              </button>
            </div>
          </div>

          {/* PHYSICAL THERMAL RECEIPT SLIP STYLE CONTAINER */}
          <div className="relative mx-auto max-w-[290px] bg-white border border-gray-300 shadow-md p-5 pb-7 font-mono text-xs text-slate-900 leading-tight select-none">
            {/* Glossy paper overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50/50 via-transparent to-white/10 pointer-events-none" />

            {/* Clinic Branding */}
            <div className="text-center space-y-0.5">
              <div className="font-bold text-sm tracking-tight text-gray-950">A K CLINIC</div>
              <div className="text-[9px] text-gray-500 font-sans">Hijri Road near Sania Tower, Karachi</div>
              <div className="text-[9px] text-gray-500 font-sans">Phone: +92 327 8259230</div>
            </div>

            {/* Dashed line */}
            <div className="border-t border-dashed border-gray-400 my-3" />

            {previewTab === 'token' ? (
              <>
                <div className="text-center font-bold text-[11px] uppercase tracking-wider text-gray-600">TOKEN / PARCHI</div>
                <div className="text-center font-black text-3xl my-2.5 tracking-tight text-slate-950">
                  {String(tokens.filter(t => t.date === todayString).length + 1).padStart(3, '0')}
                </div>
                <div className="text-center text-[10px] text-gray-500">
                  Date: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-0.5">
                  Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>

                <div className="border-t border-dashed border-gray-400 my-3" />

                <div className="font-bold text-[10px] uppercase text-gray-400 mb-1.5">Patient Details</div>
                <table className="w-full text-left text-[11px] space-y-1">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3 text-gray-600">Name:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">{fullName.trim() || 'GUEST PATIENT'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Age:</td>
                      <td className="font-semibold text-slate-950">
                        {ageValue ? `${ageValue} ${ageUnit === 'Years' ? 'Years' : 'Months'}` : '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Gender:</td>
                      <td className="font-semibold text-slate-950">{gender}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3" />

                <div className="font-bold text-[10px] uppercase text-gray-400 mb-1.5">Assigned Doctor & Specialty</div>
                <table className="w-full text-left text-[11px] space-y-1">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3 text-gray-600">Doctor:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">
                        {doctors.find(d => d.id === doctorId)?.name || 'Please Select Doctor'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Treatment:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">
                        {treatment === 'Other' ? (customTreatment.trim() || 'Other') : treatment}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Specialty:</td>
                      <td className="text-slate-500 text-[10px] truncate max-w-[150px]">
                        {doctors.find(d => d.id === doctorId)?.specialization || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Fee:</td>
                      <td className="font-bold text-slate-950">
                        Rs. {doctors.find(d => d.id === doctorId)?.fee || 0}/-
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3.5" />

                <div className="text-center text-[10px] font-medium text-gray-500 italic leading-snug">
                  Please wait for your turn.<br />Thank you!
                </div>
                
                <div className="text-center font-bold mt-4 text-[11px] tracking-widest text-slate-900 bg-gray-50 py-1 border border-gray-200 rounded">
                  *TK-{String(tokens.filter(t => t.date === todayString).length + 1).padStart(3, '0')}*
                </div>
              </>
            ) : (
              <>
                <div className="text-center font-bold text-[11px] uppercase tracking-wider text-gray-600">INVOICE / BILL SLIP</div>
                <div className="text-center font-black text-lg my-1.5 tracking-tight text-slate-950">
                  INV-2026-XXXX
                </div>
                <div className="text-center text-[10px] text-gray-500">
                  Date: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
                <div className="text-center text-[10px] text-gray-500 mt-0.5">
                  Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>

                <div className="border-t border-dashed border-gray-400 my-3" />

                <table className="w-full text-left text-[11px] space-y-1">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3 text-gray-600">Patient:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">{fullName.trim() || 'GUEST PATIENT'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Age/Gend:</td>
                      <td className="font-semibold text-slate-950">
                        {ageValue ? `${ageValue}${ageUnit === 'Years' ? 'Y' : 'M'}` : '--'} / {gender}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Token No:</td>
                      <td className="font-bold text-slate-950">
                        {String(tokens.filter(t => t.date === todayString).length + 1).padStart(3, '0')}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3" />

                <table className="w-full text-left text-[11px]">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3 text-gray-600">Doctor:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">
                        {doctors.find(d => d.id === doctorId)?.name || '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Treatment:</td>
                      <td className="font-semibold text-slate-950 truncate max-w-[150px]">
                        {treatment === 'Other' ? (customTreatment.trim() || 'Other') : treatment}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600 pt-1">Doc Fee:</td>
                      <td className="pt-1 text-slate-950">Rs. {doctors.find(d => d.id === doctorId)?.fee || 0}/-</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="border-t border-dashed border-gray-300 my-2" />
                      </td>
                    </tr>
                    <tr className="font-bold text-slate-950">
                      <td>TOTAL:</td>
                      <td className="text-sm font-black">Rs. {doctors.find(d => d.id === doctorId)?.fee || 0}/-</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3" />

                <table className="w-full text-left text-[11px] space-y-1">
                  <tbody>
                    <tr>
                      <td className="font-bold w-1/3 text-gray-600">Status:</td>
                      <td className={`font-bold uppercase ${paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {paymentStatus.toUpperCase()} {paymentStatus === 'Paid' ? '✓' : '✗'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-gray-600">Method:</td>
                      <td className="font-semibold text-slate-950">{paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-dashed border-gray-400 my-3.5" />

                <div className="text-center text-[10px] font-medium text-gray-500 italic leading-snug">
                  Thank you!<br />Get well soon!
                </div>
              </>
            )}

            {/* Jagged / serrated bottom border pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[linear-gradient(45deg,transparent_33.333%,#cbd5e1_33.333%,#cbd5e1_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#cbd5e1_33.333%,#cbd5e1_66.667%,transparent_66.667%)] bg-[length:10px_20px] bg-repeat-x pointer-events-none opacity-40" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Today's live queue list (7 cols) */}
      <div className="xl:col-span-7 space-y-4">
        
        {/* Waiting queue widget banner */}
        <div className="bg-[#E74C4C] rounded-2xl p-5 text-white flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-extrabold text-lg">Today's Live Waiting Room</h3>
            <p className="text-xs text-white/80 mt-0.5">Counter resets to 1 automatically at midnight.</p>
          </div>
          <div className="bg-white/15 px-4 py-2.5 rounded-xl text-center">
            <span className="text-3xl font-extrabold block leading-none">{totalWaiting}</span>
            <span className="text-[9px] uppercase tracking-wider font-bold mt-1 block">In Waiting</span>
          </div>
        </div>

        {/* Live list block */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          {/* Header toolbar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-1.5 text-xs focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
              />
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setQueueFilter('Active')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  queueFilter === 'Active'
                    ? 'border-[#E74C4C] bg-[#E74C4C]/5 text-[#E74C4C]'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Waiting/Active Queue
              </button>
              <button
                onClick={() => setQueueFilter('All')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  queueFilter === 'All'
                    ? 'border-[#E74C4C] bg-[#E74C4C]/5 text-[#E74C4C]'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                All Today ({tokens.filter(t => t.date === todayString).length})
              </button>
            </div>
          </div>

          {/* Render Queue list */}
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {todayTokens.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                Aany wale patient list khali hai. Add a new patient above!
              </div>
            ) : (
              todayTokens.map((t) => (
                <div key={t.id} className="p-4 hover:bg-gray-50/40 transition-colors flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  
                  {/* Left Patient Detail Info */}
                  <div className="flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-xl bg-gray-100 flex flex-col items-center justify-center border border-gray-200 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">Token</span>
                      <span className="text-xl font-black text-gray-950 mt-1 leading-none">{t.tokenNumber}</span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-gray-950 text-sm flex items-center gap-1.5">
                        <span>{t.fullName}</span>
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          t.status === 'WAITING'
                            ? 'bg-amber-400'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-400 animate-pulse'
                            : t.status === 'COMPLETED'
                            ? 'bg-emerald-400'
                            : 'bg-red-400'
                        }`} />
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {t.dob && (t.dob.includes('Month') || t.dob.includes('Year')) ? t.dob : `${t.age} Years Old`} • {t.gender}
                      </p>
                      <div className="text-xs text-gray-400">
                        Doctor: <strong className="text-gray-700">{t.doctorName}</strong> ({t.doctorSpecialization})
                      </div>
                      <div className="text-[11px] text-[#E74C4C] font-semibold mt-0.5">
                        Treatment: <span className="font-bold">{t.treatment || 'Regular Checkup'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Status selectors */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end border-t border-gray-100 pt-3 sm:pt-0 sm:border-t-0">
                    
                    {/* Inline State toggler */}
                    <div className="flex gap-1">
                      {t.status === 'WAITING' && (
                        <button
                          onClick={() => onUpdateTokenStatus(t.id, 'IN_PROGRESS')}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-blue-200"
                        >
                          Call Doctor
                        </button>
                      )}
                      
                      {t.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => onUpdateTokenStatus(t.id, 'COMPLETED')}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-200"
                        >
                          Complete
                        </button>
                      )}

                      {(t.status === 'WAITING' || t.status === 'IN_PROGRESS') && (
                        <button
                          onClick={() => onUpdateTokenStatus(t.id, 'CANCELLED')}
                          className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-red-200"
                          title="Cancel Patient"
                        >
                          Cancel
                        </button>
                      )}

                      {(t.status === 'COMPLETED' || t.status === 'CANCELLED') && (
                        <button
                          onClick={() => onUpdateTokenStatus(t.id, 'WAITING')}
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-2 py-1.5 rounded-lg text-[10px] font-bold"
                          title="Put Back in Queue"
                        >
                          Put Back
                        </button>
                      )}
                    </div>

                    {/* Reprint Action icons */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onPrintToken(t)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 border border-gray-200 hover:text-gray-900"
                        title="Reprint Ticket"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onPrintInvoiceByTokenId(t.id)}
                        className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center gap-1"
                        title="Print Billing Receipt"
                      >
                        <span>Bill</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
