"use client";

import Image from "next/image";
import { CardData } from "@/types/types";
import Barcode from "./Barcode";

interface IDCardProps {
  data: CardData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function IDCard({ data }: IDCardProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-lg font-sans">
      {/* Top blue bar */}
      <div className="h-3 bg-blue-600 rounded-t-2xl" />

      {/* Logo row */}
      <div className="flex justify-end items-center px-5 pt-3 pb-1 gap-2">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900 tracking-wide leading-none">
            {data.orgName || "ORG NAME"}
          </p>
          <p className="text-[9px] text-gray-400 tracking-wider mt-0.5">
            {data.orgTagline || "Organisation Tagline"}
          </p>
        </div>
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* Card body */}
      <div className="flex gap-4 px-5 pb-5 pt-2 items-start flex-wrap sm:flex-nowrap">
        {/* Left column: photo + barcode */}
        <div className="flex flex-col items-center gap-2 min-w-[90px]">
          {/* Photo */}
          <div className="w-[88px] h-[88px] rounded-full border-2 border-blue-100 overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            {data.photoUrl ? (
              <img
                src={data.photoUrl}
                alt="Employee photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
          </div>

          {/* Barcode */}
          <div className="flex flex-col items-center gap-0.5">
            <Barcode value={data.employeeId || "EMP0000"} />
            <span className="text-[9px] font-semibold text-gray-700 tracking-widest">
              {data.employeeId || "EMP0000"}
            </span>
          </div>
        </div>

        {/* Right column: info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
            {data.name || "Full Name"}
          </h2>
          <p className="text-sm font-semibold text-blue-600 mt-0.5 truncate">
            {data.role || "Role"}
          </p>
          <p className="text-xs text-gray-500 mb-3 truncate">
            {data.department || "Department"}
          </p>

          <div className="flex flex-col gap-1.5">
            {[
              { label: "Employee ID", value: data.employeeId },
              { label: "Date of Joining", value: formatDate(data.dateOfJoining) },
              { label: "Email", value: data.email },
              { label: "Phone", value: data.phone },
              { label: "Blood Group", value: data.bloodGroup },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-baseline gap-1 text-[11px]">
                <span className="text-gray-500 min-w-[82px] flex-shrink-0">{label}</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-900 font-medium truncate">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom blue bar */}
      <div className="h-11 bg-blue-600 rounded-b-2xl flex items-center justify-end px-5">
        <div className="text-right">
          <p className="text-white text-sm italic opacity-80 leading-none font-light">Authorised</p>
          <p className="text-white text-[9px] tracking-widest opacity-60 mt-0.5">Authorised Signatory</p>
        </div>
      </div>
    </div>
  );
}
