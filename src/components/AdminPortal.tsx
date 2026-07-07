import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, FileText, Check, X, Trash2, Search, Download, ShieldCheck, Heart, User, Activity, AlertCircle, Calendar, Clock } from 'lucide-react';
import { AppointmentRequest } from '../types';

export default function AdminPortal() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Load from local storage or seed initial dummy data
  useEffect(() => {
    const stored = localStorage.getItem('ak_clinic_appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    } else {
      // Seed interesting sample patients
      const seedData: AppointmentRequest[] = [
        {
          id: "APT-X98A1B",
          fullName: "Muhammad Yousuf",
          phone: "03212891901",
          email: "yousuf.khi@gmail.com",
          service: "Respiratory Health Care",
          date: "2026-07-08",
          timeSlot: "06:00 PM - 06:30 PM",
          message: "Having dry cough and slight bronchial difficulty since last 4 days.",
          status: "Pending",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "APT-L45D9C",
          fullName: "Ayesha Bibi",
          phone: "03002345678",
          email: "ayesha_family@yahoo.com",
          service: "Pediatric Health Guidance",
          date: "2026-07-08",
          timeSlot: "05:00 PM - 05:30 PM",
          message: "Weight assessment and dietary recommendations for 2-year old toddler.",
          status: "Confirmed",
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: "APT-H82G3E",
          fullName: "Syed Kamran",
          phone: "03339876543",
          email: "skamran@outlook.com",
          service: "General OPD Consultation",
          date: "2026-07-09",
          timeSlot: "08:00 PM - 08:30 PM",
          message: "Regular seasonal physical check-up. Need BP record evaluation.",
          status: "Confirmed",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: "APT-K71N4F",
          fullName: "Zainab Fatima",
          phone: "03457129081",
          email: "No email provided",
          service: "Blood Pressure Monitoring",
          date: "2026-07-09",
          timeSlot: "07:30 PM - 08:00 PM",
          message: "Requires regular blood pressure tracking and pulse evaluation.",
          status: "Pending",
          createdAt: new Date(Date.now() - 3600000 * 30).toISOString()
        }
      ];
      localStorage.setItem('ak_clinic_appointments', JSON.stringify(seedData));
      setAppointments(seedData);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'anas123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Clinic Passcode. Please try again.');
    }
  };

  const updateStatus = (id: string, newStatus: 'Confirmed' | 'Cancelled') => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    });
    setAppointments(updated);
    localStorage.setItem('ak_clinic_appointments', JSON.stringify(updated));
  };

  const deleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment request?')) {
      const filtered = appointments.filter(apt => apt.id !== id);
      setAppointments(filtered);
      localStorage.setItem('ak_clinic_appointments', JSON.stringify(filtered));
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Full Name,Phone,Email,Service,Date,Time Slot,Status,Created At\n";
    
    appointments.forEach(apt => {
      const row = [
        apt.id,
        `"${apt.fullName.replace(/"/g, '""')}"`,
        apt.phone,
        apt.email,
        `"${apt.service}"`,
        apt.date,
        apt.timeSlot,
        apt.status,
        apt.createdAt
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ak_clinic_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalLeads = appointments.length;
  const pendingLeads = appointments.filter(a => a.status === 'Pending').length;
  const confirmedLeads = appointments.filter(a => a.status === 'Confirmed').length;
  const conversionRate = totalLeads > 0 ? Math.round((confirmedLeads / totalLeads) * 100) : 0;

  // Filter & Search Logic
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      apt.phone.includes(searchQuery) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesService = serviceFilter === 'All' || apt.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const uniqueServices = Array.from(new Set(appointments.map(a => a.service)));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8" id="admin-login-view">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E74C4C]/10 text-[#E74C4C]">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold font-display text-gray-950">
              Clinic Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter the medical access passcode to review patient leads and scheduling charts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="passcode-input" className="sr-only">Passcode</label>
                <input
                  id="passcode-input"
                  name="passcode"
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-xl tracking-widest focus:border-[#E74C4C] focus:ring-2 focus:ring-[#E74C4C]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex gap-2.5 rounded-lg bg-red-50 p-3 text-sm text-red-800" id="login-error-alert">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-[#E74C4C] px-4 py-3 font-semibold text-white transition-all hover:bg-[#E74C4C]/90 active:scale-[0.98] shadow-md shadow-[#E74C4C]/10"
              id="admin-login-submit"
            >
              Authorize Credentials
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8" id="admin-dashboard-view">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Dashboard Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#E74C4C]">
              <ShieldCheck className="h-4 w-4" />
              <span>A K Clinic System Administration</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-gray-950 mt-1">
              Patient Lead Command Center
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
              id="export-csv-btn"
            >
              <Download className="h-4 w-4 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-all"
              id="admin-logout-btn"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="admin-metrics-grid">
          {/* Total Leads */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Total Inquiries</span>
              <span className="text-2xl font-bold text-gray-900">{totalLeads} Patients</span>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Awaiting Call</span>
              <span className="text-2xl font-bold text-amber-800">{pendingLeads} Leads</span>
            </div>
          </div>

          {/* Confirmed Appointments */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Scheduled Slots</span>
              <span className="text-2xl font-bold text-emerald-800">{confirmedLeads} Confirmed</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E74C4C]/10 text-[#E74C4C]">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Lead Conversion</span>
              <span className="text-2xl font-bold text-[#E74C4C]">{conversionRate}% Rate</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4" id="admin-search-bar">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, ticket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
            >
              <option value="All">Filter by Status (All)</option>
              <option value="Pending">Awaiting Confirmation (Pending)</option>
              <option value="Confirmed">Scheduled & Confirmed</option>
              <option value="Cancelled">Cancelled Requests</option>
            </select>
          </div>

          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
            >
              <option value="All">Filter by Service (All)</option>
              {uniqueServices.map(svc => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lead Records Table & Mobile Cards */}
        <div>
          {/* Desktop view (visible on lg screens and up) */}
          <div className="hidden lg:block rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden" id="admin-leads-table">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Reference ID</th>
                    <th scope="col" className="px-6 py-4">Patient Information</th>
                    <th scope="col" className="px-6 py-4">Desired Service</th>
                    <th scope="col" className="px-6 py-4">Target Schedule</th>
                    <th scope="col" className="px-6 py-4 text-center">Lead Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No patient leads matching the selected query or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50/75 transition-colors">
                        <td className="px-6 py-4 align-top whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {apt.id}
                          </span>
                          <span className="block text-[10px] text-gray-400 mt-1.5">
                            {new Date(apt.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span>{apt.fullName}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                            <span>Phone: <strong className="text-gray-700">{apt.phone}</strong></span>
                            {apt.email && <span className="truncate max-w-[200px]">Email: {apt.email}</span>}
                          </div>
                          {apt.message && (
                            <p className="mt-2 text-xs italic bg-slate-50 border-l-2 border-slate-300 pl-2 text-gray-600 max-w-sm rounded-r">
                              &ldquo;{apt.message}&rdquo;
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap">
                          <span className="inline-block rounded-full bg-[#E74C4C]/10 px-2.5 py-1 text-xs font-semibold text-[#E74C4C]">
                            {apt.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap">
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>{apt.timeSlot}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap text-center">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                            apt.status === 'Confirmed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : apt.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}>
                            {apt.status === 'Pending' ? 'Awaiting Call' : apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            {apt.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => updateStatus(apt.id, 'Confirmed')}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all"
                                  title="Confirm Booking"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => updateStatus(apt.id, 'Cancelled')}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                                  title="Cancel Lead"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteAppointment(apt.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet view (visible on screens smaller than lg) */}
          <div className="block lg:hidden space-y-4 animate-fade-in" id="admin-leads-cards">
            {filteredAppointments.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center text-gray-400 border border-gray-200">
                No patient leads matching the selected query or filters.
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-4 relative overflow-hidden text-left">
                  {/* Top status indicator strip */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    apt.status === 'Confirmed' 
                      ? 'bg-emerald-500' 
                      : apt.status === 'Cancelled'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`} />

                  {/* Header: ID and Status badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {apt.id}
                    </span>
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'Confirmed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : apt.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {apt.status === 'Pending' ? 'Awaiting Call' : apt.status}
                    </span>
                  </div>

                  {/* Patient core info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{apt.fullName}</span>
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Registered: {new Date(apt.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Desired Service Badge */}
                  <div>
                    <span className="inline-block rounded-full bg-[#E74C4C]/10 px-2.5 py-1 text-xs font-semibold text-[#E74C4C]">
                      {apt.service}
                    </span>
                  </div>

                  {/* Target schedule details */}
                  <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Target Date</span>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{apt.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Time Slot</span>
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate">{apt.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message box */}
                  {apt.message && (
                    <div className="text-xs italic bg-slate-50 border-l-2 border-slate-300 p-2.5 text-gray-600 rounded-r">
                      &ldquo;{apt.message}&rdquo;
                    </div>
                  )}

                  {/* Contact links */}
                  <div className="text-xs space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-500">
                      <span>Phone: <strong className="text-gray-900 font-bold">{apt.phone}</strong></span>
                      <div className="flex gap-2">
                        <a 
                          href={`tel:${apt.phone}`} 
                          className="flex-1 sm:flex-initial text-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-[11px] transition-all"
                        >
                          Call Now
                        </a>
                        <a 
                          href={`https://wa.me/${apt.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial text-center px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded text-[11px] transition-all"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                    {apt.email && apt.email !== "No email provided" && (
                      <div className="text-gray-500 truncate text-[11px]">
                        Email: <span className="text-gray-800 font-medium">{apt.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Action block */}
                  <div className="flex gap-2 pt-2">
                    {apt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(apt.id, 'Confirmed')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-semibold shadow-sm transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'Cancelled')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 py-2 text-xs font-semibold border border-red-200 transition-all"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => deleteAppointment(apt.id)}
                      className={`inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-500 py-2 transition-all ${
                        apt.status === 'Pending' ? 'px-3' : 'w-full'
                      }`}
                      title="Delete Lead"
                    >
                      <Trash2 className="h-4 w-4" />
                      {apt.status !== 'Pending' && <span className="ml-1.5 text-xs font-semibold">Delete Record</span>}
                    </button>
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
