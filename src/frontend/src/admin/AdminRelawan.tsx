import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Volunteer } from "../hooks/useQueries";
import {
  useApproveVolunteer,
  useDeleteVolunteer,
  useGetVolunteers,
  useRejectVolunteer,
} from "../hooks/useQueries";

type FilterStatus = "semua" | "pending" | "approved" | "rejected";

interface ConfirmDialog {
  open: boolean;
  type: "approve" | "reject" | "delete" | null;
  volunteer: Volunteer | null;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<
    string,
    { bg: string; color: string; border: string; label: string }
  > = {
    pending: {
      bg: "oklch(0.78 0.13 85 / 0.12)",
      color: "oklch(0.48 0.12 85)",
      border: "oklch(0.78 0.13 85 / 0.30)",
      label: "Pending",
    },
    approved: {
      bg: "oklch(0.70 0.15 145 / 0.12)",
      color: "oklch(0.42 0.14 145)",
      border: "oklch(0.70 0.15 145 / 0.30)",
      label: "Disetujui",
    },
    rejected: {
      bg: "oklch(0.65 0.20 25 / 0.12)",
      color: "oklch(0.47 0.18 25)",
      border: "oklch(0.65 0.20 25 / 0.30)",
      label: "Ditolak",
    },
  };
  const s = styles[status] ?? styles.pending;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-semibold"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

export default function AdminRelawan() {
  const [filter, setFilter] = useState<FilterStatus>("semua");
  const [confirm, setConfirm] = useState<ConfirmDialog>({
    open: false,
    type: null,
    volunteer: null,
  });

  const { data: volunteers, isLoading } = useGetVolunteers();
  const approveM = useApproveVolunteer();
  const rejectM = useRejectVolunteer();
  const deleteM = useDeleteVolunteer();

  const filtered = (volunteers ?? []).filter((v) => {
    if (filter === "semua") return true;
    return v.status === filter;
  });

  const handleConfirm = async () => {
    const { type, volunteer } = confirm;
    if (!volunteer || !type) return;

    try {
      if (type === "approve") {
        await approveM.mutateAsync(volunteer.email);
        toast.success(`${volunteer.name} berhasil disetujui`);
      } else if (type === "reject") {
        await rejectM.mutateAsync(volunteer.email);
        toast.success(`${volunteer.name} berhasil ditolak`);
      } else if (type === "delete") {
        await deleteM.mutateAsync(volunteer.email);
        toast.success(`${volunteer.name} berhasil dihapus`);
      }
    } catch {
      toast.error("Operasi gagal. Silakan coba lagi.");
    } finally {
      setConfirm({ open: false, type: null, volunteer: null });
    }
  };

  const isPending =
    approveM.isPending || rejectM.isPending || deleteM.isPending;

  const tabCounts = {
    semua: (volunteers ?? []).length,
    pending: (volunteers ?? []).filter((v) => v.status === "pending").length,
    approved: (volunteers ?? []).filter((v) => v.status === "approved").length,
    rejected: (volunteers ?? []).filter((v) => v.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
        <TabsList
          className="h-auto p-1 gap-1"
          style={{ background: "oklch(0.93 0 0)" }}
        >
          {(["semua", "pending", "approved", "rejected"] as FilterStatus[]).map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                data-ocid="admin.relawan.tab"
                className="font-body text-sm capitalize px-4 py-1.5 data-[state=active]:shadow-sm"
              >
                {tab === "semua"
                  ? "Semua"
                  : tab === "pending"
                    ? "Pending"
                    : tab === "approved"
                      ? "Disetujui"
                      : "Ditolak"}
                <span
                  className="ml-1.5 text-xs px-1.5 py-0 rounded-full"
                  style={{
                    background: "oklch(0.85 0 0)",
                    color: "oklch(0.45 0 0)",
                  }}
                >
                  {tabCounts[tab]}
                </span>
              </TabsTrigger>
            ),
          )}
        </TabsList>
      </Tabs>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.92 0 0)", background: "white" }}
      >
        {isLoading ? (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="admin.relawan.loading_state"
          >
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "oklch(0.47 0.22 25)" }}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="admin.relawan.empty_state"
          >
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.58 0 0)" }}
            >
              Tidak ada relawan ditemukan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    background: "oklch(0.975 0 0)",
                    borderBottom: "1px solid oklch(0.92 0 0)",
                  }}
                >
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider">
                    Nama
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden md:table-cell">
                    Kota
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden lg:table-cell">
                    Telepon
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden xl:table-cell">
                    Motivasi
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((v, i) => (
                  <TableRow
                    key={v.email}
                    data-ocid={`admin.relawan.row.${i + 1}`}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid oklch(0.95 0 0)" }}
                  >
                    <TableCell className="font-body font-semibold text-sm text-foreground py-3">
                      {v.name}
                    </TableCell>
                    <TableCell
                      className="font-body text-sm py-3"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {v.email}
                    </TableCell>
                    <TableCell
                      className="font-body text-sm py-3 hidden md:table-cell"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {v.city}
                    </TableCell>
                    <TableCell
                      className="font-body text-sm py-3 hidden lg:table-cell"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      {v.phone}
                    </TableCell>
                    <TableCell
                      className="font-body text-sm py-3 max-w-[200px] hidden xl:table-cell"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      <span className="line-clamp-2">{v.motivation}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={v.status} />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {v.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              data-ocid={`admin.relawan.approve_button.${i + 1}`}
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  type: "approve",
                                  volunteer: v,
                                })
                              }
                              className="h-7 px-2.5 text-xs font-body"
                              style={{
                                background: "oklch(0.70 0.15 145 / 0.12)",
                                color: "oklch(0.40 0.14 145)",
                                border: "1px solid oklch(0.70 0.15 145 / 0.30)",
                              }}
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              data-ocid={`admin.relawan.reject_button.${i + 1}`}
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  type: "reject",
                                  volunteer: v,
                                })
                              }
                              className="h-7 px-2.5 text-xs font-body"
                              style={{
                                background: "oklch(0.65 0.20 25 / 0.10)",
                                color: "oklch(0.47 0.18 25)",
                                border: "1px solid oklch(0.65 0.20 25 / 0.25)",
                              }}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Tolak
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          data-ocid={`admin.relawan.delete_button.${i + 1}`}
                          onClick={() =>
                            setConfirm({
                              open: true,
                              type: "delete",
                              volunteer: v,
                            })
                          }
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          style={{ color: "oklch(0.58 0 0)" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirm.open}
        onOpenChange={(open) =>
          !open && setConfirm({ open: false, type: null, volunteer: null })
        }
      >
        <DialogContent data-ocid="admin.relawan.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              {confirm.type === "approve" && "Setujui Relawan"}
              {confirm.type === "reject" && "Tolak Relawan"}
              {confirm.type === "delete" && "Hapus Relawan"}
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
            {confirm.type === "approve" &&
              `Apakah Anda yakin ingin menyetujui pendaftaran ${confirm.volunteer?.name}?`}
            {confirm.type === "reject" &&
              `Apakah Anda yakin ingin menolak pendaftaran ${confirm.volunteer?.name}?`}
            {confirm.type === "delete" &&
              `Apakah Anda yakin ingin menghapus data ${confirm.volunteer?.name}? Tindakan ini tidak dapat dibatalkan.`}
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.cancel_button"
              onClick={() =>
                setConfirm({ open: false, type: null, volunteer: null })
              }
              disabled={isPending}
              className="font-body"
            >
              Batal
            </Button>
            <Button
              data-ocid="admin.confirm_button"
              onClick={handleConfirm}
              disabled={isPending}
              className="font-body"
              style={{
                background:
                  confirm.type === "approve"
                    ? "oklch(0.55 0.18 145)"
                    : confirm.type === "reject"
                      ? "oklch(0.60 0.18 85)"
                      : "oklch(0.47 0.22 25)",
                color: "white",
              }}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : confirm.type === "approve" ? (
                "Setujui"
              ) : confirm.type === "reject" ? (
                "Tolak"
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
