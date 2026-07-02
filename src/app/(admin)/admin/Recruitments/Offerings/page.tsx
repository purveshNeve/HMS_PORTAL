"use client";

import { useMemo, useState } from "react";
import { FileSignature, Send, CheckCircle2, HandCoins } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { OfferFilters } from "@/components/recruitments/offerings/OfferFilters";
import { OfferCard } from "@/components/recruitments/offerings/OfferCard";
import { OfferFormModal, OfferFormValues } from "@/components/recruitments/offerings/OfferFormModal";
import { OfferAnalytics } from "@/components/recruitments/offerings/OfferAnalytics";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { offers as initialOffers, candidates, avatar } from "@/lib/mock-data";
import { Offer } from "@/lib/types";
import { exportToPdf, generateOfferLetterPdf } from "@/lib/export";

export default function OfferingsPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<Offer | null>(null);

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        !search ||
        o.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        o.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || o.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [offers, search, status]);

  const stats = useMemo(() => {
    const sent = offers.filter((o) => ["Sent", "Viewed", "Negotiating"].includes(o.status)).length;
    const accepted = offers.filter((o) => o.status === "Accepted").length;
    const negotiating = offers.filter((o) => o.negotiationStatus === "In Progress").length;
    return { total: offers.length, sent, accepted, negotiating };
  }, [offers]);

  const updateStatus = (id: string, patch: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const handleCreate = (values: OfferFormValues) => {
    const candidate = candidates.find((c) => c.id === values.candidateId);
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      candidateName: candidate?.name ?? "New Candidate",
      avatar: candidate ? candidate.avatar : avatar("new-candidate"),
      position: candidate?.positionApplied ?? "Unassigned Role",
      department: candidate?.department ?? "General",
      salaryOffered: values.ctc * 100000,
      joiningDate: new Date(values.joiningDate).toISOString(),
      status: "Draft",
      negotiationStatus: "None",
      sentOn: new Date().toISOString(),
      expiresOn: new Date(Date.now() + 14 * 86400000).toISOString(),
      approvalStage: "Awaiting HRBP",
      recruiter: "Ananya Rao",
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const handleGenerateReport = () => {
    exportToPdf(
      "Offer Management Report",
      `Generated ${new Date().toDateString()} · Meridian HRMS`,
      [
        {
          heading: "Active Offers",
          head: ["Candidate", "Position", "CTC", "Status", "Negotiation"],
          body: offers.map((o) => [o.candidateName, o.position, `Rs. ${(o.salaryOffered / 100000).toFixed(1)}L`, o.status, o.negotiationStatus]),
        },
      ],
      "offer-management-report"
    );
  };

  return (
    <PageShell onCreate={() => setFormOpen(true)} createLabel="Create Offer">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Offers" value={String(stats.total)} delta={11.2} trend="up" icon={FileSignature} index={0} />
          <KpiCard label="Awaiting Response" value={String(stats.sent)} delta={3.4} trend="up" icon={Send} index={1} />
          <KpiCard label="Accepted" value={String(stats.accepted)} delta={4.6} trend="up" icon={CheckCircle2} index={2} />
          <KpiCard label="In Negotiation" value={String(stats.negotiating)} delta={1.8} trend="down" goodDirection="down" icon={HandCoins} index={3} />
        </section>

        <OfferAnalytics />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">All Offers</h2>
          <button onClick={handleGenerateReport} className="btn-secondary text-xs self-start sm:self-auto">
            Export Offer Report (PDF)
          </button>
        </div>

        <OfferFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} resultCount={filtered.length} />

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title="No offers match your filters"
            description="Try a different search or status filter, or create a new offer for a selected candidate."
            action={
              <button onClick={() => setFormOpen(true)} className="btn-primary">
                Create Offer
              </button>
            }
          />
        ) : (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((offer, i) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                index={i}
                onGenerateLetter={() => generateOfferLetterPdf(offer)}
                onSend={() => updateStatus(offer.id, { status: "Sent", sentOn: new Date().toISOString() })}
                onDownload={() => generateOfferLetterPdf(offer)}
                onRevoke={() => setRevokeTarget(offer)}
                onExtend={() => updateStatus(offer.id, { expiresOn: new Date(Date.now() + 7 * 86400000).toISOString() })}
                onResend={() => updateStatus(offer.id, { status: "Sent", sentOn: new Date().toISOString() })}
              />
            ))}
          </section>
        )}
      </div>

      <OfferFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />

      <ConfirmDialog
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => revokeTarget && updateStatus(revokeTarget.id, { status: "Expired" })}
        title="Revoke this offer?"
        description={`The offer sent to "${revokeTarget?.candidateName}" will be marked as expired and the candidate notified.`}
        confirmLabel="Revoke Offer"
      />
    </PageShell>
  );
}
