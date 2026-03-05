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
import type { Article } from "../hooks/useQueries";
import {
  useAddArticle,
  useDeleteArticle,
  useGetArticles,
  useUpdateArticle,
} from "../hooks/useQueries";

const CATEGORIES = ["Berita", "Program", "Kolaborasi", "Edukasi"];

const categoryColors: Record<string, { bg: string; color: string }> = {
  Berita: { bg: "oklch(0.55 0.18 230 / 0.10)", color: "oklch(0.40 0.16 230)" },
  Program: { bg: "oklch(0.55 0.16 145 / 0.10)", color: "oklch(0.38 0.14 145)" },
  Kolaborasi: {
    bg: "oklch(0.55 0.18 290 / 0.10)",
    color: "oklch(0.45 0.16 290)",
  },
  Edukasi: { bg: "oklch(0.70 0.14 85 / 0.12)", color: "oklch(0.48 0.12 85)" },
};

interface FormState {
  title: string;
  content: string;
  author: string;
  category: string;
}

const emptyForm: FormState = {
  title: "",
  content: "",
  author: "",
  category: "Berita",
};

interface DeleteDialog {
  open: boolean;
  article: Article | null;
}

export default function AdminArtikel() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>({
    open: false,
    article: null,
  });

  const { data: articles, isLoading } = useGetArticles();
  const addM = useAddArticle();
  const updateM = useUpdateArticle();
  const deleteM = useDeleteArticle();

  const formatDate = (ts: bigint) =>
    new Date(Number(ts)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const openAdd = () => {
    setEditingArticle(null);
    setForm(emptyForm);
    setSheetOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
      toast.error("Semua field wajib diisi");
      return;
    }
    try {
      if (editingArticle) {
        await updateM.mutateAsync({
          title: editingArticle.title,
          newTitle: form.title,
          content: form.content,
          author: form.author,
          category: form.category,
        });
        toast.success("Artikel berhasil diperbarui");
      } else {
        await addM.mutateAsync(form);
        toast.success("Artikel berhasil ditambahkan");
      }
      setSheetOpen(false);
    } catch {
      toast.error("Gagal menyimpan artikel. Silakan coba lagi.");
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.article) return;
    try {
      await deleteM.mutateAsync(deleteDialog.article.title);
      toast.success("Artikel berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus artikel.");
    } finally {
      setDeleteDialog({ open: false, article: null });
    }
  };

  const isSaving = addM.isPending || updateM.isPending;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
          {articles?.length ?? 0} artikel tersedia
        </p>
        <Button
          data-ocid="admin.artikel.add_button"
          onClick={openAdd}
          className="font-body font-semibold gap-2"
          style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
        >
          <Plus className="w-4 h-4" />
          Tambah Artikel
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
            data-ocid="admin.artikel.loading_state"
          >
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "oklch(0.47 0.22 25)" }}
            />
          </div>
        ) : (articles ?? []).length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="admin.artikel.empty_state"
          >
            <p
              className="font-body text-sm mb-4"
              style={{ color: "oklch(0.58 0 0)" }}
            >
              Belum ada artikel. Tambahkan artikel pertama.
            </p>
            <Button
              variant="outline"
              onClick={openAdd}
              className="font-body gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Artikel
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
                    Judul
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden sm:table-cell">
                    Kategori
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden md:table-cell">
                    Penulis
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider hidden lg:table-cell">
                    Tanggal
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-right">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(articles ?? []).map((article, i) => {
                  const catStyle = categoryColors[article.category] ?? {
                    bg: "oklch(0.92 0 0)",
                    color: "oklch(0.45 0 0)",
                  };
                  return (
                    <TableRow
                      key={article.title}
                      data-ocid={`admin.artikel.row.${i + 1}`}
                      style={{ borderBottom: "1px solid oklch(0.95 0 0)" }}
                    >
                      <TableCell className="font-body font-semibold text-sm text-foreground py-3 max-w-[240px]">
                        <span className="line-clamp-1">{article.title}</span>
                      </TableCell>
                      <TableCell className="py-3 hidden sm:table-cell">
                        <span
                          className="text-xs font-body font-semibold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: catStyle.bg,
                            color: catStyle.color,
                          }}
                        >
                          {article.category}
                        </span>
                      </TableCell>
                      <TableCell
                        className="font-body text-sm py-3 hidden md:table-cell"
                        style={{ color: "oklch(0.55 0 0)" }}
                      >
                        {article.author}
                      </TableCell>
                      <TableCell
                        className="font-body text-sm py-3 hidden lg:table-cell"
                        style={{ color: "oklch(0.55 0 0)" }}
                      >
                        {formatDate(article.date)}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            data-ocid={`admin.artikel.edit_button.${i + 1}`}
                            onClick={() => openEdit(article)}
                            className="h-7 w-7 p-0"
                            style={{ color: "oklch(0.50 0.18 230)" }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            data-ocid={`admin.artikel.delete_button.${i + 1}`}
                            onClick={() =>
                              setDeleteDialog({ open: true, article })
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
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle className="font-display font-bold text-lg">
              {editingArticle ? "Edit Artikel" : "Tambah Artikel"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-5">
            <div>
              <Label className="font-body font-semibold text-sm mb-1.5 block">
                Judul <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
              </Label>
              <Input
                placeholder="Judul artikel"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                className="font-body"
              />
            </div>

            <div>
              <Label className="font-body font-semibold text-sm mb-1.5 block">
                Konten <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
              </Label>
              <Textarea
                placeholder="Isi konten artikel..."
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                className="font-body min-h-[180px]"
                rows={7}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body font-semibold text-sm mb-1.5 block">
                  Penulis{" "}
                  <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
                </Label>
                <Input
                  placeholder="Nama penulis"
                  value={form.author}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author: e.target.value }))
                  }
                  className="font-body"
                />
              </div>
              <div>
                <Label className="font-body font-semibold text-sm mb-1.5 block">
                  Kategori{" "}
                  <span style={{ color: "oklch(0.47 0.22 25)" }}>*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-body">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                data-ocid="admin.artikel.save_button"
                onClick={handleSave}
                className="flex-1 font-body font-semibold"
                style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingArticle ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Artikel"
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
          !open && setDeleteDialog({ open: false, article: null })
        }
      >
        <DialogContent data-ocid="admin.artikel.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-bold">
              Hapus Artikel
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
            Apakah Anda yakin ingin menghapus artikel{" "}
            <strong>"{deleteDialog.article?.title}"</strong>? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="admin.cancel_button"
              onClick={() => setDeleteDialog({ open: false, article: null })}
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
