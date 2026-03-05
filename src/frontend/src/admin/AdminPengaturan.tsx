import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, KeyRound, Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
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

interface AdminPengaturanProps {
  onLogout?: () => void;
}

export default function AdminPengaturan({ onLogout }: AdminPengaturanProps) {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateM = useUpdateSiteSettings();
  const { changeCredentials, getStoredCredentials } = useAdminAuth();
  const [form, setForm] = useState<SiteSettings>(defaultSettings);

  // Security form state
  const [secNewUsername, setSecNewUsername] = useState("");
  const [secOldPassword, setSecOldPassword] = useState("");
  const [secNewPassword, setSecNewPassword] = useState("");
  const [secConfirmPassword, setSecConfirmPassword] = useState("");
  const [secError, setSecError] = useState<string | null>(null);
  const [secSaving, setSecSaving] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  // Pre-fill username from stored credentials
  useEffect(() => {
    const stored = getStoredCredentials();
    setSecNewUsername(stored ? stored.username : "admin");
  }, [getStoredCredentials]);

  const handleSave = async (fields: Partial<SiteSettings>) => {
    try {
      await updateM.mutateAsync({ ...form, ...fields });
      setForm((prev) => ({ ...prev, ...fields }));
      toast.success("Pengaturan berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecError(null);

    if (!secNewUsername.trim()) {
      setSecError("Username tidak boleh kosong");
      return;
    }
    if (!secOldPassword) {
      setSecError("Password lama wajib diisi");
      return;
    }
    if (!secNewPassword) {
      setSecError("Password baru wajib diisi");
      return;
    }
    if (secNewPassword.length < 6) {
      setSecError("Password baru minimal 6 karakter");
      return;
    }
    if (secNewPassword !== secConfirmPassword) {
      setSecError("Konfirmasi password tidak cocok");
      return;
    }

    setSecSaving(true);
    const result = await changeCredentials(
      secOldPassword,
      secNewUsername.trim(),
      secNewPassword,
    );
    setSecSaving(false);

    if (result.success) {
      toast.success("Kredensial berhasil diperbarui! Silakan login ulang.");
      setSecOldPassword("");
      setSecNewPassword("");
      setSecConfirmPassword("");
      // Log out after credential change
      setTimeout(() => {
        onLogout?.();
      }, 1500);
    } else {
      setSecError(result.error ?? "Gagal memperbarui kredensial");
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
          className="mb-6 h-auto p-1 gap-1 flex-wrap"
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
          <TabsTrigger
            value="keamanan"
            data-ocid="admin.pengaturan.keamanan_tab"
            className="font-body text-sm px-4 py-1.5 data-[state=active]:shadow-sm"
          >
            Keamanan
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
                  src="/assets/uploads/55406_original_FB_IMG_1553487322630-removebg-preview-1.png"
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

        {/* ── Keamanan Tab ──────────────────────────────────────────── */}
        <TabsContent value="keamanan">
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "white", border: "1px solid oklch(0.92 0 0)" }}
          >
            <div>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                Keamanan Akun Admin
              </h3>
              <p
                className="font-body text-xs"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Ubah username dan password untuk login admin. Setelah disimpan,
                Anda akan otomatis logout.
              </p>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              {/* Username baru */}
              <FieldGroup label="Username Baru">
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.60 0 0)" }}
                  />
                  <Input
                    data-ocid="admin.keamanan.username_input"
                    type="text"
                    value={secNewUsername}
                    onChange={(e) => {
                      setSecNewUsername(e.target.value);
                      setSecError(null);
                    }}
                    placeholder="Username baru"
                    className="font-body pl-10"
                    autoComplete="username"
                  />
                </div>
              </FieldGroup>

              {/* Password lama */}
              <FieldGroup
                label="Password Lama"
                hint="Verifikasi identitas Anda"
              >
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.60 0 0)" }}
                  />
                  <Input
                    data-ocid="admin.keamanan.old_password_input"
                    type={showOldPwd ? "text" : "password"}
                    value={secOldPassword}
                    onChange={(e) => {
                      setSecOldPassword(e.target.value);
                      setSecError(null);
                    }}
                    placeholder="Password saat ini"
                    className="font-body pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowOldPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                  >
                    {showOldPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FieldGroup>

              {/* Password baru */}
              <FieldGroup label="Password Baru" hint="Minimal 6 karakter">
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.60 0 0)" }}
                  />
                  <Input
                    data-ocid="admin.keamanan.new_password_input"
                    type={showNewPwd ? "text" : "password"}
                    value={secNewPassword}
                    onChange={(e) => {
                      setSecNewPassword(e.target.value);
                      setSecError(null);
                    }}
                    placeholder="Password baru"
                    className="font-body pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNewPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                  >
                    {showNewPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FieldGroup>

              {/* Konfirmasi password */}
              <FieldGroup label="Konfirmasi Password Baru">
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.60 0 0)" }}
                  />
                  <Input
                    data-ocid="admin.keamanan.confirm_password_input"
                    type={showConfirmPwd ? "text" : "password"}
                    value={secConfirmPassword}
                    onChange={(e) => {
                      setSecConfirmPassword(e.target.value);
                      setSecError(null);
                    }}
                    placeholder="Ulangi password baru"
                    className="font-body pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                  >
                    {showConfirmPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FieldGroup>

              {secError && (
                <p
                  data-ocid="admin.keamanan.error_state"
                  className="font-body text-xs py-2 px-3 rounded-lg"
                  style={{
                    background: "oklch(0.97 0.02 25)",
                    color: "oklch(0.50 0.20 25)",
                    border: "1px solid oklch(0.90 0.05 25)",
                  }}
                >
                  {secError}
                </p>
              )}

              <Button
                data-ocid="admin.keamanan.save_button"
                type="submit"
                disabled={secSaving}
                className="font-body font-semibold gap-2"
                style={{ background: "oklch(0.47 0.22 25)", color: "white" }}
              >
                {secSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Kredensial
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
