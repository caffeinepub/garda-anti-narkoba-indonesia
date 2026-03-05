import LeafletMap from "@/components/LeafletMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Loader2, MapPin, Trash2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddLocation,
  useDeleteLocation,
  useGetLocations,
} from "../hooks/useQueries";
import type { Location } from "../hooks/useQueries";

const INDONESIAN_PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Bengkulu",
  "Sumatera Selatan",
  "Kepulauan Bangka Belitung",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
];

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString()}-${Math.random().toString(36).slice(2)}`;
}

const DEFAULT_LAT = -6.2088;
const DEFAULT_LNG = 106.8456;

interface LocationForm {
  nama: string;
  alamat: string;
  kota: string;
  provinsi: string;
  tanggalKegiatan: string;
  jumlahPeserta: string;
  latitude: string;
  longitude: string;
  keterangan: string;
}

const EMPTY_FORM: LocationForm = {
  nama: "",
  alamat: "",
  kota: "",
  provinsi: "",
  tanggalKegiatan: "",
  jumlahPeserta: "",
  latitude: "",
  longitude: "",
  keterangan: "",
};

function MapPreview({
  lat,
  lng,
  title,
}: { lat: number; lng: number; title?: string }) {
  return (
    <LeafletMap
      markers={[{ id: "preview", lat, lng, title: title ?? "Lokasi" }]}
      height={300}
      fitBounds={false}
      zoom={14}
    />
  );
}

export default function AdminLokasi() {
  const [form, setForm] = useState<LocationForm>(EMPTY_FORM);
  const { data: locations, isLoading } = useGetLocations();
  const { mutateAsync: addLocation, isPending: isAdding } = useAddLocation();
  const { mutateAsync: deleteLocation, isPending: isDeleting } =
    useDeleteLocation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const parsedLat = Number.parseFloat(form.latitude) || DEFAULT_LAT;
  const parsedLng = Number.parseFloat(form.longitude) || DEFAULT_LNG;

  const hasCoords = form.latitude.trim() !== "" && form.longitude.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.provinsi) {
      toast.error("Silakan pilih provinsi");
      return;
    }
    const location: Location = {
      id: generateId(),
      nama: form.nama,
      alamat: form.alamat,
      kota: form.kota,
      provinsi: form.provinsi,
      tanggalKegiatan: form.tanggalKegiatan,
      jumlahPeserta: BigInt(Number.parseInt(form.jumlahPeserta, 10) || 0),
      latitude: parsedLat,
      longitude: parsedLng,
      keterangan: form.keterangan,
    };
    try {
      await addLocation(location);
      setForm(EMPTY_FORM);
      toast.success("Data lokasi berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan data lokasi. Coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteLocation(id);
      toast.success("Lokasi berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus lokasi");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Form Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div
          className="px-6 py-4 border-b border-border flex items-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.25 0.18 230) 0%, oklch(0.42 0.20 230) 100%)",
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-base">
              Input Data Lokasi Penyuluhan
            </h2>
            <p className="font-body text-white/70 text-xs">
              Tambahkan lokasi kegiatan sosialisasi anti narkoba
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Nama + Tanggal */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="loc-nama"
                className="font-body font-semibold text-sm text-foreground"
              >
                Nama Kegiatan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="loc-nama"
                data-ocid="lokasi.input"
                required
                placeholder="cth. Sosialisasi Anti Narkoba SMA Negeri 1"
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="loc-tanggal"
                className="font-body font-semibold text-sm text-foreground"
              >
                Tanggal Kegiatan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="loc-tanggal"
                type="date"
                required
                value={form.tanggalKegiatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tanggalKegiatan: e.target.value }))
                }
                className="font-body"
              />
            </div>
          </div>

          {/* Row 2: Alamat */}
          <div className="space-y-1.5">
            <Label
              htmlFor="loc-alamat"
              className="font-body font-semibold text-sm text-foreground"
            >
              Alamat Lengkap <span className="text-destructive">*</span>
            </Label>
            <Input
              id="loc-alamat"
              required
              placeholder="cth. Jl. Merdeka No. 12"
              value={form.alamat}
              onChange={(e) =>
                setForm((p) => ({ ...p, alamat: e.target.value }))
              }
              className="font-body"
            />
          </div>

          {/* Row 3: Kota + Provinsi */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="loc-kota"
                className="font-body font-semibold text-sm text-foreground"
              >
                Kota / Kabupaten <span className="text-destructive">*</span>
              </Label>
              <Input
                id="loc-kota"
                required
                placeholder="cth. Jakarta Selatan"
                value={form.kota}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kota: e.target.value }))
                }
                className="font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="loc-provinsi"
                className="font-body font-semibold text-sm text-foreground"
              >
                Provinsi <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.provinsi}
                onValueChange={(v) => setForm((p) => ({ ...p, provinsi: v }))}
              >
                <SelectTrigger
                  id="loc-provinsi"
                  data-ocid="lokasi.select"
                  className="font-body"
                >
                  <SelectValue placeholder="Pilih provinsi..." />
                </SelectTrigger>
                <SelectContent>
                  {INDONESIAN_PROVINCES.map((prov) => (
                    <SelectItem key={prov} value={prov} className="font-body">
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Jumlah Peserta */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="loc-peserta"
                className="font-body font-semibold text-sm text-foreground"
              >
                Jumlah Peserta
              </Label>
              <Input
                id="loc-peserta"
                type="number"
                min="0"
                placeholder="cth. 150"
                value={form.jumlahPeserta}
                onChange={(e) =>
                  setForm((p) => ({ ...p, jumlahPeserta: e.target.value }))
                }
                className="font-body"
              />
            </div>
          </div>

          {/* Row 5: Koordinat */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="font-body font-semibold text-sm text-foreground">
                Koordinat Peta
              </div>
              <Badge
                variant="outline"
                className="text-xs font-body text-foreground/50"
              >
                Opsional
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="loc-lat"
                  className="font-body text-sm text-foreground/70"
                >
                  Latitude
                </Label>
                <Input
                  id="loc-lat"
                  type="number"
                  step="any"
                  placeholder="cth. -6.2088"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, latitude: e.target.value }))
                  }
                  className="font-body"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="loc-lng"
                  className="font-body text-sm text-foreground/70"
                >
                  Longitude
                </Label>
                <Input
                  id="loc-lng"
                  type="number"
                  step="any"
                  placeholder="cth. 106.8456"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, longitude: e.target.value }))
                  }
                  className="font-body"
                />
              </div>
            </div>
            <p className="font-body text-xs text-foreground/45 mt-2">
              Tip: Buka Google Maps, klik kanan pada lokasi, salin koordinat
              latitude dan longitude.
            </p>
          </div>

          {/* Map Preview */}
          <div className="space-y-2">
            <Label className="font-body font-semibold text-sm text-foreground">
              Pratinjau Peta{" "}
              {!hasCoords && (
                <span className="text-foreground/40 font-normal">
                  (default: Jakarta)
                </span>
              )}
            </Label>
            <MapPreview
              lat={parsedLat}
              lng={parsedLng}
              title={form.nama || "Pratinjau"}
            />
            {hasCoords && (
              <p className="font-body text-xs text-foreground/50">
                📍 {parsedLat.toFixed(4)}, {parsedLng.toFixed(4)}
              </p>
            )}
          </div>

          {/* Keterangan */}
          <div className="space-y-1.5">
            <Label
              htmlFor="loc-keterangan"
              className="font-body font-semibold text-sm text-foreground"
            >
              Keterangan Tambahan
            </Label>
            <Textarea
              id="loc-keterangan"
              data-ocid="lokasi.textarea"
              placeholder="Informasi tambahan mengenai kegiatan ini..."
              value={form.keterangan}
              onChange={(e) =>
                setForm((p) => ({ ...p, keterangan: e.target.value }))
              }
              className="font-body min-h-[90px]"
              rows={3}
            />
          </div>

          <Button
            data-ocid="lokasi.submit_button"
            type="submit"
            disabled={isAdding}
            className="w-full font-display font-bold py-5"
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
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Simpan Data Lokasi
              </>
            )}
          </Button>
        </form>
      </motion.div>

      {/* Location List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.42 0.20 230 / 0.1)" }}
            >
              <MapPin
                className="w-4 h-4"
                style={{ color: "oklch(0.42 0.20 230)" }}
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-base">
                Data Lokasi Penyuluhan
              </h2>
              <p className="font-body text-foreground/50 text-xs">
                {locations?.length ?? 0} lokasi tercatat
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="lokasi.loading_state"
            className="flex items-center justify-center py-16 gap-2"
          >
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "oklch(0.42 0.20 230)" }}
            />
            <span className="font-body text-sm text-foreground/50">
              Memuat data...
            </span>
          </div>
        ) : !locations || locations.length === 0 ? (
          <div
            data-ocid="lokasi.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center px-6"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "oklch(0.42 0.20 230 / 0.08)" }}
            >
              <MapPin
                className="w-7 h-7"
                style={{ color: "oklch(0.42 0.20 230 / 0.5)" }}
              />
            </div>
            <p className="font-display font-bold text-foreground/60 text-base mb-1">
              Belum ada data lokasi
            </p>
            <p className="font-body text-sm text-foreground/40">
              Tambahkan lokasi penyuluhan menggunakan form di atas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.id}
                data-ocid={`lokasi.item.${idx + 1}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-secondary/20 transition-colors"
              >
                {/* Map thumbnail */}
                <div
                  className="flex-shrink-0 w-full sm:w-32"
                  style={{ height: "80px" }}
                >
                  <LeafletMap
                    markers={[
                      {
                        id: loc.id,
                        lat: loc.latitude,
                        lng: loc.longitude,
                        title: loc.nama,
                      },
                    ]}
                    height={80}
                    fitBounds={false}
                    zoom={13}
                    className="pointer-events-none"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm text-foreground leading-tight truncate">
                        {loc.nama}
                      </h3>
                      <p className="font-body text-xs text-foreground/55 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {loc.alamat}, {loc.kota}, {loc.provinsi}
                      </p>
                    </div>
                    <Button
                      data-ocid={`lokasi.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting && deletingId === loc.id}
                      onClick={() => handleDelete(loc.id)}
                      className="flex-shrink-0 h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      {isDeleting && deletingId === loc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="inline-flex items-center gap-1 font-body text-xs text-foreground/55">
                      <Calendar className="w-3 h-3" />
                      {formatTanggal(loc.tanggalKegiatan)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-body text-xs text-foreground/55">
                      <Users className="w-3 h-3" />
                      {Number(loc.jumlahPeserta).toLocaleString("id-ID")}{" "}
                      peserta
                    </span>
                  </div>

                  {loc.keterangan && (
                    <p className="font-body text-xs text-foreground/45 mt-2 line-clamp-2">
                      {loc.keterangan}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
