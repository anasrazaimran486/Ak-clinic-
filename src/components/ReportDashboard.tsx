import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, FileText, Users, Activity, Calendar, Download, 
  TrendingUp, Search, Filter, ArrowUpRight, BarChart3, PieChart,
  User, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Token, Invoice, Doctor } from '../types';

interface ReportDashboardProps {
  invoices: Invoice[];
  tokens: Token[];
  doctors: Doctor[];
}

type Timeframe = 'today' | 'week' | '28days' | '365days';

export default function ReportDashboard({ invoices, tokens, doctors }: ReportDashboardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('28days');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Partial'>('All');

  // Helper to determine if a date is within the timeframe
  const isWithinTimeframe = (dateString: string, tf: Timeframe): boolean => {
    const itemDate = new Date(dateString);
    const today = new Date();
    
    // Normalize today
    today.setHours(23, 59, 59, 999);
    
    const diffTime = today.getTime() - itemDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (tf === 'today') {
      const todayStr = today.toLocaleDateString('en-CA');
      const itemStr = itemDate.toLocaleDateString('en-CA');
      return todayStr === itemStr;
    }
    if (tf === 'week') {
      return diffDays >= 0 && diffDays < 7;
    }
    if (tf === '28days') {
      return diffDays >= 0 && diffDays < 28;
    }
    if (tf === '365days') {
      return diffDays >= 0 && diffDays < 365;
    }
    return true;
  };

  // Filter invoices based on timeframe
  const filteredInvoicesByTimeframe = useMemo(() => {
    return invoices.filter(inv => isWithinTimeframe(inv.generatedAt, timeframe));
  }, [invoices, timeframe]);

  // Aggregate metrics for cards
  const metrics = useMemo(() => {
    const count = filteredInvoicesByTimeframe.length;
    const totalRevenue = filteredInvoicesByTimeframe.reduce((sum, inv) => {
      return inv.paymentStatus === 'Paid' ? sum + inv.totalAmount : sum;
    }, 0);
    const totalBilled = filteredInvoicesByTimeframe.reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    const paidInvoices = filteredInvoicesByTimeframe.filter(inv => inv.paymentStatus === 'Paid');
    const pendingInvoices = filteredInvoicesByTimeframe.filter(inv => inv.paymentStatus === 'Pending');
    const partialInvoices = filteredInvoicesByTimeframe.filter(inv => inv.paymentStatus === 'Partial');

    const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPartialAmount = partialInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    const cashRevenue = paidInvoices.filter(inv => inv.paymentMethod === 'Cash').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const onlineRevenue = paidInvoices.filter(inv => inv.paymentMethod === 'Online').reduce((sum, inv) => sum + inv.totalAmount, 0);

    const averageFee = count > 0 ? Math.round(totalBilled / count) : 0;

    return {
      count,
      totalRevenue,
      totalBilled,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      partialCount: partialInvoices.length,
      totalPaidAmount,
      totalPendingAmount,
      totalPartialAmount,
      cashRevenue,
      onlineRevenue,
      averageFee
    };
  }, [filteredInvoicesByTimeframe]);

  // Doctor share of revenue and patient count
  const doctorStats = useMemo(() => {
    const stats: { [name: string]: { amount: number; count: number; specialization: string } } = {};
    
    // Pre-populate active doctors
    doctors.forEach(doc => {
      stats[doc.name] = { amount: 0, count: 0, specialization: doc.specialization };
    });

    filteredInvoicesByTimeframe.forEach(inv => {
      const docName = inv.doctorName || 'Unknown Doctor';
      if (!stats[docName]) {
        stats[docName] = { amount: 0, count: 0, specialization: 'Specialist' };
      }
      stats[docName].count += 1;
      if (inv.paymentStatus === 'Paid') {
        stats[docName].amount += inv.totalAmount;
      }
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        specialization: data.specialization,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredInvoicesByTimeframe, doctors]);

  // Treatment Type breakdown
  const treatmentStats = useMemo(() => {
    const stats: { [type: string]: { amount: number; count: number } } = {};

    filteredInvoicesByTimeframe.forEach(inv => {
      const treatType = inv.treatment || 'Regular Checkup';
      if (!stats[treatType]) {
        stats[treatType] = { amount: 0, count: 0 };
      }
      stats[treatType].count += 1;
      if (inv.paymentStatus === 'Paid') {
        stats[treatType].amount += inv.totalAmount;
      }
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredInvoicesByTimeframe]);

  // Daily trend calculations for trend graph
  const dailyTrends = useMemo(() => {
    const trends: { [date: string]: number } = {};
    
    // Generate empty array of last N days depending on timeframe
    const today = new Date();
    let numDays = 7;
    if (timeframe === 'today') numDays = 1;
    else if (timeframe === 'week') numDays = 7;
    else if (timeframe === '28days') numDays = 28;
    else if (timeframe === '365days') numDays = 12; // aggregate by month for 365 days

    if (timeframe === '365days') {
      const monthlyTrends: { [monthStr: string]: { amount: number; count: number } } = {};
      // Initialize past 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(today.getMonth() - i);
        const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        monthlyTrends[monthKey] = { amount: 0, count: 0 };
      }

      filteredInvoicesByTimeframe.forEach(inv => {
        const d = new Date(inv.generatedAt);
        const monthKey = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        if (monthlyTrends[monthKey]) {
          monthlyTrends[monthKey].count += 1;
          if (inv.paymentStatus === 'Paid') {
            monthlyTrends[monthKey].amount += inv.totalAmount;
          }
        }
      });

      return Object.entries(monthlyTrends).map(([label, data]) => ({
        label,
        revenue: data.amount,
        tickets: data.count
      }));
    } else {
      // Daily initialize
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        trends[dateKey] = 0;
      }

      filteredInvoicesByTimeframe.forEach(inv => {
        const d = new Date(inv.generatedAt);
        const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (trends[dateKey] !== undefined && inv.paymentStatus === 'Paid') {
          trends[dateKey] += inv.totalAmount;
        }
      });

      return Object.entries(trends).map(([label, revenue]) => {
        const ticketsCount = filteredInvoicesByTimeframe.filter(inv => {
          const d = new Date(inv.generatedAt);
          const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return dateKey === label;
        }).length;

        return {
          label,
          revenue,
          tickets: ticketsCount
        };
      });
    }
  }, [filteredInvoicesByTimeframe, timeframe]);

  // Max value for scaling SVG charts
  const maxTrendValue = useMemo(() => {
    const maxVal = Math.max(...dailyTrends.map(t => t.revenue), 1);
    return Math.ceil(maxVal / 500) * 500; // Round to nearest 500
  }, [dailyTrends]);

  // Filter receipts for list table
  const searchFilteredReceipts = useMemo(() => {
    return filteredInvoicesByTimeframe.filter(inv => {
      const matchesSearch = 
        inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.treatment && inv.treatment.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inv.doctorName && inv.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [filteredInvoicesByTimeframe, searchQuery, statusFilter]);

  // Export filtered receipts as CSV using robust Blob URL to bypass browser iframe sandbox constraints
  const handleExportFilteredCSV = () => {
    let csvContent = "Invoice ID,Token No,Patient Name,Age,Gender,Doctor Name,Consultation Fee,Total Billed,Payment Status,Payment Method,Treatment,Date & Time\n";
    
    searchFilteredReceipts.forEach(inv => {
      const row = [
        inv.invoiceId,
        inv.tokenNumber,
        `"${inv.patientName.replace(/"/g, '""')}"`,
        inv.age,
        inv.gender,
        `"${inv.doctorName}"`,
        inv.doctorFee,
        inv.totalAmount,
        inv.paymentStatus,
        inv.paymentMethod,
        `"${inv.treatment || 'Regular Checkup'}"`,
        `"${new Date(inv.generatedAt).toLocaleString()}"`
      ].join(",");
      csvContent += row + "\n";
    });

    // Create a Blob with BOM for excel-friendly UTF-8 encoding
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ak_clinic_financial_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup URL and link
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="space-y-6 text-left" id="report-dashboard-container">
      {/* TIMEFRAME SELECTOR AND EXPORT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-gray-900 font-display flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#E74C4C]" />
            <span>Clinic Financial & Sales Reports</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Real-time visual reports of medical consulting slips and billing collections
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === 'today'
                  ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Today (Aaj)
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === 'week'
                  ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('28days')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === '28days'
                  ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              28 Days
            </button>
            <button
              onClick={() => setTimeframe('365days')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === '365days'
                  ? 'bg-white text-[#E74C4C] shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              365 Days
            </button>
          </div>

          <button
            onClick={handleExportFilteredCSV}
            disabled={searchFilteredReceipts.length === 0}
            className="inline-flex items-center gap-2 bg-[#E74C4C] hover:bg-[#E74C4C]/95 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[125px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Earning (Jama Rakam)</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                Rs. {metrics.totalRevenue.toLocaleString()}/-
              </h3>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-gray-500 flex items-center justify-between">
            <span>Billed: Rs. {metrics.totalBilled.toLocaleString()}</span>
            <span className="text-emerald-600 font-bold">100% Secure Rec</span>
          </div>
        </div>

        {/* Card 2: Tickets Count */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[125px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E74C4C]" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Receipt Sold</span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1 font-mono">
                {metrics.count} <span className="text-xs font-semibold text-gray-400">Parchi</span>
              </h3>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-50 text-[#E74C4C] flex items-center justify-center">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 text-[10px] text-gray-500 flex items-center justify-between">
            <span>Average Slip value:</span>
            <span className="font-bold text-gray-700 font-mono">Rs. {metrics.averageFee}/-</span>
          </div>
        </div>

        {/* Card 3: Paid vs Pending */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[125px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Settlement Status</span>
              <h3 className="text-base font-bold text-gray-900 mt-1 space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Paid: <strong className="font-mono text-gray-900">{metrics.paidCount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                  <span>Pending: <strong className="font-mono text-gray-900">{metrics.pendingCount}</strong></span>
                </div>
              </h3>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-50">
            <span>Pending Fees:</span>
            <span className="font-bold text-amber-700 font-mono">Rs. {metrics.totalPendingAmount}/-</span>
          </div>
        </div>

        {/* Card 4: Payments Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[125px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Payment Methods</span>
              <h3 className="text-base font-bold text-gray-900 mt-1 space-y-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium text-gray-500">Cash:</span>
                  <span className="font-mono text-gray-900 font-bold">Rs. {metrics.cashRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-medium text-gray-500">Online:</span>
                  <span className="font-mono text-gray-900 font-bold">Rs. {metrics.onlineRevenue.toLocaleString()}</span>
                </div>
              </h3>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-50">
            <span>Cash vs Digital:</span>
            <span className="font-bold text-purple-700 font-mono">
              {metrics.totalRevenue > 0 ? Math.round((metrics.cashRevenue / metrics.totalRevenue) * 100) : 50}% / {metrics.totalRevenue > 0 ? Math.round((metrics.onlineRevenue / metrics.totalRevenue) * 100) : 50}%
            </span>
          </div>
        </div>
      </div>

      {/* TREND GRAPH AND BREAKDOWNS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily/Monthly Earning Trend Graph (2 columns on desktop) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-950 font-display flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-[#E74C4C]" />
              <span>Financial Timeline & Daily Trend</span>
            </h3>
            <p className="text-[11px] text-gray-500">
              {timeframe === '365days' ? 'Monthly aggregation' : 'Daily sales record'} in Pakistan Rupees (PKR)
            </p>
          </div>

          {/* Visual Trend Bars (Responsive Custom Chart) */}
          <div className="mt-6 h-56 flex items-end gap-2 sm:gap-4 border-b border-gray-200 pb-2 relative" id="report-trend-chart">
            {/* Grid line values background */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4 text-[9px] text-gray-300 font-mono">
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">Rs. {maxTrendValue}</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">Rs. {Math.round(maxTrendValue * 0.75)}</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">Rs. {Math.round(maxTrendValue * 0.5)}</div>
              <div className="border-b border-dashed border-gray-100 w-full text-right pr-2">Rs. {Math.round(maxTrendValue * 0.25)}</div>
              <div className="w-full text-right pr-2">Rs. 0</div>
            </div>

            {dailyTrends.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                No revenue records found for this period.
              </div>
            ) : (
              dailyTrends.map((t, idx) => {
                const percentage = Math.max((t.revenue / maxTrendValue) * 100, 4); // Min 4% height so it's always hoverable
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] rounded py-1 px-2.5 whitespace-nowrap z-30 transition-all pointer-events-none font-mono shadow-md flex flex-col items-center">
                      <span className="font-sans font-bold text-gray-300">{t.label}</span>
                      <span className="text-[#E74C4C] font-black mt-0.5">Rs. {t.revenue.toLocaleString()}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{t.tickets} Slips Issued</span>
                    </div>

                    {/* Bar Pillar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${percentage}%` }}
                      transition={{ delay: idx * 0.02, duration: 0.5 }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        t.revenue > 0
                          ? 'bg-[#E74C4C] group-hover:bg-[#E74C4C]/90 shadow-sm shadow-[#E74C4C]/10'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    />
                    
                    {/* Tick Count Indicator inside block or above */}
                    {t.tickets > 0 && (
                      <span className="absolute bottom-full mb-0.5 text-[8px] font-bold text-gray-400 font-mono scale-90">
                        {t.tickets}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex gap-2 sm:gap-4 mt-2 justify-between px-1.5">
            {dailyTrends.map((t, idx) => {
              // Show selected labels depending on length to prevent overlapping
              const skip = dailyTrends.length > 10 ? (idx % Math.ceil(dailyTrends.length / 6) !== 0) : false;
              return (
                <div key={idx} className="flex-1 text-center truncate">
                  {!skip && (
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 font-mono">
                      {t.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor and Payment Breakdowns (1 column) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-5">
          {/* Doctor Earning Shares */}
          <div>
            <h3 className="text-sm font-black text-gray-950 font-display flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
              <PieChart className="h-4.5 w-4.5 text-[#E74C4C]" />
              <span>Earnings by Attending Doctor</span>
            </h3>
            
            <div className="mt-4 space-y-3.5 max-h-[170px] overflow-y-auto scrollbar-none">
              {doctorStats.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No active doctor earnings.</p>
              ) : (
                doctorStats.map((doc, idx) => {
                  const maxDocAmt = Math.max(...doctorStats.map(d => d.amount), 1);
                  const sharePercentage = Math.round((doc.amount / (metrics.totalRevenue || 1)) * 100);
                  const barProgress = (doc.amount / maxDocAmt) * 100;
                  
                  // Color cyclic logic
                  const colors = ['bg-rose-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
                  const colorClass = colors[idx % colors.length];

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-gray-800 flex items-center gap-1.5 truncate max-w-[150px]">
                          <span className={`h-2.5 w-2.5 rounded-full ${colorClass} shrink-0`} />
                          <span className="truncate">{doc.name}</span>
                        </div>
                        <div className="text-right font-bold text-gray-950 font-mono">
                          Rs. {doc.amount.toLocaleString()} <span className="text-[9px] text-gray-400">({doc.count})</span>
                        </div>
                      </div>
                      
                      {/* Progress Horizontal Bar */}
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barProgress}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${colorClass}`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Treatment Category Shares */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Consultation Types Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {treatmentStats.slice(0, 4).map((treat, idx) => {
                const percentage = metrics.count > 0 ? Math.round((treat.count / metrics.count) * 100) : 0;
                return (
                  <div key={idx} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-600 truncate block" title={treat.name}>
                      {treat.name}
                    </span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-black text-slate-900 font-mono">{treat.count}</span>
                      <span className="text-[9px] font-bold text-[#E74C4C]">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
              {treatmentStats.length === 0 && (
                <div className="col-span-2 text-center text-[11px] text-gray-400 py-2">
                  No treatments tracked.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED RECEIPTS LIST SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" id="report-detailed-receipts">
        {/* Header section with search & status filters */}
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-gray-950 font-display">
                Detailed Receipts Data & Register
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                Showing {searchFilteredReceipts.length} filtered entries from {timeframe === 'today' ? 'today\'s transactions' : 'selected timeframe'}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient name, doctor, treatment, or Invoice ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 text-xs focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
              />
            </div>

            {/* Status Selector */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#E74C4C] focus:outline-none transition-all bg-white font-semibold text-gray-700"
              >
                <option value="All">All Payment Status</option>
                <option value="Paid">Fully Paid Slips</option>
                <option value="Pending">Unpaid (Pending)</option>
                <option value="Partial">Partially Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th scope="col" className="px-6 py-4">Receipt Invoice ID</th>
                <th scope="col" className="px-6 py-4">Patient Name</th>
                <th scope="col" className="px-6 py-4">Attending Doctor</th>
                <th scope="col" className="px-6 py-4">Treatment Type</th>
                <th scope="col" className="px-6 py-4 text-center">Payment Status</th>
                <th scope="col" className="px-6 py-4 text-right">Earning Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-xs text-gray-700">
              {searchFilteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No receipts found matching your filters.
                  </td>
                </tr>
              ) : (
                searchFilteredReceipts.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/75 transition-colors">
                    {/* Invoice ID */}
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                      <div>{inv.invoiceId}</div>
                      <span className="text-[10px] text-gray-400 block mt-1 font-sans font-medium">
                        {new Date(inv.generatedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    
                    {/* Patient Name */}
                    <td className="px-6 py-4 align-middle">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{inv.patientName}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
                        <span>Age: <strong className="text-gray-600">{inv.age}</strong></span>
                        <span>Gender: <strong className="text-gray-600">{inv.gender}</strong></span>
                        <span>Token: <strong className="text-gray-600 font-mono">{inv.tokenNumber}</strong></span>
                      </div>
                    </td>

                    {/* Attending Doctor */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap font-semibold text-gray-800">
                      {inv.doctorName}
                    </td>

                    {/* Treatment Type */}
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {inv.treatment || 'Regular Checkup'}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.paymentStatus === 'Partial'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      }`}>
                        {inv.paymentStatus === 'Paid' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>PAID</span>
                          </>
                        ) : inv.paymentStatus === 'Partial' ? (
                          <>
                            <Clock className="h-3 w-3 text-indigo-600" />
                            <span>PARTIAL</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3 text-amber-600" />
                            <span>PENDING</span>
                          </>
                        )}
                      </span>
                      <span className="block text-[10px] text-gray-400 font-mono font-medium mt-1">
                        Via {inv.paymentMethod}
                      </span>
                    </td>

                    {/* Earning Fee */}
                    <td className="px-6 py-4 align-middle text-right font-mono font-black text-gray-900 text-sm whitespace-nowrap">
                      Rs. {inv.totalAmount}/-
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View for Receipts */}
        <div className="block md:hidden divide-y divide-gray-100">
          {searchFilteredReceipts.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-xs font-semibold">
              No receipts found matching filters.
            </div>
          ) : (
            searchFilteredReceipts.map((inv) => (
              <div key={inv.id} className="p-4 space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                      {inv.invoiceId}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                      Token #{inv.tokenNumber} • {new Date(inv.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    inv.paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {inv.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Patient:</span>
                    <span className="font-bold text-gray-900">{inv.patientName} ({inv.age}Y / {inv.gender})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attending Doctor:</span>
                    <span className="font-semibold text-gray-800">{inv.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Treatment:</span>
                    <span className="text-gray-700 font-medium">{inv.treatment || 'Regular Checkup'}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-dashed border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Method: <strong>{inv.paymentMethod}</strong></span>
                  <span className="font-mono font-black text-[#E74C4C] text-sm">Rs. {inv.totalAmount}/-</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
