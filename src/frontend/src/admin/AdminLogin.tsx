import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface AdminLoginProps {
  isNotAdmin?: boolean;
  login?: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading?: boolean;
  hasCustomCredentials?: () => boolean;
}

export default function AdminLogin({
  isNotAdmin,
  login,
  isLoading = false,
  hasCustomCredentials,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    if (!login) return;
    const result = await login(username.trim(), password);
    if (!result.success) {
      setError(result.error ?? "Login gagal");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.03 25) 0%, oklch(0.18 0.05 25) 50%, oklch(0.14 0.04 25) 100%)",
      }}
    >
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-4"
      >
        {/* Logo block */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: "oklch(0.47 0.22 25 / 0.2)",
              border: "1px solid oklch(0.47 0.22 25 / 0.3)",
            }}
          >
            <img
              src="/assets/generated/garda-logo-transparent.dim_400x400.png"
              alt="GARDA"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="font-display font-black text-2xl text-white mb-1">
            Admin Panel
          </h1>
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.65 0.04 25)" }}
          >
            Garda Anti Narkoba Indonesia
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.16 0.03 25 / 0.95)",
            border: "1px solid oklch(0.28 0.05 25)",
            backdropFilter: "blur(12px)",
          }}
        >
          {isNotAdmin ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "oklch(0.47 0.22 25 / 0.15)" }}
              >
                <ShieldAlert
                  className="w-7 h-7"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">
                Akses Ditolak
              </h2>
              <p
                className="font-body text-sm mb-6"
                style={{ color: "oklch(0.55 0.04 25)" }}
              >
                Sesi tidak valid atau sudah berakhir. Silakan login kembali.
              </p>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/5"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Kembali ke Website
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.47 0.22 25 / 0.15)" }}
                >
                  <Shield
                    className="w-5 h-5"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                  />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white leading-tight">
                    Masuk ke Admin
                  </h2>
                  <p
                    className="font-body text-xs"
                    style={{ color: "oklch(0.55 0.04 25)" }}
                  >
                    Masukkan kredensial admin Anda
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="admin-username"
                    className="font-body text-sm font-semibold"
                    style={{ color: "oklch(0.80 0.03 25)" }}
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "oklch(0.55 0.04 25)" }}
                    />
                    <Input
                      id="admin-username"
                      data-ocid="admin.login.input"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError(null);
                      }}
                      placeholder="Masukkan username"
                      autoComplete="username"
                      className="pl-10 font-body"
                      style={{
                        background: "oklch(0.22 0.03 25)",
                        border: "1px solid oklch(0.32 0.05 25)",
                        color: "white",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="admin-password"
                    className="font-body text-sm font-semibold"
                    style={{ color: "oklch(0.80 0.03 25)" }}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "oklch(0.55 0.04 25)" }}
                    />
                    <Input
                      id="admin-password"
                      data-ocid="admin.login.input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      className="pl-10 pr-10 font-body"
                      style={{
                        background: "oklch(0.22 0.03 25)",
                        border: "1px solid oklch(0.32 0.05 25)",
                        color: "white",
                      }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-white" />
                      ) : (
                        <Eye className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    data-ocid="admin.login.error_state"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-body text-xs text-center py-2 px-3 rounded-lg"
                    style={{
                      background: "oklch(0.47 0.22 25 / 0.15)",
                      color: "oklch(0.75 0.22 25)",
                      border: "1px solid oklch(0.47 0.22 25 / 0.3)",
                    }}
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  data-ocid="admin.login.submit_button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-display font-bold py-5 rounded-xl mt-2"
                  style={{
                    background: "oklch(0.47 0.22 25)",
                    color: "white",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Masuk
                    </>
                  )}
                </Button>
              </form>

              {!hasCustomCredentials?.() && (
                <p
                  className="text-center font-body text-xs mt-4"
                  style={{ color: "oklch(0.45 0.03 25)" }}
                >
                  Default:{" "}
                  <span style={{ color: "oklch(0.58 0.04 25)" }}>admin</span> /{" "}
                  <span style={{ color: "oklch(0.58 0.04 25)" }}>
                    garda2024
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        <p
          className="text-center font-body text-xs mt-6"
          style={{ color: "oklch(0.40 0.03 25)" }}
        >
          © {new Date().getFullYear()} Garda Anti Narkoba Indonesia
        </p>
      </motion.div>
    </div>
  );
}
