import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminArtikel from "./admin/AdminArtikel";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout, { type AdminPage } from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminPengaturan from "./admin/AdminPengaturan";
import AdminPesan from "./admin/AdminPesan";
import AdminProgram from "./admin/AdminProgram";
import AdminRelawan from "./admin/AdminRelawan";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsCallerAdmin } from "./hooks/useQueries";

const PAGE_TITLES: Record<AdminPage, string> = {
  dashboard: "Dashboard",
  relawan: "Manajemen Relawan",
  artikel: "Manajemen Artikel",
  program: "Manajemen Program",
  pesan: "Pesan Masuk",
  pengaturan: "Pengaturan Website",
};

function AdminContent() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  // Not yet initialized
  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.13 0.03 25)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl animate-pulse"
            style={{ background: "oklch(0.47 0.22 25 / 0.3)" }}
          />
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.50 0.04 25)" }}
          >
            Memuat...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!identity) {
    return <AdminLogin />;
  }

  // Logged in, checking admin status
  if (checkingAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.13 0.03 25)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.47 0.22 25 / 0.2)" }}
          >
            <img
              src="/assets/generated/garda-logo-transparent.dim_400x400.png"
              alt="GARDA"
              className="w-7 h-7 object-contain animate-pulse"
            />
          </div>
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.50 0.04 25)" }}
          >
            Memverifikasi akses...
          </p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return <AdminLogin isNotAdmin />;
  }

  // Admin panel
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "relawan":
        return <AdminRelawan />;
      case "artikel":
        return <AdminArtikel />;
      case "program":
        return <AdminProgram />;
      case "pesan":
        return <AdminPesan />;
      case "pengaturan":
        return <AdminPengaturan />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      pageTitle={PAGE_TITLES[currentPage]}
    >
      {renderPage()}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AdminContent />
    </>
  );
}
