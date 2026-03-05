import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminArtikel from "./admin/AdminArtikel";
import AdminDashboard from "./admin/AdminDashboard";
import AdminGaleri from "./admin/AdminGaleri";
import AdminLayout, { type AdminPage } from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminLokasi from "./admin/AdminLokasi";
import AdminPengaturan from "./admin/AdminPengaturan";
import AdminPesan from "./admin/AdminPesan";
import AdminProgram from "./admin/AdminProgram";
import AdminRelawan from "./admin/AdminRelawan";
import { useAdminAuth } from "./hooks/useAdminAuth";

const PAGE_TITLES: Record<AdminPage, string> = {
  dashboard: "Dashboard",
  relawan: "Manajemen Relawan",
  artikel: "Manajemen Artikel",
  program: "Manajemen Program",
  lokasi: "Lokasi Penyuluhan",
  galeri: "Galeri Foto & Video",
  pesan: "Pesan Masuk",
  pengaturan: "Pengaturan Website",
};

function AdminContent() {
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const { isLoggedIn, logout, login, isLoading, hasCustomCredentials } =
    useAdminAuth();

  // Not logged in — show login form
  if (!isLoggedIn) {
    return (
      <AdminLogin
        login={login}
        isLoading={isLoading}
        hasCustomCredentials={hasCustomCredentials}
      />
    );
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
      case "lokasi":
        return <AdminLokasi />;
      case "galeri":
        return <AdminGaleri />;
      case "pesan":
        return <AdminPesan />;
      case "pengaturan":
        return <AdminPengaturan onLogout={logout} />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      pageTitle={PAGE_TITLES[currentPage]}
      onLogout={logout}
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
