import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Program } from "../hooks/useQueries";
import {
  useAddProgram,
  useDeleteProgram,
  useGetPrograms,
  useUpdateProgram,
} from "../hooks/useQueries";

const KINDS = ["Sosialisasi", "Pendampingan", "Pelatihan", "Advokasi"];

const kindColors: Record<string, { bg: string; color: string }> = {
  Sosialisasi: {
    bg: "oklch(0.55 0.18 230 / 0.10)",
    color: "oklch(0.40 0.16 230)",
  },
  Pendampingan: {
    bg: "oklch(0.60 0.16 25 / 0.10)",
    color: "oklch(0.47 0.16 25)",
  },
  Pelatihan: {
    bg: "oklch(0.55 0.16 145 / 0.10)",
    color: "oklch(0.38 0.14 145)",
  },
  Advokasi: {
    bg: "oklch(0.55 0.18 290 / 0.10)",
    color: "oklch(0.45 0.16 290)",
  },
};

interface FormState {
  name: string;
  description: string;
  kind: string;
}

const emptyForm: FormState = { name: "", description: "", kind: "Sosialisasi" };

interface DeleteDialog {
  open: boolean;
  program: Program | null;
}

export default function AdminProgram() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({
    open: false,
    program: null,
  });

  const { data: programs, isLoading } = useGetPrograms();
  const addM = useAddProgram();
  const updateM = useUpdateProgram();
  const deleteM = useDeleteProgram();

  const openAdd = () => {
    setEditingProgram(null);
    setForm(emptyForm);
    setSheetOpen(true);
  };

  const openEdit = (program: Program) => {
    setEditingProgram(program);
    setForm({
      name: program.name,
      description: program.description,
      kind: program.kind,
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Nama dan deskripsi wajib diisi");
      return;
    }
    try {
      if (editingProgram) {
        await updateM.mutateAsync({
          name: editingProgram.name,
          newName: form.name,
          description: form.description,
          kind: form.kind,
        });
        toast.success("Program berhasil diperbarui");
      } else {
        await addM.mutateAsync(form);
        toast.success("Program berhasil ditambahkan");
      }
      setSheetOpen(false);
    } catch {
      toast.error("Gagal menyimpan program. Silakan coba lagi.");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.program) return;
    try {
      await deleteM.mutateAsync(deleteDialog.program.name);
      toast.success("Program berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus program.");
    } finally {
      setDeleteDialog({ open: false, program: null });
    }
  };

  const isSaving = addM.isPending || updateM.isPending;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
          {programs?.length ?? 0} program tersedia
        </p>
        <Button
          data-ocid="admin.program.add_button"
          onClick={openAdd}
          className="font-body font-semibold gap-2"
          style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Tambah Program
        </Button>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.92 0 0)", background: "white" }}
      >
        {isLoading ? (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="admin.program.loading_state"
          >
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "oklch(0.47 0.22 25)" }}
            />
          </div>
        ) : (programs ?? []).length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="admin.program.empty_state"
          >
            <p
              className="font-body text-sm mb-4"
              style={{ color: "oklch(0.58 0 0)" }}
            >
              Belum ada program. Tambahkan program pertama.
            </p>
            <Button
              variant="outline"
              onClick={openAdd}
              className="font-body gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Program
            </Button>
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
                    Nama Program
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden sm:table-cell">
                    Jenis
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden md:table-cell">
                    Deskripsi
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(programs ?? []).map((program, i) => {
                  const kindStyle = kindColors[program.kind] ?? {
                    bg: "oklch(0.92 0 0)",
                    color: "oklch(0.45 0 0)",
                  };
                  return (
                    <TableRow
                      key={program.name}
                      data-ocid={`admin.program.row.${i + 1}`}
                      style={{ borderBottom: "1px solid oklch(0.95 0 0)" }}
                    >
                      <TableCell className="font-body font-semibold text-sm text-foreground py-3">
                        {program.name}
                      </TableCell>
                      <TableCell className="py-3 hidden sm:table-cell">
                        <span
                          className="text-xs font-body font-semibold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: kindStyle.bg,
                            color: kindStyle.color,
                          }}
                        >
                          {program.kind}
                        </span>
                      </TableCell>
                      <TableCell
                        className="font-body text-sm py-3 max-w-[280px] hidden md:table-cell"
                        style={{ color: "oklch(0.55 0 0)" }}
                      >
                        <span className="line-clamp-2">
                          {program.description}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            data-ocid={`admin.program.edit_button.${i + 1}`}
                            onClick={() => openEdit(program)}
                            className="h-7 w-7 p-0"
                            style={{ color: "oklch(0.50 0.18 230)" }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            data-ocid={`admin.program.delete_button.${i + 1}`}
                            onClick={() =>
                              setDeleteDialog({ open: true, program })
                            }
                            className="h-7 w-7 p-0"
                            style={{ color: "oklch(0.55 0.18 25)" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="font-display font-bold text-lg">
              {editingProgram ? "Edit Program" : "Tambah Program"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            <div>
              <Label className="font-body font-semibold text-sm mb-1.5 block">
                Nama Program{" "}
                <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
              </Label>
              <Input
                placeholder="Nama program"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="font-body"
              />
            </div>

            <div>
              <Label className="font-body font-semibold text-sm mb-1.5 block">
                Jenis <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
              </Label>
              <Select
                value={form.kind}
                onValueChange={(v) => setForm((p) => ({ ...p, kind: v }))}
              >
                <SelectTrigger className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KINDS.map((kind) => (
                    <SelectItem key={kind} value={kind} className="font-body">
                      {kind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body font-semibold text-sm mb-1.5 block">
                Deskripsi{" "}
                <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
              </Label>
              <Textarea
                placeholder="Deskripsi program..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="font-body min-h-[120px]"
                rows={5}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="flex-1 font-body"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                data-ocid="admin.program.save_button"
                onClick={handleSave}
                className="flex-1 font-body font-semibold"
                style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingProgram ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Program"
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, program: null })
        }
      >
        <DialogContent data-ocid="admin.program.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Hapus Program
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
            Apakah Anda yakin ingin menghapus program{" "}
            <strong>"{deleteDialog.program?.name}"</strong>? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.cancel_button"
              onClick={() => setDeleteDialog({ open: false, program: null })}
              disabled={deleteM.isPending}
              className="font-body"
            >
              Batal
            </Button>
            <Button
              data-ocid="admin.confirm_button"
              onClick={handleDelete}
              disabled={deleteM.isPending}
              className="font-body"
              style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
            >
              {deleteM.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
