import React from 'react';
import { Info, Printer, CheckCircle, HelpCircle } from 'lucide-react';

export default function PrinterGuide() {
  return (
    <div className="space-y-6 text-left" id="printer-guide-panel">
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold font-display text-gray-900 mb-4 flex items-center gap-2">
          <Printer className="h-5 w-5 text-[#E74C4C]" />
          <span>80mm Thermal Receipt Printer Setup Guide</span>
        </h2>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Receptionist bhai, website se direct parchi nikalne ke liye ek baar thermal printer ko sahi se windows aur browser mein configure karna zaroori hai. Neeche diye gaye simple steps ko follow karein.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74C4C]/10 text-[#E74C4C] font-bold text-sm">1</span>
            <h3 className="font-bold text-gray-900">Step 1: Windows Setup</h3>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Printer ko USB cable ke zariye computer se connect karein.</li>
              <li>Power on karein aur thermal roll (80mm size) feed karein.</li>
              <li>Windows Settings → <strong>Printers & Scanners</strong> kholkar printer ko select karein aur <strong>"Set as default"</strong> par click karein.</li>
            </ul>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74C4C]/10 text-[#E74C4C] font-bold text-sm">2</span>
            <h3 className="font-bold text-gray-900">Step 2: Paper Size Settings</h3>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Printer properties kholkar <strong>Printing Preferences</strong> mein jayein.</li>
              <li>Paper size ko <strong>80mm x 200mm</strong> ya custom <strong>Receipt</strong> scale par select karein taake parchi katne mein margin sahi ho.</li>
              <li>Save karke settings apply karein.</li>
            </ul>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 space-y-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E74C4C]/10 text-[#E74C4C] font-bold text-sm">3</span>
            <h3 className="font-bold text-gray-900">Step 3: Chrome Silent Print</h3>
            <ul className="text-xs text-gray-600 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Direct printing (bina browser dialog ke) ke liye Chrome shortcut par right click karke <strong>Properties</strong> mein jayein.</li>
              <li>Target field ke bilkul aakhir mein space dekar yeh code add karein: <code className="bg-gray-200 px-1 py-0.5 rounded font-mono font-bold text-[#E74C4C]">--kiosk-printing</code></li>
              <li>Is se "Print Parchi" dabaate hi bina kisi click ke ticket seedha machine se nikal aayegi.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Recommended Hardware (Pakistan/India)</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="p-2">Brand / Model</th>
                  <th className="p-2">Est. Price (PKR)</th>
                  <th className="p-2">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="p-2 font-semibold text-gray-900">Epson TM-T82 III</td>
                  <td className="p-2">Rs. 15,000</td>
                  <td className="p-2 text-emerald-600 font-medium">Best & Highly Reliable</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-gray-900">TVS RP-45 / Xprinter</td>
                  <td className="p-2">Rs. 8,000 - 12,000</td>
                  <td className="p-2">Budget Friendly option</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-amber-500" />
            <span>Quick Troubleshooting & Hacks</span>
          </h3>
          <ul className="text-xs text-gray-600 space-y-2.5">
            <li>
              <strong>Parchi khali nikal rahi hai?</strong> Thermal roll ulta laga ho sakta hai. Roll ko nikal kar doosri taraf se feed karein.
            </li>
            <li>
              <strong>Margins kharab hain ya text kat raha hai?</strong> Browser Print Settings mein Margin ko "None" par aur Scale ko "Default" ya "100" par set karein.
            </li>
            <li>
              <strong>Parchi pe headers aur footers (URL, Page date) aa raha hai?</strong> Print settings layout kholkar "Headers and footers" ka checkbox uncheck karein.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
