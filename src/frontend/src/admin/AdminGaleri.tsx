import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Film, ImageIcon, Loader2, Plus, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddGalleryItem,
  useDeleteGalleryItem,
  useGetGalleryItems,
} from "../hooks/useQueries";
import type { GalleryItem } from "../hooks/useQueries";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`;
}

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/watch?v=ID
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return longMatch[1];
  // youtube.com/embed/ID
  const embedMatch = url.match(/\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];
  return null;
}

function getYoutubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

function getYoutubeThumbnail(url: string): string | null {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

type FilterTab = "semua" | "foto" | "video";

interface GaleriForm {
  judul: string;
  deskripsi: string;
  tipe: "foto" | "video";
  url: string;
}

const EMPTY_FORM: GaleriForm = {
  judul: "",
  deskripsi: "",
  tipe: "foto",
  url: "",
};

function GalleryCard({
  item,
  idx,
  onDelete,
  isDeleting,
}: {
  item: GalleryItem;
  idx: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const embedUrl = item.tipe === "video" ? getYoutubeEmbedUrl(item.url) : null;
  const thumbnail =
    item.tipe === "video" ? getYoutubeThumbnail(item.url) : null;

  const formatTanggal = (ts: bigint) => {
    return new Date(Number(ts)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        data-ocid={`galeri.item.${idx + 1}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: idx * 0.04 }}
        className="bg-white rounded-xl border border-border overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200"
      >
        {/* Media preview */}
        <div className="relative" style={{ aspectRatio: "16/9" }}>
          {item.tipe === "foto" ? (
            <button
              type="button"
              className="absolute inset-0 w-full h-full overflow-hidden"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Lihat foto: ${item.judul}`}
            >
              <img
                src={item.url}
                alt={item.judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f0f4f8'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a0aec0' font-family='sans-serif' font-size='14'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <ImageIcon className="w-5 h-5 text-foreground" />
                </div>
              </div>
            </button>
          ) : embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=0`}
              title={item.judul}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : thumbnail ? (
            <div className="relative w-full h-full">
              <img
                src={thumbnail}
                alt={item.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Film className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
              <Film className="w-10 h-10 text-foreground/30" />
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold ${
                item.tipe === "foto"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.tipe === "foto" ? (
                <ImageIcon className="w-3 h-3" />
              ) : (
                <Film className="w-3 h-3" />
              )}
              {item.tipe === "foto" ? "Foto" : "Video"}
            </span>
          </div>

          {/* Delete button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              data-ocid={`galeri.delete_button.${idx + 1}`}
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(item.id)}
              className="h-7 w-7 p-0 bg-white/90 hover:bg-destructive hover:text-white text-destructive rounded-full shadow-sm"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-display font-bold text-sm text-foreground leading-tight line-clamp-1">
            {item.judul}
          </h3>
          {item.deskripsi && (
            <p className="font-body text-xs text-foreground/55 mt-1 line-clamp-2">
              {item.deskripsi}
            </p>
          )}
          <p className="font-body text-xs text-foreground/35 mt-1.5">
            {formatTanggal(item.tanggal)}
          </p>
        </div>
      </motion.div>

      {/* Lightbox for photos */}
      {item.tipe === "foto" && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            data-ocid="galeri.dialog"
            className="max-w-3xl p-2 bg-black border-none"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>{item.judul}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img
                src={item.url}
                alt={item.judul}
                className="w-full rounded-lg max-h-[80vh] object-contain"
              />
              <button
                type="button"
                data-ocid="galeri.dialog.close_button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="font-display font-bold text-white text-sm">
                  {item.judul}
                </p>
                {item.deskripsi && (
                  <p className="font-body text-white/70 text-xs mt-0.5">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default function AdminGaleri() {
  const [form, setForm] = useState<GaleriForm>(EMPTY_FORM);
  const [filter, setFilter] = useState<FilterTab>("semua");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: galleryItems, isLoading } = useGetGalleryItems();
  const { mutateAsync: addGalleryItem, isPending: isAdding } =
    useAddGalleryItem();
  const { mutateAsync: deleteGalleryItem } = useDeleteGalleryItem();

  const filteredItems = (galleryItems ?? []).filter((item) => {
    if (filter === "semua") return true;
    if (filter === "foto") return item.tipe === "foto";
    if (filter === "video") return item.tipe === "video";
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) {
      toast.error("URL tidak boleh kosong");
      return;
    }
    const item: GalleryItem = {
      id: generateId(),
      judul: form.judul,
      deskripsi: form.deskripsi,
      tipe: form.tipe,
      url: form.url,
      tanggal: BigInt(Date.now()),
    };
    try {
      await addGalleryItem(item);
      setForm(EMPTY_FORM);
      setShowForm(false);
      toast.success("Item galeri berhasil ditambahkan!");
    } catch {
      toast.error("Gagal menambahkan item. Coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteGalleryItem(id);
      toast.success("Item berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus item");
    } finally {
      setDeletingId(null);
    }
  };

  // URL Preview
  const previewUrl = form.url.trim();
  const videoEmbedUrl =
    form.tipe === "video" ? getYoutubeEmbedUrl(previewUrl) : null;

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Galeri Foto & Video
          </h2>
          <p className="font-body text-sm text-foreground/50 mt-0.5">
            Kelola konten visual kegiatan organisasi
          </p>
        </div>
        <Button
          data-ocid="galeri.open_modal_button"
          onClick={() => setShowForm((p) => !p)}
          className="flex items-center gap-2 font-body font-semibold"
          style={{
            background: showForm
              ? "oklch(0.50 0.05 0)"
              : "linear-gradient(135deg, oklch(0.25 0.18 230) 0%, oklch(0.42 0.20 230) 100%)",
            color: "white",
          }}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Tutup Form
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Tambah Konten
            </>
          )}
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          <div
            className="px-6 py-4 border-b border-border"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.25 0.18 230 / 0.05) 0%, oklch(0.42 0.20 230 / 0.08) 100%)",
            }}
          >
            <h3 className="font-display font-bold text-base text-foreground">
              Tambah Konten Galeri
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Tipe toggle */}
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm text-foreground">
                Tipe Konten
              </Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="galeri.toggle"
                  onClick={() => setForm((p) => ({ ...p, tipe: "foto" }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-body text-sm font-medium transition-all ${
                    form.tipe === "foto"
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-border text-foreground/60 hover:border-border/80"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Foto
                </button>
                <button
                  type="button"
                  data-ocid="galeri.toggle"
                  onClick={() => setForm((p) => ({ ...p, tipe: "video" }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-body text-sm font-medium transition-all ${
                    form.tipe === "video"
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-border text-foreground/60 hover:border-border/80"
                  }`}
                >
                  <Film className="w-4 h-4" />
                  Video
                </button>
              </div>
            </div>

            {/* Judul */}
            <div className="space-y-1.5">
              <Label
                htmlFor="gal-judul"
                className="font-body font-semibold text-sm text-foreground"
              >
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gal-judul"
                data-ocid="galeri.input"
                required
                placeholder="cth. Kegiatan Penyuluhan di SMA Negeri 5"
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                className="font-body"
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="gal-url"
                className="font-body font-semibold text-sm text-foreground"
              >
                {form.tipe === "foto" ? "URL Foto" : "URL YouTube"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gal-url"
                required
                placeholder={
                  form.tipe === "foto"
                    ? "https://example.com/foto.jpg"
                    : "https://www.youtube.com/watch?v=..."
                }
                value={form.url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, url: e.target.value }))
                }
                className="font-body"
              />
              {form.tipe === "video" && (
                <p className="font-body text-xs text-foreground/45">
                  Mendukung: youtube.com/watch?v=... atau youtu.be/...
                </p>
              )}
            </div>

            {/* URL Preview */}
            {previewUrl && (
              <div className="space-y-1.5">
                <Label className="font-body text-sm text-foreground/60">
                  Pratinjau
                </Label>
                <div
                  className="rounded-xl overflow-hidden border border-border bg-secondary/20"
                  style={{
                    aspectRatio: "16/9",
                    maxHeight: "200px",
                  }}
                >
                  {form.tipe === "foto" ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f0f4f8'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a0aec0' font-family='sans-serif' font-size='14'%3EURL tidak valid%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : videoEmbedUrl ? (
                    <iframe
                      src={videoEmbedUrl}
                      title="Video preview"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="font-body text-sm text-foreground/40">
                        URL YouTube tidak valid
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <Label
                htmlFor="gal-deskripsi"
                className="font-body font-semibold text-sm text-foreground"
              >
                Deskripsi
              </Label>
              <Textarea
                id="gal-deskripsi"
                data-ocid="galeri.textarea"
                placeholder="Keterangan singkat tentang konten ini..."
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                className="font-body min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                data-ocid="galeri.submit_button"
                type="submit"
                disabled={isAdding}
                className="flex-1 font-body font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.25 0.18 230) 0%, oklch(0.42 0.20 230) 100%)",
                  color: "white",
                }}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan ke Galeri"
                )}
              </Button>
              <Button
                data-ocid="galeri.cancel_button"
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setShowForm(false);
                }}
                className="font-body"
              >
                Batal
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter + Grid */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Filter tabs */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
            <TabsList className="bg-secondary/40 h-9">
              <TabsTrigger
                value="semua"
                data-ocid="galeri.tab"
                className="font-body text-xs font-medium h-7 px-4"
              >
                Semua ({galleryItems?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="foto"
                data-ocid="galeri.tab"
                className="font-body text-xs font-medium h-7 px-4"
              >
                Foto (
                {galleryItems?.filter((i) => i.tipe === "foto").length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="video"
                data-ocid="galeri.tab"
                className="font-body text-xs font-medium h-7 px-4"
              >
                Video (
                {galleryItems?.filter((i) => i.tipe === "video").length ?? 0})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div
              data-ocid="galeri.loading_state"
              className="flex items-center justify-center py-16 gap-2"
            >
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "oklch(0.42 0.20 230)" }}
              />
              <span className="font-body text-sm text-foreground/50">
                Memuat galeri...
              </span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              data-ocid="galeri.empty_state"
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: "oklch(0.42 0.20 230 / 0.08)" }}
              >
                <ImageIcon
                  className="w-7 h-7"
                  style={{ color: "oklch(0.42 0.20 230 / 0.4)" }}
                />
              </div>
              <p className="font-display font-bold text-foreground/60 text-base mb-1">
                Belum ada konten
              </p>
              <p className="font-body text-sm text-foreground/40">
                Tambahkan foto atau video menggunakan tombol "Tambah Konten" di
                atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  onDelete={handleDelete}
                  isDeleting={deletingId === item.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
