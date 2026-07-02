// Lightweight client-side export helpers used across the recruitment module.
// CSV export opens cleanly in Excel / Google Sheets; PDF export builds a
// simple formatted report using jsPDF + jspdf-autotable.

export function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const str = String(val ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function exportToPdf(
  title: string,
  subtitle: string,
  sections: { heading: string; head: string[]; body: (string | number)[][] }[],
  filename: string
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(11, 43, 38);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, 40, 34);
  doc.setFontSize(10);
  doc.setTextColor(201, 162, 75);
  doc.text(subtitle, 40, 52);

  let cursorY = 96;
  doc.setTextColor(20, 20, 20);

  sections.forEach((section) => {
    doc.setFontSize(12);
    doc.setTextColor(11, 43, 38);
    doc.text(section.heading, 40, cursorY);
    cursorY += 10;

    autoTable(doc, {
      startY: cursorY,
      head: [section.head],
      body: section.body,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [11, 43, 38], textColor: 255 },
      alternateRowStyles: { fillColor: [246, 247, 244] },
      margin: { left: 40, right: 40 },
    });

    // @ts-expect-error - lastAutoTable is attached by the plugin at runtime
    cursorY = doc.lastAutoTable.finalY + 28;
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

export async function generateOfferLetterPdf(offer: {
  candidateName: string;
  position: string;
  department: string;
  salaryOffered: number;
  joiningDate: string;
  recruiter: string;
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(11, 43, 38);
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Meridian HRMS", 40, 40);
  doc.setFontSize(11);
  doc.setTextColor(201, 162, 75);
  doc.text("Offer of Employment", 40, 62);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  const today = new Date().toDateString();
  const lines = [
    `Date: ${today}`,
    "",
    `Dear ${offer.candidateName},`,
    "",
    `We are delighted to offer you the position of ${offer.position} within our ${offer.department}`,
    `team. This letter confirms the key terms of your employment with Meridian HRMS.`,
    "",
    `Annual Compensation (CTC):  ${formatCurrencyPlain(offer.salaryOffered)}`,
    `Proposed Joining Date:      ${new Date(offer.joiningDate).toDateString()}`,
    `Reporting Recruiter:        ${offer.recruiter}`,
    "",
    "This offer is contingent upon successful completion of standard background",
    "verification checks. Please review and respond to this offer at your earliest",
    "convenience via the candidate portal.",
    "",
    "We look forward to welcoming you to the team.",
    "",
    "Warm regards,",
    "Talent Acquisition Team",
    "Meridian HRMS",
  ];

  let y = 130;
  lines.forEach((line) => {
    doc.text(line, 40, y);
    y += 18;
  });

  doc.save(`offer-letter-${offer.candidateName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function formatCurrencyPlain(amount: number): string {
  if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(1)} Lakhs per annum`;
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}
