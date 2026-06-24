"use client";

import { useState, useRef } from "react";
import IDCard from "@/components/IDCard";
import FormFields from "@/components/FormFields";
import { CardData, DEFAULT_CARD_DATA } from "@/types/types";

export default function Home() {
  const [data, setData] = useState<CardData>(DEFAULT_CARD_DATA);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleChange(field: keyof CardData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset() {
    setData(DEFAULT_CARD_DATA);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 leading-none">ID Card Generator</h1>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the form to preview your card</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              onClick={handlePrint}
              className="text-xs text-white bg-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-700 transition flex items-center gap-1.5 print:hidden"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Form Panel */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 print:hidden">
            <h2 className="text-sm font-semibold text-gray-700 mb-5">Card Details</h2>
            <FormFields data={data} onChange={handleChange} />
          </section>

          {/* Preview Panel */}
          <section className="lg:sticky lg:top-8">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 print:hidden">
              Live Preview
            </p>
            <div ref={cardRef} className="print:shadow-none">
              <IDCard data={data} />
            </div>
          </section>

        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          [data-print-target], [data-print-target] * { visibility: visible; }
          @page { margin: 0; size: auto; }
        }
      `}</style>
    </main>
  );
}
