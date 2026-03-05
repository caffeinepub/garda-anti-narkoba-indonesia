import { Button } from "@/components/ui/button";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export type AdminPage =
  | "dashboard"
  | "relawan"
  | "artikel"
  | "program"
  | "pesan"
  | "pengaturan";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  pageTitle: string;
  onLogout?: () => void;
}

const navItems: {
  id: AdminPage;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    ocid: "admin.sidebar.dashboard_link",
  },
  {
    id: "relawan",
    label: "Relawan",
    icon: <Users className="w-4 h-4" />,
    ocid: "admin.sidebar.relawan_link",
  },
  {
    id: "artikel",
    label: "Artikel",
    icon: <FileText className="w-4 h-4" />,
    ocid: "admin.sidebar.artikel_link",
  },
  {
    id: "program",
    label: "Program",
    icon: <Shield className="w-4 h-4" />,
    ocid: "admin.sidebar.program_link",
  },
  {
    id: "pesan",
    label: "Pesan",
    icon: <Mail className="w-4 h-4" />,
    ocid: "admin.sidebar.pesan_link",
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: <Settings className="w-4 h-4" />,
    ocid: "admin.sidebar.pengaturan_link",
  },
];

function Sidebar({
  currentPage,
  onNavigate,
  onClose,
  onLogout,
}: {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onClose?: () => void;
  onLogout?: () => void;
}) {
  return (
    <aside
      className="flex flex-col h-full w-64"
      style={{
        background: "oklch(0.13 0.03 25)",
        borderRight: "1px solid oklch(0.22 0.04 25)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid oklch(0.22 0.04 25)" }}
      >
        <img
          src="/assets/uploads/55406_original_FB_IMG_1553487322630-removebg-preview-1.png"
          alt="GARDA"
          className="w-8 h-8 object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-display font-black text-sm text-white leading-tight">
            GARDA
          </div>
          <div
            className="font-body text-[10px] leading-tight truncate"
            style={{ color: "oklch(0.50 0.05 25)" }}
          >
            Panel Admin
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-ocid={item.ocid}
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 font-body text-sm font-medium"
              style={{
                background: isActive
                  ? "oklch(0.47 0.22 25 / 0.15)"
                  : "transparent",
                color: isActive ? "oklch(0.75 0.15 25)" : "oklch(0.60 0.04 25)",
                borderLeft: isActive
                  ? "2px solid oklch(0.55 0.20 25)"
                  : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.22 0.04 25 / 0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.80 0.04 25)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.60 0.04 25)";
                }
              }}
            >
              <span className={isActive ? "" : "opacity-70"}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid oklch(0.22 0.04 25)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
          style={{ background: "oklch(0.20 0.04 25)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-xs"
            style={{
              background: "oklch(0.47 0.22 25 / 0.3)",
              color: "oklch(0.75 0.15 25)",
            }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-xs text-white/80 truncate">
              Administrator
            </div>
            <div
              className="font-body text-[10px] truncate"
              style={{ color: "oklch(0.45 0.04 25)" }}
            >
              admin
            </div>
          </div>
        </div>

        <button
          type="button"
          data-ocid="admin.sidebar.logout_button"
          onClick={() => {
            onLogout?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 font-body text-sm font-medium"
          style={{ color: "oklch(0.55 0.04 25)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.47 0.22 25 / 0.10)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.70 0.18 25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.55 0.04 25)";
          }}
        >
          <LogOut className="w-4 h-4 opacity-70" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({
  children,
  currentPage,
  onNavigate,
  pageTitle,
  onLogout,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.97 0 0)" }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 h-screen sticky top-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar
                currentPage={currentPage}
                onNavigate={onNavigate}
                onClose={() => setMobileOpen(false)}
                onLogout={onLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-4"
          style={{
            background: "oklch(1 0 0)",
            borderBottom: "1px solid oklch(0.92 0 0)",
            boxShadow: "0 1px 3px oklch(0 0 0 / 0.06)",
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 h-auto"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-lg text-foreground truncate">
              {pageTitle}
            </h1>
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.60 0 0)" }}
            >
              Garda Anti Narkoba Indonesia — Admin
            </p>
          </div>

          <a
            href="/"
            className="hidden sm:flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "oklch(0.55 0 0)", background: "oklch(0.95 0 0)" }}
          >
            ← Website
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
