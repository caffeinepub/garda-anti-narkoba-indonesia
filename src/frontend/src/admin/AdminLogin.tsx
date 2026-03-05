import { Button } from "@/components/ui/button";
import { Loader2, Shield, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AdminLoginProps {
  isNotAdmin?: boolean;
}

export default function AdminLogin({ isNotAdmin }: AdminLoginProps) {
  const { login, loginStatus, isInitializing, isLoginError } =
    useInternetIdentity();

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
                Akun Anda tidak memiliki hak akses admin. Hubungi administrator
                untuk mendapatkan akses.
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
                    Gunakan Internet Identity
                  </p>
                </div>
              </div>

              <p
                className="font-body text-sm mb-6 leading-relaxed"
                style={{ color: "oklch(0.60 0.04 25)" }}
              >
                Panel admin menggunakan Internet Identity untuk keamanan
                terdesentralisasi. Login untuk mengelola konten website.
              </p>

              <Button
                data-ocid="admin.login.button"
                onClick={() => login()}
                disabled={
                  loginStatus === "logging-in" ||
                  loginStatus === "initializing" ||
                  isInitializing
                }
                className="w-full font-display font-bold py-5 rounded-xl"
                style={{
                  background: "oklch(0.47 0.22 25)",
                  color: "white",
                }}
              >
                {loginStatus === "logging-in" ||
                loginStatus === "initializing" ||
                isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Login dengan Internet Identity
                  </>
                )}
              </Button>

              {isLoginError && (
                <p
                  className="text-center font-body text-xs mt-3"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  Login gagal. Silakan coba lagi.
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
