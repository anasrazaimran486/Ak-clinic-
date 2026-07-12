import React, { useState, useMemo } from 'react';
import { Printer, Search, FileText, Check, DollarSign, Activity, Edit, X } from 'lucide-react';
import { Invoice, Doctor } from '../types';

interface BillingManagementProps {
  invoices: Invoice[];
  doctors: Doctor[];
  onPrintInvoice: (invoice: Invoice) => void;
  onUpdatePaymentStatus: (id: string, status: 'Paid' | 'Pending' | 'Partial') => void;
  onUpdateInvoiceDetails: (
    id: string,
    updates: { doctorName: string; doctorFee: number; totalAmount: number; treatment: string }
  ) => void;
}

export default function BillingManagement({
  invoices,
  doctors,
  onPrintInvoice,
  onUpdatePaymentStatus,
  onUpdateInvoiceDetails
}: BillingManagementProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit Receipt / Invoice states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDoctorName, setEditDoctorName] = useState('');
  const [editTreatment, setEditTreatment] = useState('');

  const handleStartEdit = (inv: Invoice) => {
    setEditingId(inv.id);
    setEditDoctorName(inv.doctorName);
    setEditTreatment(inv.treatment || 'Regular Checkup');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDoctorName('');
    setEditTreatment('');
  };

  const handleSaveEdit = (invoiceId: string) => {
    const selectedDoc = doctors.find(d => d.name === editDoctorName);
    const fee = selectedDoc ? selectedDoc.fee : 500;
    onUpdateInvoiceDetails(invoiceId, {
      doctorName: editDoctorName,
      doctorFee: fee,
      totalAmount: fee,
      treatment: editTreatment
    });
    setEditingId(null);
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
        inv.tokenNumber.includes(search);

      const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  }, [invoices, search, statusFilter]);

  // Total invoice summary counts
  const billingStats = useMemo(() => {
    let totalRevenue = 0;
    let pendingPayments = 0;
    
    invoices.forEach(inv => {
      if (inv.paymentStatus === 'Paid') {
        totalRevenue += inv.totalAmount;
      } else if (inv.paymentStatus === 'Pending') {
        pendingPayments += inv.totalAmount;
      } else if (inv.paymentStatus === 'Partial') {
        totalRevenue += (inv.totalAmount / 2); // estimate half collected for partial
        pendingPayments += (inv.totalAmount / 2);
      }
    });

    return { totalRevenue, pendingPayments };
  }, [invoices]);

  return (
    <div className="space-y-6 text-left" id="billing-management-panel">
      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Collected Revenue</span>
            <span className="text-xl font-bold text-gray-900">Rs. {billingStats.totalRevenue}/-</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">Receivables (Pending)</span>
            <span className="text-xl font-bold text-amber-800">Rs. {billingStats.pendingPayments}/-</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-[#E74C4C]/10 text-[#E74C4C] flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Printed Invoices</span>
            <span className="text-xl font-bold text-gray-900">{invoices.length} Invoices</span>
          </div>
        </div>
      </div>

      {/* Filters Search and Table Container */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Filters Search Bar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices by ID, name, token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-[#E74C4C] focus:ring-1 focus:ring-[#E74C4C] focus:outline-none transition-all bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white w-full md:w-auto"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid Bills</option>
              <option value="Pending">Pending Bills</option>
              <option value="Partial">Partial Payments</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Patient Information</th>
                <th className="px-6 py-4">Doctor Consultation</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded inline-block">
                        {inv.invoiceId}
                      </div>
                      <span className="block text-[10px] text-gray-400 mt-1">
                        Token No: <strong className="text-gray-700 font-bold">{inv.tokenNumber}</strong>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{inv.patientName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {inv.dob && (inv.dob.includes('Month') || inv.dob.includes('Year')) ? inv.dob : `${inv.age} Years`} • {inv.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === inv.id ? (
                        <div className="space-y-2 max-w-[200px]">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Attending Doctor</label>
                            <select
                              value={editDoctorName}
                              onChange={(e) => setEditDoctorName(e.target.value)}
                              className="w-full rounded border border-gray-300 p-1 text-xs focus:border-[#E74C4C] focus:outline-none font-semibold bg-white text-gray-900"
                            >
                              {doctors.map(d => (
                                <option key={d.id} value={d.name}>
                                  {d.name} ({d.specialization})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Treatment Type</label>
                            <select
                              value={editTreatment}
                              onChange={(e) => setEditTreatment(e.target.value)}
                              className="w-full rounded border border-gray-300 p-1 text-xs focus:border-[#E74C4C] focus:outline-none font-semibold bg-white text-gray-900"
                            >
                              <option value="Regular Checkup">Regular Checkup</option>
                              <option value="General Consultation">General Consultation</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Vaccination">Vaccination</option>
                              <option value="Pediatric Health Guidance">Pediatric Health Guidance</option>
                              <option value="Respiratory Health Care">Respiratory Health Care</option>
                              <option value="Blood Pressure & Pulse Monitoring">Blood Pressure & Pulse Monitoring</option>
                              <option value="Weight Assessment & Vital Check">Weight Assessment & Vital Check</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-900">{inv.doctorName}</div>
                          <div className="text-xs text-[#E74C4C] font-bold">{inv.treatment || 'Regular Checkup'}</div>
                          <span className="text-xs text-gray-400">Fee: Rs. {inv.doctorFee}/-</span>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      Rs. {editingId === inv.id ? (doctors.find(d => d.name === editDoctorName)?.fee || inv.totalAmount) : inv.totalAmount}/-
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                        
                        {/* Status Quick Changer */}
                        {inv.paymentStatus !== 'Paid' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => onUpdatePaymentStatus(inv.id, 'Paid')}
                              className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-1.5 py-0.5 rounded font-bold"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => onUpdatePaymentStatus(inv.id, 'Partial')}
                              className="text-[10px] bg-amber-50 text-amber-700 hover:bg-amber-100 px-1.5 py-0.5 rounded font-bold"
                            >
                              Partial
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === inv.id ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(inv.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 text-xs font-bold transition-all shadow-sm"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 px-2.5 py-1.5 text-xs font-bold transition-all shadow-sm"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(inv)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 text-xs font-semibold transition-all shadow-sm"
                            title="Edit Receipt Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onPrintInvoice(inv)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold transition-all shadow-sm"
                            title="Thermal Print Receipt"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print Bill</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No matching invoices found.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div key={inv.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  inv.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />

                <div className="flex items-center justify-between mt-1">
                  <div className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">
                    {inv.invoiceId}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <h4 className="font-bold text-gray-950 text-sm">Patient: {inv.patientName}</h4>
                  <p className="text-xs text-gray-500">
                    Age: {inv.dob && (inv.dob.includes('Month') || inv.dob.includes('Year')) ? inv.dob : `${inv.age}Y`} • {inv.gender} • Token: <strong>{inv.tokenNumber}</strong>
                  </p>
                  {editingId === inv.id ? (
                    <div className="space-y-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Attending Doctor</label>
                        <select
                          value={editDoctorName}
                          onChange={(e) => setEditDoctorName(e.target.value)}
                          className="w-full rounded border border-gray-300 p-1.5 text-xs focus:border-[#E74C4C] focus:outline-none font-semibold bg-white text-gray-900"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.name}>
                              {d.name} ({d.specialization})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Treatment Type</label>
                        <select
                          value={editTreatment}
                          onChange={(e) => setEditTreatment(e.target.value)}
                          className="w-full rounded border border-gray-300 p-1.5 text-xs focus:border-[#E74C4C] focus:outline-none font-semibold bg-white text-gray-900"
                        >
                          <option value="Regular Checkup">Regular Checkup</option>
                          <option value="General Consultation">General Consultation</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Vaccination">Vaccination</option>
                          <option value="Pediatric Health Guidance">Pediatric Health Guidance</option>
                          <option value="Respiratory Health Care">Respiratory Health Care</option>
                          <option value="Blood Pressure & Pulse Monitoring">Blood Pressure & Pulse Monitoring</option>
                          <option value="Weight Assessment & Vital Check">Weight Assessment & Vital Check</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-gray-700">Doctor: <strong>{inv.doctorName}</strong> (Rs. {inv.doctorFee})</p>
                      <p className="text-xs text-gray-700">Treatment: <strong className="text-[#E74C4C]">{inv.treatment || 'Regular Checkup'}</strong></p>
                    </>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Amount</span>
                    <span className="text-sm font-extrabold text-gray-950">
                      Rs. {editingId === inv.id ? (doctors.find(d => d.name === editDoctorName)?.fee || inv.totalAmount) : inv.totalAmount}/-
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === inv.id ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleSaveEdit(inv.id)}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(inv)}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg flex items-center justify-center"
                          title="Edit Invoice Details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {inv.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => onUpdatePaymentStatus(inv.id, 'Paid')}
                            className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200"
                          >
                            Paid
                          </button>
                        )}
                        <button
                          onClick={() => onPrintInvoice(inv)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg"
                          title="Print Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
