import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, FileText, Check, X, Trash2, Search, Download, ShieldCheck, 
  Heart, User, Activity, AlertCircle, Calendar, Clock, 
  Printer, Plus, DollarSign, Users, Info, RefreshCw, ToggleLeft, ToggleRight, Settings,
  Phone, MessageSquare, TrendingUp
} from 'lucide-react';
import { AppointmentRequest, Doctor, Token, Invoice } from '../types';
import { db, appointmentsRef, doctorsRef, tokensRef, invoicesRef, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from '../lib/firebase';

// Import newly created modular subcomponents
import WalkInRegistration from './WalkInRegistration';
import DoctorManagement from './DoctorManagement';
import BillingManagement from './BillingManagement';
import PrinterGuide from './PrinterGuide';
import ReportDashboard from './ReportDashboard';

// Real-time printing functions using 80mm thermal receipt formats
// Robust hidden iframe printing helper to bypass browser popup blockers and iframe sandbox restrictions
const printHTMLContent = (htmlContent: string, title: string) => {
  try {
    const existingFrame = document.getElementById('print-iframe');
    if (existingFrame) {
      existingFrame.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      throw new Error("Could not access iframe document");
    }

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } else {
          throw new Error("contentWindow not available");
        }
      } catch (err) {
        console.error("Iframe printing failed, using fallback window:", err);
        fallbackPrintWindow(htmlContent, title);
      }
    }, 350);

  } catch (error) {
    console.error("Iframe initialization failed, using fallback window:", error);
    fallbackPrintWindow(htmlContent, title);
  }
};

const fallbackPrintWindow = (htmlContent: string, title: string) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) {
    alert("Please allow popups or open this app in a new tab to print tickets/invoices!");
    return;
  }
  
  // Inject automated printing script only for the new window fallback
  const windowContent = htmlContent.replace('</body>', `
    <script>
      window.onload = function() {
        window.print();
        setTimeout(function() { window.close(); }, 500);
      };
    </script>
    </body>
  `);

  printWindow.document.open();
  printWindow.document.write(windowContent);
  printWindow.document.close();
};

// Real-time printing functions using 80mm thermal receipt formats
const printTokenTicket = (token: Token) => {
  const formattedDate = new Date(token.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const formattedTime = new Date(token.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const htmlContent = `
    <html>
    <head>
      <title>Token Parchi - ${token.tokenNumber}</title>
      <style>
        @page { margin: 0; }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 80mm;
          margin: 0;
          padding: 5mm;
          box-sizing: border-box;
          font-size: 12.5px;
          color: #000;
          background: #fff;
          line-height: 1.3;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .large { font-size: 16px; }
        .xlarge { font-size: 28px; }
        .divider { border-top: 1px dashed #000; margin: 4mm 0; }
        .details-table { width: 100%; margin: 2mm 0; }
        .details-table td { padding: 2px 0; }
        .details-table td.label { width: 40%; font-weight: bold; }
        .barcode { font-size: 11px; margin-top: 5mm; letter-spacing: 2px; }
      </style>
    </head>
    <body>
      <div class="center bold large">A K CLINIC</div>
      <div class="center" style="font-size: 10px;">Hijri Road near Sania Tower, Karachi</div>
      <div class="center" style="font-size: 10px;">Phone: +92 327 8259230</div>
      <div class="divider"></div>
      <div class="center bold">TOKEN / PARCHI</div>
      <div class="center bold xlarge" style="margin: 2mm 0;">${token.tokenNumber}</div>
      <div class="center" style="font-size: 10px;">Date: ${formattedDate}</div>
      <div class="center" style="font-size: 10px;">Time: ${formattedTime}</div>
      <div class="divider"></div>
      <div class="bold">PATIENT DETAILS</div>
      <table class="details-table">
        <tr><td class="label">Name:</td><td>${token.fullName}</td></tr>
        <tr><td class="label">Age:</td><td>${token.dob && (token.dob.includes('Month') || token.dob.includes('Year')) ? token.dob : token.age + ' Years'}</td></tr>
        <tr><td class="label">Gender:</td><td>${token.gender}</td></tr>
      </table>
      <div class="divider"></div>
      <div class="bold">ASSIGNED DOCTOR & TREATMENT</div>
      <table class="details-table">
        <tr><td class="label">Doctor:</td><td>${token.doctorName}</td></tr>
        <tr><td class="label">Treatment:</td><td>${token.treatment || 'Regular Checkup'}</td></tr>
        <tr><td class="label">Specialty:</td><td>${token.doctorSpecialization}</td></tr>
        <tr><td class="label">Fee:</td><td class="bold">Rs. ${token.doctorFee}/-</td></tr>
      </table>
      <div class="divider"></div>
      <div class="center" style="font-size: 10px; font-style: italic; line-height: 1.4;">
        Please wait for your turn.<br>Thank you!
      </div>
      <div class="center barcode bold">*TK-${token.tokenNumber}*</div>
    </body>
    </html>
  `;

  printHTMLContent(htmlContent, `Token Parchi - ${token.tokenNumber}`);
};

const printBillingInvoice = (invoice: Invoice) => {
  const formattedDate = new Date(invoice.generatedAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const formattedTime = new Date(invoice.generatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const htmlContent = `
    <html>
    <head>
      <title>Invoice - ${invoice.invoiceId}</title>
      <style>
        @page { margin: 0; }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 80mm;
          margin: 0;
          padding: 5mm;
          box-sizing: border-box;
          font-size: 12px;
          color: #000;
          background: #fff;
          line-height: 1.3;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .large { font-size: 16px; }
        .xlarge { font-size: 20px; }
        .divider { border-top: 1px dashed #000; margin: 4mm 0; }
        .details-table { width: 100%; margin: 2mm 0; }
        .details-table td { padding: 2px 0; }
        .details-table td.label { width: 45%; font-weight: bold; }
        .total-row { font-size: 13px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="center bold large">A K CLINIC</div>
      <div class="center" style="font-size: 10px;">Hijri Road near Sania Tower, Karachi</div>
      <div class="center" style="font-size: 10px;">Phone: +92 327 8259230</div>
      <div class="divider"></div>
      <div class="center bold">INVOICE / BILL SLIP</div>
      <div class="center bold xlarge" style="margin: 1mm 0;">${invoice.invoiceId}</div>
      <div class="center" style="font-size: 10px;">Date: ${formattedDate}</div>
      <div class="center" style="font-size: 10px;">Time: ${formattedTime}</div>
      <div class="divider"></div>
      <table class="details-table">
        <tr><td class="label">Patient:</td><td>${invoice.patientName}</td></tr>
        <tr><td class="label">Age/Gender:</td><td>${invoice.dob && (invoice.dob.includes('Month') || invoice.dob.includes('Year')) ? invoice.dob : invoice.age + 'Y'} / ${invoice.gender}</td></tr>
        <tr><td class="label">Token No:</td><td class="bold">${invoice.tokenNumber}</td></tr>
      </table>
      <div class="divider"></div>
      <table class="details-table">
        <tr><td class="label">Doctor:</td><td>${invoice.doctorName}</td></tr>
        <tr><td class="label">Treatment:</td><td>${invoice.treatment || 'Regular Checkup'}</td></tr>
        <tr><td class="label">Consultation Fee:</td><td>Rs. ${invoice.doctorFee}/-</td></tr>
        <tr class="total-row"><td colspan="2"><div class="divider"></div></td></tr>
        <tr class="total-row"><td class="label">TOTAL AMOUNT:</td><td>Rs. ${invoice.totalAmount}/-</td></tr>
      </table>
      <div class="divider"></div>
      <table class="details-table">
        <tr><td class="label">Payment Status:</td><td class="bold">${invoice.paymentStatus.toUpperCase()} ✓</td></tr>
        <tr><td class="label">Payment Method:</td><td>${invoice.paymentMethod}</td></tr>
      </table>
      <div class="divider"></div>
      <div class="center" style="font-size: 10px; font-style: italic; line-height: 1.4;">
        Thank you!<br>Get well soon!
      </div>
    </body>
    </html>
  `;

  printHTMLContent(htmlContent, `Invoice - ${invoice.invoiceId}`);
};

const formatWhatsAppLink = (phone: string, fullName: string, service: string, date: string, timeSlot: string) => {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('03')) {
    cleanPhone = '92' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
    cleanPhone = '92' + cleanPhone;
  }
  
  const text = `Assalam-o-Alaikum ${fullName}, A K Clinic se baat kar rahe hain. Aap ne ${service} ke liye ${date} (${timeSlot}) par online appointment inquiry bheji thi. Kya hum aapki appointment confirm kar dein?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

const formatCallLink = (phone: string) => {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
    return `tel:${cleanPhone}`;
  }
  if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
    return `tel:0${cleanPhone}`;
  }
  return `tel:${phone}`;
};

export default function AdminPortal() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  // Tabs: walkin_registration, online_leads, doctors, billing, printer_guide, reports
  const [activeTab, setActiveTab] = useState<'walkin_registration' | 'online_leads' | 'doctors' | 'billing' | 'printer_guide' | 'reports'>('walkin_registration');

  // Multi-model databases loaded from local storage
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Filters for online appointments
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Load datasets on mount and sync with Firestore in real-time
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-CA');

    // Seed helpers
    const defaultAppointments: AppointmentRequest[] = [
      {
        id: "APT-X98A1B",
        fullName: "Muhammad Yousuf",
        phone: "03212891901",
        email: "yousuf.khi@gmail.com",
        service: "Respiratory Health Care",
        date: new Date().toLocaleDateString('en-CA'),
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
        date: new Date().toLocaleDateString('en-CA'),
        timeSlot: "05:00 PM - 05:30 PM",
        message: "Weight assessment and dietary recommendations for 2-year old toddler.",
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];

    const defaultDoctors: Doctor[] = [
      { id: 'doc-1', name: 'Dr. Ali Raza Imran', specialization: 'General Physician', fee: 500, isActive: true },
      { id: 'doc-2', name: 'Dr. Khan Shaheen', specialization: 'Pediatric Specialist', fee: 600, isActive: true },
      { id: 'doc-3', name: 'Dr. Sana Fatima', specialization: 'Gynecologist', fee: 700, isActive: true }
    ];

    const defaultTokens: Token[] = [
      {
        id: 'tk-1',
        tokenNumber: '001',
        fullName: 'Mohammad Yousuf',
        dob: '1995-03-15',
        age: 31,
        gender: 'Male',
        doctorId: 'doc-1',
        doctorName: 'Dr. Ali Raza Imran',
        doctorSpecialization: 'General Physician',
        doctorFee: 500,
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        date: todayStr
      },
      {
        id: 'tk-2',
        tokenNumber: '002',
        fullName: 'Ayesha Bibi',
        dob: '2024-05-12',
        age: 2,
        gender: 'Female',
        doctorId: 'doc-2',
        doctorName: 'Dr. Khan Shaheen',
        doctorSpecialization: 'Pediatric Specialist',
        doctorFee: 600,
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        date: todayStr
      }
    ];

    const defaultInvoices: Invoice[] = [
      {
        id: 'inv-1',
        invoiceId: `INV-2026-0001`,
        tokenNumber: '001',
        patientName: 'Mohammad Yousuf',
        age: 31,
        gender: 'Male',
        doctorName: 'Dr. Ali Raza Imran',
        doctorFee: 500,
        totalAmount: 500,
        paymentStatus: 'Paid',
        paymentMethod: 'Cash',
        generatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'inv-2',
        invoiceId: `INV-2026-0002`,
        tokenNumber: '002',
        patientName: 'Ayesha Bibi',
        age: 2,
        gender: 'Female',
        doctorName: 'Dr. Khan Shaheen',
        doctorFee: 600,
        totalAmount: 600,
        paymentStatus: 'Paid',
        paymentMethod: 'Online',
        generatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ];

    // 1. Listen for Appointments real-time
    const unsubscribeAppointments = onSnapshot(appointmentsRef, (snapshot) => {
      const list: AppointmentRequest[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as AppointmentRequest);
      });
      // Sort by creation time descending
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (list.length > 0) {
        setAppointments(list);
        localStorage.setItem('ak_clinic_appointments', JSON.stringify(list));
      } else {
        // If Firestore is empty, seed from localStorage or defaults
        const stored = localStorage.getItem('ak_clinic_appointments');
        const initial = stored ? JSON.parse(stored) : defaultAppointments;
        initial.forEach((apt: AppointmentRequest) => {
          setDoc(doc(db, 'appointments', apt.id), apt).catch(console.error);
        });
        setAppointments(initial);
      }
    });

    // 2. Listen for Doctors real-time
    const unsubscribeDoctors = onSnapshot(doctorsRef, (snapshot) => {
      const list: Doctor[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Doctor);
      });
      if (list.length > 0) {
        setDoctors(list);
        localStorage.setItem('ak_clinic_doctors', JSON.stringify(list));
      } else {
        const stored = localStorage.getItem('ak_clinic_doctors');
        const initial = stored ? JSON.parse(stored) : defaultDoctors;
        initial.forEach((docItem: Doctor) => {
          setDoc(doc(db, 'doctors', docItem.id), docItem).catch(console.error);
        });
        setDoctors(initial);
      }
    });

    // 3. Listen for Tokens real-time
    const unsubscribeTokens = onSnapshot(tokensRef, (snapshot) => {
      const list: Token[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Token);
      });
      if (list.length > 0) {
        setTokens(list);
        localStorage.setItem('ak_clinic_tokens', JSON.stringify(list));
      } else {
        const stored = localStorage.getItem('ak_clinic_tokens');
        const initial = stored ? JSON.parse(stored) : defaultTokens;
        initial.forEach((tk: Token) => {
          setDoc(doc(db, 'tokens', tk.id), tk).catch(console.error);
        });
        setTokens(initial);
      }
    });

    // 4. Listen for Invoices real-time
    const unsubscribeInvoices = onSnapshot(invoicesRef, (snapshot) => {
      const list: Invoice[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Invoice);
      });
      if (list.length > 0) {
        setInvoices(list);
        localStorage.setItem('ak_clinic_invoices', JSON.stringify(list));
      } else {
        const stored = localStorage.getItem('ak_clinic_invoices');
        const initial = stored ? JSON.parse(stored) : defaultInvoices;
        initial.forEach((inv: Invoice) => {
          setDoc(doc(db, 'invoices', inv.id), inv).catch(console.error);
        });
        setInvoices(initial);
      }
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeDoctors();
      unsubscribeTokens();
      unsubscribeInvoices();
    };
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

  // Online Appointments handlers
  const updateStatus = async (id: string, newStatus: 'Confirmed' | 'Cancelled') => {
    try {
      await setDoc(doc(db, 'appointments', id), { status: newStatus }, { merge: true });
    } catch (err) {
      console.error("Error updating appointment status in Firestore:", err);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment request?')) {
      try {
        await deleteDoc(doc(db, 'appointments', id));
      } catch (err) {
        console.error("Error deleting appointment from Firestore:", err);
      }
    }
  };

  // 1. Doctor Management Actions
  const handleAddDoctor = async (name: string, specialization: string, fee: number) => {
    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name,
      specialization,
      fee,
      isActive: true
    };
    try {
      await setDoc(doc(db, 'doctors', newDoc.id), newDoc);
    } catch (err) {
      console.error("Error adding doctor to Firestore:", err);
    }
  };

  const handleToggleDoctorActive = async (id: string) => {
    const d = doctors.find(item => item.id === id);
    if (!d) return;
    try {
      await setDoc(doc(db, 'doctors', id), { isActive: !d.isActive }, { merge: true });
    } catch (err) {
      console.error("Error toggling doctor active in Firestore:", err);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Kya aap waqai is doctor ko roster se nikalna chahte hain?')) {
      try {
        await deleteDoc(doc(db, 'doctors', id));
      } catch (err) {
        console.error("Error deleting doctor from Firestore:", err);
      }
    }
  };

  // 2. Token generation with auto daily reset
  const handleGenerateToken = (
    fullName: string,
    dob: string,
    age: number,
    gender: 'Male' | 'Female' | 'Other',
    doctorId: string,
    paymentStatus: 'Paid' | 'Pending',
    paymentMethod: 'Cash' | 'Online',
    treatment?: string
  ): Token => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // Count today's existing tokens to automatically set sequence starting at 1
    const todayTokens = tokens.filter(t => t.date === todayStr);
    const nextNum = todayTokens.length + 1;
    const tokenNumberStr = String(nextNum).padStart(3, '0');

    const selectedDoc = doctors.find(d => d.id === doctorId)!;

    const newToken: Token = {
      id: `tk-${Date.now()}`,
      tokenNumber: tokenNumberStr,
      fullName,
      dob,
      age,
      gender,
      doctorId,
      doctorName: selectedDoc.name,
      doctorSpecialization: selectedDoc.specialization,
      doctorFee: selectedDoc.fee,
      status: 'WAITING',
      createdAt: new Date().toISOString(),
      date: todayStr,
      treatment: treatment || 'Regular Checkup'
    };

    // Create corresponding Invoice
    const invoiceNum = invoices.length + 1;
    const invoiceIdStr = `INV-${year}-${String(invoiceNum).padStart(4, '0')}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceId: invoiceIdStr,
      tokenNumber: tokenNumberStr,
      patientName: fullName,
      age,
      gender,
      doctorName: selectedDoc.name,
      doctorFee: selectedDoc.fee,
      totalAmount: selectedDoc.fee,
      paymentStatus: paymentStatus as any,
      paymentMethod,
      generatedAt: new Date().toISOString(),
      dob: dob,
      treatment: treatment || 'Regular Checkup'
    };

    // Save to Firestore in background without blocking
    setDoc(doc(db, 'tokens', newToken.id), newToken).catch(err => {
      console.error("Error saving token to Firestore in background:", err);
    });
    setDoc(doc(db, 'invoices', newInvoice.id), newInvoice).catch(err => {
      console.error("Error saving invoice to Firestore in background:", err);
    });

    // Launch instant physical thermal print pop-up
    printTokenTicket(newToken);

    return newToken;
  };

  const handleUpdateTokenStatus = async (id: string, status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await setDoc(doc(db, 'tokens', id), { status }, { merge: true });
    } catch (err) {
      console.error("Error updating token status in Firestore:", err);
    }
  };

  const handlePrintInvoiceByTokenId = (tokenId: string) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    // Find invoice with matching token number from today
    const invoice = invoices.find(inv => inv.tokenNumber === token.tokenNumber && inv.patientName === token.fullName);
    if (invoice) {
      printBillingInvoice(invoice);
    } else {
      alert("Billing invoice for this token was not found!");
    }
  };

  // 3. Billing Invoice handlers
  const handleUpdatePaymentStatus = async (id: string, status: 'Paid' | 'Pending' | 'Partial') => {
    try {
      await setDoc(doc(db, 'invoices', id), { paymentStatus: status }, { merge: true });
    } catch (err) {
      console.error("Error updating payment status in Firestore:", err);
    }
  };

  const handleUpdateInvoiceDetails = async (
    id: string,
    updates: { doctorName: string; doctorFee: number; totalAmount: number; treatment: string }
  ) => {
    try {
      // Update Invoice in Firestore
      await setDoc(doc(db, 'invoices', id), updates, { merge: true });

      // Find and update corresponding Token for consistency
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        const token = tokens.find(t => t.tokenNumber === invoice.tokenNumber && t.fullName === invoice.patientName);
        if (token) {
          const matchedDoc = doctors.find(d => d.name === updates.doctorName);
          await setDoc(doc(db, 'tokens', token.id), {
            doctorName: updates.doctorName,
            doctorFee: updates.doctorFee,
            doctorSpecialization: matchedDoc ? matchedDoc.specialization : token.doctorSpecialization,
            doctorId: matchedDoc ? matchedDoc.id : token.doctorId,
            treatment: updates.treatment
          }, { merge: true });
        }
      }
    } catch (err) {
      console.error("Error updating invoice details in Firestore:", err);
    }
  };

  // Export CSV for web inquiries
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

  // Online list search filter computations
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = 
        apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        apt.phone.includes(searchQuery) ||
        apt.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesService = serviceFilter === 'All' || apt.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter]);

  const uniqueServices = useMemo(() => {
    return Array.from(new Set(appointments.map(a => a.service)));
  }, [appointments]);

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
              Enter the medical passcode to access walk-in parchi management, billing sheets, and scheduling.
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
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8 text-left" id="admin-dashboard-view">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Responsive Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#E74C4C]">
              <ShieldCheck className="h-4 w-4" />
              <span>A K Clinic System Administration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-gray-950 mt-1">
              Clinic Command Center
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 transition-all active:scale-[0.98]"
              id="admin-logout-btn"
            >
              Logout Panel
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS (Highly responsive with sliding/wrapping flex container) */}
        <div className="flex overflow-x-auto gap-1 bg-white p-1.5 rounded-xl border border-gray-200 scrollbar-none">
          <button
            onClick={() => { setActiveTab('walkin_registration'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'walkin_registration'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Walk-in & Queue</span>
          </button>

          <button
            onClick={() => { setActiveTab('billing'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'billing'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Billing & Invoices</span>
          </button>

          <button
            onClick={() => { setActiveTab('reports'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'reports'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Sales Reports</span>
          </button>

          <button
            onClick={() => { setActiveTab('online_leads'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'online_leads'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Online Inquiries ({appointments.filter(a => a.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('doctors'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'doctors'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Doctors Roster</span>
          </button>

          <button
            onClick={() => { setActiveTab('printer_guide'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
              activeTab === 'printer_guide'
                ? 'bg-[#E74C4C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Printer className="h-4 w-4" />
            <span>Printer Guide</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="space-y-6">
          {activeTab === 'walkin_registration' && (
            <WalkInRegistration
              doctors={doctors}
              tokens={tokens}
              onGenerateToken={handleGenerateToken}
              onUpdateTokenStatus={handleUpdateTokenStatus}
              onPrintToken={printTokenTicket}
              onPrintInvoiceByTokenId={handlePrintInvoiceByTokenId}
            />
          )}

          {activeTab === 'billing' && (
            <BillingManagement
              invoices={invoices}
              doctors={doctors}
              onPrintInvoice={printBillingInvoice}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onUpdateInvoiceDetails={handleUpdateInvoiceDetails}
            />
          )}

          {activeTab === 'reports' && (
            <ReportDashboard
              invoices={invoices}
              tokens={tokens}
              doctors={doctors}
            />
          )}

          {activeTab === 'doctors' && (
            <DoctorManagement
              doctors={doctors}
              onAddDoctor={handleAddDoctor}
              onToggleDoctorActive={handleToggleDoctorActive}
              onDeleteDoctor={handleDeleteDoctor}
            />
          )}

          {activeTab === 'printer_guide' && (
            <PrinterGuide />
          )}

          {activeTab === 'online_leads' && (
            <div className="space-y-6">
              {/* Toolbar with Search and Download CSV */}
              <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4" id="admin-search-bar">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, ticket ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-[#E74C4C] focus:outline-none transition-all bg-white font-medium"
                  >
                    <option value="All">All Inquiries</option>
                    <option value="Pending">Awaiting Confirmation (Pending)</option>
                    <option value="Confirmed">Scheduled & Confirmed</option>
                    <option value="Cancelled">Cancelled Requests</option>
                  </select>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all w-full"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Desktop view Table */}
              <div className="hidden lg:block rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden" id="admin-leads-table">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="px-6 py-4">Reference ID</th>
                        <th scope="col" className="px-6 py-4">Patient Information</th>
                        <th scope="col" className="px-6 py-4">Desired Service</th>
                        <th scope="col" className="px-6 py-4">Target Schedule</th>
                        <th scope="col" className="px-6 py-4 text-center">Status</th>
                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                            No patient inquiries found matching search.
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
                              <div className="text-xs text-gray-500 mt-1 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <span>Phone: <strong className="text-gray-900 font-mono">{apt.phone}</strong></span>
                                  <a
                                    href={formatCallLink(apt.phone)}
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all"
                                    title="Call Patient"
                                  >
                                    <Phone className="h-3.5 w-3.5" />
                                  </a>
                                  <a
                                    href={formatWhatsAppLink(apt.phone, apt.fullName, apt.service, apt.date, apt.timeSlot)}
                                    target="_blank"
                                    rel="noreferrer"
                                    referrerPolicy="no-referrer"
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all"
                                    title="WhatsApp Patient"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                                {apt.email && apt.email !== "No email provided" && <span className="truncate max-w-[200px]">Email: {apt.email}</span>}
                              </div>
                              {apt.message && (
                                <p className="mt-2 text-xs italic bg-slate-50 border-l-2 border-slate-300 pl-2 py-0.5 text-gray-600 max-w-sm rounded-r">
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

              {/* Mobile Card view for online inquires */}
              <div className="block lg:hidden space-y-4" id="admin-leads-cards">
                {filteredAppointments.length === 0 ? (
                  <div className="rounded-xl bg-white p-12 text-center text-gray-400 border border-gray-200">
                    No inquiries found.
                  </div>
                ) : (
                  filteredAppointments.map((apt) => (
                    <div key={apt.id} className="rounded-xl bg-white p-5 shadow-sm border border-gray-200 space-y-4 relative overflow-hidden text-left">
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                        apt.status === 'Confirmed' 
                          ? 'bg-emerald-500' 
                          : apt.status === 'Cancelled'
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                      }`} />

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

                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span>{apt.fullName}</span>
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          Inquiry Date: {new Date(apt.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                          <span>Phone: <strong className="font-mono text-gray-950">{apt.phone}</strong></span>
                          <a
                            href={formatCallLink(apt.phone)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all"
                            title="Call Patient"
                          >
                            <Phone className="h-3 w-3" />
                          </a>
                          <a
                            href={formatWhatsAppLink(apt.phone, apt.fullName, apt.service, apt.date, apt.timeSlot)}
                            target="_blank"
                            rel="noreferrer"
                            referrerPolicy="no-referrer"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 active:scale-95 transition-all"
                            title="WhatsApp Patient"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </a>
                        </div>
                        {apt.email && apt.email !== "No email provided" && <p className="text-xs text-gray-500">Email: {apt.email}</p>}
                        {apt.message && <p className="text-xs italic bg-gray-50 p-2 rounded">"{apt.message}"</p>}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="inline-block rounded-full bg-[#E74C4C]/10 px-2.5 py-1 text-xs font-semibold text-[#E74C4C]">
                          {apt.service}
                        </span>

                        <div className="flex gap-1">
                          {apt.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(apt.id, 'Confirmed')}
                                className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1.5 rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(apt.id, 'Cancelled')}
                                className="bg-red-50 text-red-700 font-bold text-xs px-2.5 py-1.5 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 p-2 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
