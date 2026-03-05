import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "../hooks/useQueries";
import { useGetSiteSettings, useUpdateSiteSettings } from "../hooks/useQueries";

const defaultSettings: SiteSettings = {
  orgName: "GARDA Anti Narkoba Indonesia",
  tagline: "Bersama Melawan Narkoba",
  headerSubtitle: "Anti Narkoba Indonesia",
  headerCtaText: "Daftar Relawan",
  address: "Jl. Sudirman No. 123, Jakarta Pusat",
  phone: "+62 21 5000 1234",
  email: "info@gardaantinarkoba.id",
  facebookUrl: "#",
  twitterUrl: "#",
  instagramUrl: "#",
  youtubeUrl: "#",
  footerNote:
    "Organisasi nasional yang berkomitmen melindungi generasi Indonesia dari bahaya narkoba.",
};

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="font-body font-semibold text-sm mb-1 block">
        {label}
      </Label>
      {hint && (
        <p
          className="font-body text-xs mb-1.5"
          style={{ color: "oklch(0.60 0 0)" }}
        >
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

export default function AdminPengaturan() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateM = useUpdateSiteSettings();
  const [form, setForm] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = async (fields: Partial<SiteSettings>) => {
    try {
      await updateM.mutateAsync({ ...form, ...fields });
      setForm((prev) => ({ ...prev, ...fields }));
      toast.success("Pengaturan berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {["orgName", "tagline", "address", "phone", "email"].map((field) => (
          <div key={field} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Tabs defaultValue="profil">
        <TabsList
          className="mb-6 h-auto p-1 gap-1"
          style={{ background: "oklch(0.93 0 0)" }}
        >
          <TabsTrigger
            value="profil"
            data-ocid="admin.pengaturan.profil_tab"
            className="font-body text-sm px-4 py-1.5 data-[state=active]:shadow-sm"
          >
            Profil Organisasi
          </TabsTrigger>
          <TabsTrigger
            value="header"
            data-ocid="admin.pengaturan.header_tab"
            className="font-body text-sm px-4 py-1.5 data-[state=active]:shadow-sm"
          >
            Header
          </TabsTrigger>
          <TabsTrigger
            value="footer"
            data-ocid="admin.pengaturan.footer_tab"
            className="font-body text-sm px-4 py-1.5 data-[state=active]:shadow-sm"
          >
            Footer & Sosmed
          </TabsTrigger>
        </TabsList>

        {/* ── Profil Tab ──────────────────────────────────────────── */}
        <TabsContent value="profil">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "white", border: "1px solid oklch(0.92 0 0)" }}
          >
            <div>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                Profil Organisasi
              </h3>
              <p
                className="font-body text-xs"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Informasi dasar organisasi yang tampil di seluruh website.
              </p>
            </div>

            <FieldGroup label="Nama Organisasi">
              <Input
                value={form.orgName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, orgName: e.target.value }))
                }
                className="font-body"
                placeholder="Nama organisasi"
              />
            </FieldGroup>

            <FieldGroup label="Tagline" hint="Slogan singkat organisasi">
              <Input
                value={form.tagline}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tagline: e.target.value }))
                }
                className="font-body"
                placeholder="Tagline organisasi"
              />
            </FieldGroup>

            <FieldGroup label="Alamat">
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="font-body"
                placeholder="Alamat kantor"
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Nomor Telepon">
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="font-body"
                  placeholder="+62 21 ..."
                />
              </FieldGroup>
              <FieldGroup label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="font-body"
                  placeholder="email@organisasi.id"
                />
              </FieldGroup>
            </div>

            <Button
              data-ocid="admin.pengaturan.save_button"
              onClick={() =>
                handleSave({
                  orgName: form.orgName,
                  tagline: form.tagline,
                  address: form.address,
                  phone: form.phone,
                  email: form.email,
                })
              }
              disabled={updateM.isPending}
              className="font-body font-semibold gap-2"
              style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
            >
              {updateM.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Profil
            </Button>
          </div>
        </TabsContent>

        {/* ── Header Tab ──────────────────────────────────────────── */}
        <TabsContent value="header">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "white", border: "1px solid oklch(0.92 0 0)" }}
          >
            <div>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                Konfigurasi Header
              </h3>
              <p
                className="font-body text-xs"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Teks yang tampil di bagian navigasi dan hero website.
              </p>
            </div>

            <FieldGroup
              label="Subtitle Header"
              hint='Teks kecil di bawah nama organisasi pada navbar (contoh: "Anti Narkoba Indonesia")'
            >
              <Input
                value={form.headerSubtitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, headerSubtitle: e.target.value }))
                }
                className="font-body"
                placeholder="Subtitle header"
              />
            </FieldGroup>

            <FieldGroup
              label="Teks Tombol CTA"
              hint='Teks pada tombol di navbar dan hero (contoh: "Daftar Relawan")'
            >
              <Input
                value={form.headerCtaText}
                onChange={(e) =>
                  setForm((p) => ({ ...p, headerCtaText: e.target.value }))
                }
                className="font-body"
                placeholder="Teks tombol CTA"
              />
            </FieldGroup>

            {/* Preview */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "oklch(0.97 0 0)",
                border: "1px solid oklch(0.90 0 0)",
              }}
            >
              <p
                className="font-body text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "oklch(0.60 0 0)" }}
              >
                Preview Navbar
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/garda-logo-transparent.dim_400x400.png"
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <div
                    className="font-display font-black text-sm leading-tight"
                    style={{ color: "oklch(0.47 0.22 25)" }}
                  >
                    {form.orgName || "GARDA"}
                  </div>
                  <div
                    className="font-body text-xs leading-tight"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    {form.headerSubtitle || "Anti Narkoba Indonesia"}
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className="font-body font-semibold text-xs px-3 py-1.5 rounded-lg"
                    style={{
                      background: "oklch(0.47 0.22 25)",
                      color: "white",
                    }}
                  >
                    {form.headerCtaText || "Daftar Relawan"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              data-ocid="admin.pengaturan.save_button"
              onClick={() =>
                handleSave({
                  headerSubtitle: form.headerSubtitle,
                  headerCtaText: form.headerCtaText,
                })
              }
              disabled={updateM.isPending}
              className="font-body font-semibold gap-2"
              style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
            >
              {updateM.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Header
            </Button>
          </div>
        </TabsContent>

        {/* ── Footer Tab ──────────────────────────────────────────── */}
        <TabsContent value="footer">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "white", border: "1px solid oklch(0.92 0 0)" }}
          >
            <div>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                Footer & Sosial Media
              </h3>
              <p
                className="font-body text-xs"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Catatan footer dan tautan media sosial organisasi.
              </p>
            </div>

            <FieldGroup
              label="Catatan Footer"
              hint="Teks deskripsi singkat yang tampil di footer"
            >
              <Textarea
                value={form.footerNote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, footerNote: e.target.value }))
                }
                className="font-body min-h-[80px]"
                rows={3}
                placeholder="Deskripsi singkat organisasi untuk footer..."
              />
            </FieldGroup>

            <div className="space-y-4">
              <p className="font-display font-bold text-sm text-foreground">
                Tautan Sosial Media
              </p>

              <FieldGroup label="Facebook URL">
                <Input
                  value={form.facebookUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, facebookUrl: e.target.value }))
                  }
                  className="font-body"
                  placeholder="https://facebook.com/..."
                />
              </FieldGroup>

              <FieldGroup label="Twitter / X URL">
                <Input
                  value={form.twitterUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, twitterUrl: e.target.value }))
                  }
                  className="font-body"
                  placeholder="https://twitter.com/..."
                />
              </FieldGroup>

              <FieldGroup label="Instagram URL">
                <Input
                  value={form.instagramUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, instagramUrl: e.target.value }))
                  }
                  className="font-body"
                  placeholder="https://instagram.com/..."
                />
              </FieldGroup>

              <FieldGroup label="YouTube URL">
                <Input
                  value={form.youtubeUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, youtubeUrl: e.target.value }))
                  }
                  className="font-body"
                  placeholder="https://youtube.com/..."
                />
              </FieldGroup>
            </div>

            <Button
              data-ocid="admin.pengaturan.save_button"
              onClick={() =>
                handleSave({
                  footerNote: form.footerNote,
                  facebookUrl: form.facebookUrl,
                  twitterUrl: form.twitterUrl,
                  instagramUrl: form.instagramUrl,
                  youtubeUrl: form.youtubeUrl,
                })
              }
              disabled={updateM.isPending}
              className="font-body font-semibold gap-2"
              style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
            >
              {updateM.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Footer & Sosmed
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
