import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Eye,
  Facebook,
  Film,
  GraduationCap,
  HandHeart,
  Heart,
  ImageIcon,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Phone,
  Play,
  Scale,
  Shield,
  Star,
  Target,
  Twitter,
  Users,
  X,
  Youtube,
} from "lucide-react";

const LOGO_URL =
  "/assets/uploads/55406_original_FB_IMG_1553487322630-removebg-preview-1.png";
import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useGetArticles,
  useGetGalleryItems,
  useGetPrograms,
  useGetSiteSettings,
  useRegisterVolunteer,
  useSendMessage,
} from "./hooks/useQueries";
import type { Article, GalleryItem, Program } from "./hooks/useQueries";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_PROGRAMS: Program[] = [
  {
    name: "Sosialisasi Anti Narkoba",
    description:
      "Program edukasi dan sosialisasi bahaya narkoba kepada masyarakat umum, sekolah, dan komunitas di seluruh Indonesia. Kami hadir langsung ke lapangan.",
    kind: "Sosialisasi",
  },
  {
    name: "Pendampingan Pemulihan",
    description:
      "Layanan pendampingan profesional bagi korban penyalahgunaan narkoba dan keluarganya untuk proses pemulihan yang bermartabat dan berkelanjutan.",
    kind: "Pendampingan",
  },
  {
    name: "Pelatihan Kader Anti Narkoba",
    description:
      "Melatih kader dan relawan lokal agar mampu menjadi agen perubahan anti narkoba di lingkungan masing-masing dengan bekal ilmu dan keahlian.",
    kind: "Pelatihan",
  },
  {
    name: "Advokasi Kebijakan",
    description:
      "Mendorong kebijakan publik yang lebih tegas dan efektif dalam pemberantasan narkoba melalui kerja sama dengan pemerintah dan lembaga terkait.",
    kind: "Advokasi",
  },
];

const SAMPLE_ARTICLES: Article[] = [
  {
    title: "Waspada! Modus Baru Pengedaran Narkoba di Kalangan Pelajar",
    content:
      "BNN mencatat peningkatan signifikan kasus penyalahgunaan narkoba di kalangan pelajar SMP dan SMA. Pelaku menggunakan media sosial sebagai sarana pemasaran terselubung. GARDA Anti Narkoba Indonesia mengajak seluruh orang tua untuk meningkatkan pengawasan dan komunikasi dengan anak-anak mereka.",
    author: "Tim Redaksi GARDA",
    date: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "Berita",
  },
  {
    title: "Sukses! 500 Relawan Baru Bergabung dalam Program Pelatihan Kader",
    content:
      "Program Pelatihan Kader Anti Narkoba GARDA berhasil meluluskan 500 relawan baru dari 15 provinsi. Para kader ini siap turun ke lapangan membawa pesan anti narkoba ke komunitas masing-masing. Sebuah pencapaian luar biasa untuk Indonesia yang lebih bersih.",
    author: "Humas GARDA",
    date: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "Program",
  },
  {
    title: "Kolaborasi GARDA dan Kemendikbud: Kurikulum Anti Narkoba untuk SD",
    content:
      "GARDA Anti Narkoba Indonesia menandatangani MoU dengan Kementerian Pendidikan dan Kebudayaan untuk mengintegrasikan materi anti narkoba dalam kurikulum sekolah dasar. Program ini menyasar 5 juta siswa SD di seluruh Indonesia mulai tahun ajaran baru.",
    author: "Tim Redaksi GARDA",
    date: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: "Kolaborasi",
  },
];

// ─── Icons map for programs ───────────────────────────────────────────────────

const programIcons: Record<string, React.ReactNode> = {
  Sosialisasi: <Megaphone className="w-6 h-6" />,
  Pendampingan: <HandHeart className="w-6 h-6" />,
  Pelatihan: <GraduationCap className="w-6 h-6" />,
  Advokasi: <Scale className="w-6 h-6" />,
};

function getProgramIcon(kind: string) {
  return programIcons[kind] ?? <Shield className="w-6 h-6" />;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncateContent(content: string, maxLen = 150): string {
  if (content.length <= maxLen) return content;
  return `${content.slice(0, maxLen).trimEnd()}...`;
}

// ─── Counter Animation ────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: siteSettings } = useGetSiteSettings();

  const orgName = siteSettings?.orgName ?? "GARDA";
  const headerSubtitle =
    siteSettings?.headerSubtitle ?? "Anti Narkoba Indonesia";
  const headerCtaText = siteSettings?.headerCtaText ?? "Daftar Relawan";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "beranda", label: "Beranda", ocid: "nav.beranda_link" },
    { id: "tentang", label: "Tentang", ocid: "nav.tentang_link" },
    { id: "program", label: "Program", ocid: "nav.program_link" },
    { id: "berita", label: "Berita", ocid: "nav.berita_link" },
    { id: "galeri", label: "Galeri", ocid: "nav.galeri_link" },
    { id: "bergabung", label: "Bergabung", ocid: "nav.bergabung_link" },
    { id: "kontak", label: "Kontak", ocid: "nav.kontak_link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("beranda")}
            className="flex items-center gap-3 group"
            aria-label="GARDA Anti Narkoba Indonesia - Beranda"
          >
            <img
              src={LOGO_URL}
              alt="Logo GARDA Anti Narkoba Indonesia"
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-display font-800 text-sm lg:text-base leading-tight text-garda-red">
                {orgName}
              </div>
              <div className="font-body text-xs text-foreground/70 leading-tight tracking-wide uppercase">
                {headerSubtitle}
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  data-ocid={link.ocid}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 text-sm font-body font-medium text-foreground/80 hover:text-garda-red rounded-md transition-colors duration-200 hover:bg-primary/5"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => scrollToSection("bergabung")}
              className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary-dark font-body font-semibold text-sm px-5 py-2"
            >
              {headerCtaText}
            </Button>
            <a
              href="/admin"
              data-ocid="nav.admin_login.button"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-primary text-primary font-body font-semibold text-sm hover:bg-primary/5 transition-colors duration-200"
            >
              <Shield className="w-4 h-4" />
              Login Admin
            </a>
            <button
              type="button"
              data-ocid="nav.mobile_toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:text-garda-red hover:bg-primary/5 transition-colors"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <ul className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      data-ocid={link.ocid}
                      onClick={() => scrollToSection(link.id)}
                      className="w-full text-left px-4 py-3 text-sm font-body font-medium text-foreground/80 hover:text-garda-red hover:bg-primary/5 rounded-md transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li className="pt-2 px-4">
                  <Button
                    onClick={() => scrollToSection("bergabung")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-dark font-body font-semibold"
                  >
                    {headerCtaText}
                  </Button>
                </li>
                <li className="pt-1 px-4">
                  <a
                    href="/admin"
                    data-ocid="nav.admin_login.button"
                    onClick={() => setMobileOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-primary text-primary font-body font-semibold text-sm hover:bg-primary/5 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Login Admin
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1200x600.jpg')",
        }}
      />
      {/* Strong blue gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.25 0.18 230 / 0.97) 0%, oklch(0.42 0.20 230 / 0.88) 50%, oklch(0.30 0.18 230 / 0.95) 100%)",
        }}
      />
      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-10"
        style={{
          background:
            "linear-gradient(to bottom-left, oklch(0.75 0.13 85) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-body font-semibold tracking-widest uppercase mb-8"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"
              style={{ backgroundColor: "oklch(var(--gold))" }}
            />
            Organisasi Anti Narkoba Indonesia
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-black text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
          >
            Bersama Melawan Narkoba,
            <br />
            <span style={{ color: "oklch(var(--gold))" }}>
              Selamatkan Generasi Bangsa
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          >
            GARDA Anti Narkoba Indonesia hadir untuk melindungi, mendidik, dan
            memberdayakan masyarakat dari bahaya narkoba demi Indonesia yang
            sehat dan bermartabat.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
          >
            <Button
              data-ocid="hero.primary_button"
              onClick={() => scrollToSection("bergabung")}
              size="lg"
              className="bg-white text-garda-red hover:bg-white/90 font-display font-bold text-base px-8 py-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Bergabung Sekarang
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              data-ocid="hero.secondary_button"
              onClick={() => scrollToSection("tentang")}
              variant="outline"
              size="lg"
              className="border-2 border-white/70 text-white bg-transparent hover:bg-white/10 font-display font-semibold text-base px-8 py-6 rounded-full transition-all duration-200"
            >
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>

          {/* Stats badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {[
              { label: "Relawan", value: "10.000+" },
              { label: "Provinsi", value: "34" },
              { label: "Program", value: "500+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white"
              >
                <span
                  className="font-display font-black text-lg leading-none"
                  style={{ color: "oklch(var(--gold))" }}
                >
                  {stat.value}
                </span>
                <span className="font-body text-sm text-white/80">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs font-body tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Tentang Section ──────────────────────────────────────────────────────────

const TentangSection = memo(function TentangSection() {
  return (
    <section id="tentang" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 text-garda-red font-body font-semibold text-sm tracking-widest uppercase">
              <div className="w-8 h-0.5 bg-garda-red" />
              Tentang Kami
            </div>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-foreground leading-tight mb-6">
              Tentang Garda Anti Narkoba
            </h2>
            <div className="space-y-4 font-body text-foreground/70 text-base leading-relaxed">
              <p>
                <strong className="text-foreground">
                  GARDA Anti Narkoba Indonesia
                </strong>{" "}
                adalah organisasi nasional yang berkomitmen untuk memerangi
                penyalahgunaan narkoba di seluruh penjuru Indonesia. Berdiri
                dengan semangat kebangsaan dan kepedulian terhadap generasi
                penerus bangsa.
              </p>
              <p>
                Kami beroperasi di 34 provinsi dengan lebih dari 10.000 relawan
                aktif yang berdedikasi. Setiap hari, kami hadir di sekolah,
                komunitas, dan pusat rehabilitasi untuk memberikan pendidikan,
                pendampingan, dan harapan.
              </p>
              <p>
                Dengan dukungan pemerintah, masyarakat sipil, dan para relawan
                heroik di lapangan, GARDA terus membangun Indonesia yang bebas
                dari ancaman narkoba.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center"
                  >
                    <Users className="w-4 h-4 text-garda-red" />
                  </div>
                ))}
              </div>
              <p className="font-body text-sm text-foreground/60">
                <strong className="text-foreground">10.000+</strong> relawan
                aktif di Indonesia
              </p>
            </div>
          </motion.div>

          {/* Right: Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            {[
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Visi",
                desc: "Terwujudnya Indonesia bebas narkoba pada 2045 — generasi emas yang sehat, cerdas, dan berintegritas tinggi sebagai fondasi bangsa yang maju.",
                color: "bg-primary/5 border-primary/20",
                iconBg: "bg-primary/10 text-garda-red",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Misi",
                desc: "Mengedukasi, mendampingi, dan memberdayakan masyarakat Indonesia dari segala lapisan untuk bersama-sama menolak dan melawan penyalahgunaan narkoba.",
                color: "bg-foreground/[0.02] border-foreground/10",
                iconBg: "bg-foreground/10 text-foreground",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Nilai",
                desc: "Integritas, Keberanian, Kepedulian, Kebangsaan. Kami percaya perubahan nyata lahir dari hati yang tulus dan tindakan yang konsisten setiap hari.",
                color: "bg-gold/5 border-gold/20",
                iconBg: "bg-gold/15 text-yellow-700",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className={`flex gap-4 p-5 rounded-xl border ${item.color} transition-shadow duration-200 hover:shadow-card`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${item.iconBg}`}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-foreground/65 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// ─── Statistik Section ────────────────────────────────────────────────────────

const StatistikSection = memo(function StatistikSection() {
  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: "Relawan Aktif",
      icon: <Users className="w-8 h-8" />,
    },
    {
      value: 34,
      suffix: "",
      label: "Provinsi Terjangkau",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      value: 500,
      suffix: "+",
      label: "Program Dijalankan",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      value: 50000,
      suffix: "+",
      label: "Penerima Manfaat",
      icon: <Heart className="w-8 h-8" />,
    },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.25 0.18 230) 0%, oklch(0.42 0.20 230) 100%)",
      }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 text-white/70 font-body font-semibold text-sm tracking-widest uppercase">
            <div className="w-8 h-0.5 bg-white/40" />
            Dampak Nyata
            <div className="w-8 h-0.5 bg-white/40" />
          </div>
          <h2 className="font-display font-black text-3xl lg:text-4xl text-white">
            Bersama, Kita Membuat Perbedaan
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-white mb-4 mx-auto">
                {stat.icon}
              </div>
              <div className="font-display font-black text-4xl lg:text-5xl text-white mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-body text-white/70 text-sm leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ─── Program Section ──────────────────────────────────────────────────────────

function ProgramSection() {
  const { data: programs, isLoading } = useGetPrograms();
  const displayPrograms =
    programs && programs.length > 0 ? programs.slice(0, 4) : SAMPLE_PROGRAMS;

  const programOcids = [
    "program.item.1",
    "program.item.2",
    "program.item.3",
    "program.item.4",
  ];

  return (
    <section id="program" className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 text-garda-red font-body font-semibold text-sm tracking-widest uppercase">
            <div className="w-8 h-0.5 bg-garda-red" />
            Program Kami
            <div className="w-8 h-0.5 bg-garda-red" />
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-foreground">
            Program & Kegiatan
          </h2>
          <p className="font-body text-foreground/60 text-lg mt-4 max-w-2xl mx-auto">
            Berbagai program strategis yang kami jalankan untuk menciptakan
            Indonesia bebas narkoba dari berbagai lini.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="program.loading_state"
            className="flex justify-center py-20"
          >
            <Loader2 className="w-8 h-8 animate-spin text-garda-red" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPrograms.map((program, idx) => (
              <motion.div
                key={program.name}
                data-ocid={programOcids[idx] ?? `program.item.${idx + 1}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 border border-border hover:shadow-card-hover transition-all duration-200 group border-l-4 border-l-primary"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-garda-red mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  {getProgramIcon(program.kind)}
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-body border-primary/20 text-garda-red bg-primary/5 mb-3"
                >
                  {program.kind}
                </Badge>
                <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
                  {program.name}
                </h3>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">
                  {truncateContent(program.description, 130)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Berita Section ───────────────────────────────────────────────────────────

function BeritaSection() {
  const { data: articles, isLoading } = useGetArticles();
  const displayArticles =
    articles && articles.length > 0 ? articles.slice(0, 3) : SAMPLE_ARTICLES;

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const beritaOcids = ["berita.item.1", "berita.item.2", "berita.item.3"];

  const categoryColors: Record<string, string> = {
    Berita: "bg-blue-50 text-blue-700 border-blue-200",
    Program: "bg-green-50 text-green-700 border-green-200",
    Kolaborasi: "bg-purple-50 text-purple-700 border-purple-200",
    Edukasi: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <section id="berita" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 text-garda-blue font-body font-semibold text-sm tracking-widest uppercase">
            <div className="w-8 h-0.5 bg-garda-blue" />
            Terbaru
            <div className="w-8 h-0.5 bg-garda-blue" />
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-foreground">
            Berita & Artikel
          </h2>
          <p className="font-body text-foreground/60 text-lg mt-4 max-w-2xl mx-auto">
            Informasi terkini seputar kegiatan dan perkembangan GARDA Anti
            Narkoba Indonesia di seluruh negeri.
          </p>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="berita.loading_state"
            className="flex justify-center py-20"
          >
            <Loader2 className="w-8 h-8 animate-spin text-garda-blue" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {displayArticles.map((article, idx) => (
              <motion.article
                key={article.title}
                data-ocid={beritaOcids[idx] ?? `berita.item.${idx + 1}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-200 group flex flex-col"
              >
                {/* Card top accent */}
                <div className="h-1.5 bg-primary w-full" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-body font-semibold ${
                        categoryColors[article.category] ??
                        "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-foreground/40 text-xs font-body">
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground leading-snug mb-3 group-hover:text-garda-blue transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed flex-1 mb-4">
                    {truncateContent(article.content, 140)}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-xs font-body text-foreground/50">
                      {article.author}
                    </span>
                    <button
                      type="button"
                      data-ocid={`berita.item.${idx + 1}.button`}
                      onClick={() => setSelectedArticle(article)}
                      className="text-xs font-body font-semibold text-garda-blue flex items-center gap-1 hover:gap-2 transition-all hover:underline"
                    >
                      Baca Selengkapnya
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Article Modal */}
      <Dialog
        open={selectedArticle !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null);
        }}
      >
        <DialogContent
          data-ocid="berita.dialog"
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-body font-semibold ${
                      categoryColors[selectedArticle.category] ??
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {selectedArticle.category}
                  </span>
                  <span className="text-foreground/40 text-xs font-body">
                    {formatDate(selectedArticle.date)}
                  </span>
                </div>
                <DialogTitle className="font-display font-bold text-xl text-foreground leading-snug text-left">
                  {selectedArticle.title}
                </DialogTitle>
                <p className="font-body text-xs text-foreground/50 text-left mt-1">
                  Oleh: {selectedArticle.author}
                </p>
              </DialogHeader>
              <div className="mt-4">
                <p className="font-body text-sm text-foreground/75 leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <Button
                  data-ocid="berita.dialog.close_button"
                  variant="outline"
                  onClick={() => setSelectedArticle(null)}
                  className="border-primary text-garda-blue hover:bg-primary/5"
                >
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Galeri Section ───────────────────────────────────────────────────────────

const SAMPLE_GALLERY: GalleryItem[] = [
  {
    id: "sample-1",
    judul: "Sosialisasi Anti Narkoba di SMA Negeri 3 Jakarta",
    deskripsi: "Kegiatan penyuluhan yang melibatkan 300 siswa dan guru.",
    tipe: "foto",
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    tanggal: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "sample-2",
    judul: "Pelatihan Kader Anti Narkoba Surabaya",
    deskripsi: "50 kader baru dari Jawa Timur berhasil dilatih.",
    tipe: "foto",
    url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    tanggal: BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: "sample-3",
    judul: "Video Kampanye Anti Narkoba Nasional",
    deskripsi: "Kampanye video resmi GARDA untuk kesadaran masyarakat.",
    tipe: "video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tanggal: BigInt(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];

type GaleriFilter = "semua" | "foto" | "video";

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  const embedMatch = url.match(/\/embed\/([^?&]+)/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  return null;
}

function GaleriSection() {
  const { data: galleryItems, isLoading } = useGetGalleryItems();
  const [filter, setFilter] = useState<GaleriFilter>("semua");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const displayItems =
    galleryItems && galleryItems.length > 0 ? galleryItems : SAMPLE_GALLERY;

  const filteredItems = displayItems.filter((item) => {
    if (filter === "semua") return true;
    return item.tipe === filter;
  });

  const formatTanggal = (ts: bigint) =>
    new Date(Number(ts)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const galeriOcids = [
    "galeri.item.1",
    "galeri.item.2",
    "galeri.item.3",
    "galeri.item.4",
    "galeri.item.5",
    "galeri.item.6",
  ];

  return (
    <section id="galeri" className="py-20 lg:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4 text-garda-red font-body font-semibold text-sm tracking-widest uppercase">
            <div className="w-8 h-0.5 bg-garda-red" />
            Dokumentasi
            <div className="w-8 h-0.5 bg-garda-red" />
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-foreground">
            Galeri Foto & Video
          </h2>
          <p className="font-body text-foreground/60 text-lg mt-4 max-w-2xl mx-auto">
            Dokumentasi kegiatan sosialisasi, pelatihan, dan kampanye anti
            narkoba di seluruh Indonesia.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-2 bg-white rounded-full border border-border p-1 shadow-sm">
            {(["semua", "foto", "video"] as GaleriFilter[]).map((tab) => (
              <button
                key={tab}
                type="button"
                data-ocid="galeri.tab"
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 capitalize ${
                  filter === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tab === "semua" ? "Semua" : tab === "foto" ? "Foto" : "Video"}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="galeri.loading_state"
            className="flex justify-center py-20"
          >
            <Loader2 className="w-8 h-8 animate-spin text-garda-red" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            data-ocid="galeri.empty_state"
            className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-white"
          >
            <ImageIcon className="w-10 h-10 text-foreground/25 mx-auto mb-3" />
            <p className="font-display font-bold text-foreground/50 text-lg mb-1">
              Belum ada konten galeri
            </p>
            <p className="font-body text-sm text-foreground/40">
              Konten galeri yang diupload admin akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.slice(0, 6).map((item, idx) => {
              const embedUrl =
                item.tipe === "video" ? getYoutubeEmbedUrl(item.url) : null;

              return (
                <motion.div
                  key={item.id}
                  data-ocid={galeriOcids[idx] ?? `galeri.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-200 group"
                >
                  {/* Media */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    {item.tipe === "foto" ? (
                      <button
                        type="button"
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        onClick={() => setLightboxItem(item)}
                        aria-label={`Lihat foto: ${item.judul}`}
                      >
                        <img
                          src={item.url}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f0f4f8'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23a0aec0' font-family='sans-serif' font-size='14'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
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
                    ) : (
                      <div className="w-full h-full bg-secondary/40 flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
                          <Play className="w-6 h-6 text-foreground/40 ml-0.5" />
                        </div>
                        <p className="font-body text-xs text-foreground/40">
                          Video tidak tersedia
                        </p>
                      </div>
                    )}

                    {/* Tipe badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold shadow-sm ${
                          item.tipe === "foto"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.tipe === "foto" ? (
                          <ImageIcon className="w-2.5 h-2.5" />
                        ) : (
                          <Film className="w-2.5 h-2.5" />
                        )}
                        {item.tipe === "foto" ? "Foto" : "Video"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm text-foreground line-clamp-2 leading-snug mb-1">
                      {item.judul}
                    </h3>
                    {item.deskripsi && (
                      <p className="font-body text-xs text-foreground/55 line-clamp-2 mb-2">
                        {item.deskripsi}
                      </p>
                    )}
                    <p className="font-body text-xs text-foreground/35">
                      {formatTanggal(item.tanggal)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightboxItem !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxItem(null);
        }}
      >
        <DialogContent
          data-ocid="galeri.dialog"
          className="max-w-3xl p-2 bg-black border-none"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{lightboxItem?.judul ?? "Foto"}</DialogTitle>
          </DialogHeader>
          {lightboxItem && (
            <div className="relative">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.judul}
                className="w-full rounded-lg max-h-[80vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-family='sans-serif' font-size='14'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
                }}
              />
              <button
                type="button"
                data-ocid="galeri.dialog.close_button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="font-display font-bold text-white text-sm">
                  {lightboxItem.judul}
                </p>
                {lightboxItem.deskripsi && (
                  <p className="font-body text-white/70 text-xs mt-0.5">
                    {lightboxItem.deskripsi}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Bergabung Section ────────────────────────────────────────────────────────

function BergabungSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    motivation: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const { mutateAsync: registerVolunteer, isPending } = useRegisterVolunteer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("idle");
    try {
      await registerVolunteer(form);
      setSubmitState("success");
      setForm({ name: "", email: "", phone: "", city: "", motivation: "" });
      toast.success("Pendaftaran berhasil! Kami akan menghubungi Anda segera.");
    } catch {
      setSubmitState("error");
      toast.error("Gagal mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <section
      id="bergabung"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.25 0.18 230) 0%, oklch(0.42 0.20 230) 60%, oklch(0.30 0.18 230) 100%)",
      }}
    >
      {/* Decorative */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(var(--gold))" }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 mb-4 text-white/70 font-body font-semibold text-sm tracking-widest uppercase">
              <div className="w-8 h-0.5 bg-white/40" />
              Bergabung
              <div className="w-8 h-0.5 bg-white/40" />
            </div>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">
              Jadilah Bagian dari Perubahan
            </h2>

            <p className="font-body text-white/75 text-lg">
              Bergabunglah sebagai relawan GARDA dan bersama-sama kita lindungi
              generasi bangsa dari bahaya narkoba.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  data-ocid="bergabung.success_state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="font-body text-foreground/65 leading-relaxed">
                    Pendaftaran Anda telah kami terima. Tim GARDA akan
                    menghubungi Anda dalam 1-3 hari kerja.
                  </p>
                  <Button
                    onClick={() => setSubmitState("idle")}
                    className="mt-6 bg-primary text-primary-foreground hover:bg-primary-dark"
                  >
                    Daftar Lagi
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="bergabung-name"
                        className="block font-body text-sm font-semibold text-foreground mb-1.5"
                      >
                        Nama Lengkap <span className="text-garda-red">*</span>
                      </label>
                      <Input
                        id="bergabung-name"
                        data-ocid="bergabung.input"
                        required
                        placeholder="Nama lengkap Anda"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="font-body border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bergabung-email"
                        className="block font-body text-sm font-semibold text-foreground mb-1.5"
                      >
                        Email <span className="text-garda-red">*</span>
                      </label>
                      <Input
                        id="bergabung-email"
                        required
                        type="email"
                        placeholder="email@anda.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className="font-body border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="bergabung-phone"
                        className="block font-body text-sm font-semibold text-foreground mb-1.5"
                      >
                        No. Telepon <span className="text-garda-red">*</span>
                      </label>
                      <Input
                        id="bergabung-phone"
                        required
                        type="tel"
                        placeholder="+62 8xx-xxxx-xxxx"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="font-body border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bergabung-city"
                        className="block font-body text-sm font-semibold text-foreground mb-1.5"
                      >
                        Kota <span className="text-garda-red">*</span>
                      </label>
                      <Input
                        id="bergabung-city"
                        required
                        placeholder="Kota domisili Anda"
                        value={form.city}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, city: e.target.value }))
                        }
                        className="font-body border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bergabung-motivation"
                      className="block font-body text-sm font-semibold text-foreground mb-1.5"
                    >
                      Motivasi Bergabung{" "}
                      <span className="text-garda-red">*</span>
                    </label>
                    <Textarea
                      id="bergabung-motivation"
                      required
                      placeholder="Ceritakan motivasi Anda bergabung dengan GARDA..."
                      value={form.motivation}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, motivation: e.target.value }))
                      }
                      className="font-body border-border focus:border-primary focus:ring-primary/20 min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  {submitState === "error" && (
                    <div
                      data-ocid="bergabung.error_state"
                      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-body text-sm">
                        Gagal mendaftar. Silakan periksa koneksi dan coba lagi.
                      </span>
                    </div>
                  )}

                  <Button
                    data-ocid="bergabung.submit_button"
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-dark font-display font-bold text-base py-6 rounded-xl shadow-red-glow transition-all duration-200"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      "Daftar Sebagai Relawan"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Kontak Section ───────────────────────────────────────────────────────────

function KontakSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const { mutateAsync: sendMessage, isPending } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("idle");
    try {
      await sendMessage(form);
      setSubmitState("success");
      setForm({ name: "", email: "", message: "" });
      toast.success("Pesan Anda berhasil terkirim!");
    } catch {
      setSubmitState("error");
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 text-garda-red font-body font-semibold text-sm tracking-widest uppercase">
            <div className="w-8 h-0.5 bg-garda-red" />
            Hubungi Kami
            <div className="w-8 h-0.5 bg-garda-red" />
          </div>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-foreground">
            Kontak
          </h2>
          <p className="font-body text-foreground/60 text-lg mt-4">
            Ada pertanyaan? Kami siap membantu Anda.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                Informasi Kontak
              </h3>
              <p className="font-body text-foreground/65 leading-relaxed">
                Kantor pusat kami berlokasi di Jakarta. Jangan ragu untuk
                menghubungi kami melalui berbagai saluran komunikasi yang
                tersedia.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Alamat",
                  value:
                    "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email",
                  value: "info@gardaantinarkoba.id",
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Telepon",
                  value: "+62 21 5000 1234",
                },
              ].map((contact) => (
                <div key={contact.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-garda-red">
                    {contact.icon}
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-0.5">
                      {contact.label}
                    </p>
                    <p className="font-body text-sm text-foreground">
                      {contact.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <p className="font-body text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                Jam Operasional
              </p>
              <div className="space-y-1 font-body text-sm text-foreground/70">
                <p>Senin – Jumat: 08.00 – 17.00 WIB</p>
                <p>Sabtu: 09.00 – 13.00 WIB</p>
                <p>Minggu & Libur Nasional: Tutup</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-card"
          >
            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  data-ocid="kontak.success_state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    Pesan Terkirim!
                  </h3>
                  <p className="font-body text-foreground/65 text-sm">
                    Kami akan merespons pesan Anda dalam 1x24 jam kerja.
                  </p>
                  <Button
                    onClick={() => setSubmitState("idle")}
                    variant="outline"
                    className="mt-6 border-primary text-garda-red hover:bg-primary/5"
                  >
                    Kirim Pesan Lain
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="kontak-name"
                      className="block font-body text-sm font-semibold text-foreground mb-1.5"
                    >
                      Nama <span className="text-garda-red">*</span>
                    </label>
                    <Input
                      id="kontak-name"
                      data-ocid="kontak.input"
                      required
                      placeholder="Nama Anda"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="font-body"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="kontak-email"
                      className="block font-body text-sm font-semibold text-foreground mb-1.5"
                    >
                      Email <span className="text-garda-red">*</span>
                    </label>
                    <Input
                      id="kontak-email"
                      required
                      type="email"
                      placeholder="email@anda.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="font-body"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="kontak-message"
                      className="block font-body text-sm font-semibold text-foreground mb-1.5"
                    >
                      Pesan <span className="text-garda-red">*</span>
                    </label>
                    <Textarea
                      id="kontak-message"
                      required
                      placeholder="Tuliskan pesan atau pertanyaan Anda..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      className="font-body min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  {submitState === "error" && (
                    <div
                      data-ocid="kontak.error_state"
                      className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-body text-sm">
                        Gagal mengirim pesan. Silakan coba lagi.
                      </span>
                    </div>
                  )}

                  <Button
                    data-ocid="kontak.submit_button"
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-dark font-display font-bold py-5 rounded-xl"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pesan"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const { data: siteSettings } = useGetSiteSettings();
  const orgName = siteSettings?.orgName ?? "GARDA";
  const headerSubtitle =
    siteSettings?.headerSubtitle ?? "Anti Narkoba Indonesia";
  const footerNote =
    siteSettings?.footerNote ??
    "Organisasi nasional yang berkomitmen melindungi generasi Indonesia dari bahaya narkoba melalui edukasi, pendampingan, dan pemberdayaan masyarakat.";
  const address =
    siteSettings?.address ?? "Jl. Sudirman No. 123, Jakarta Pusat";
  const email = siteSettings?.email ?? "info@gardaantinarkoba.id";
  const phone = siteSettings?.phone ?? "+62 21 5000 1234";
  const facebookUrl = siteSettings?.facebookUrl ?? "#";
  const twitterUrl = siteSettings?.twitterUrl ?? "#";
  const instagramUrl = siteSettings?.instagramUrl ?? "#";
  const youtubeUrl = siteSettings?.youtubeUrl ?? "#";

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-16 lg:py-20"
      style={{ background: "oklch(0.10 0.02 25)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={LOGO_URL}
                alt="Logo GARDA Anti Narkoba Indonesia"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="font-display font-black text-white text-lg leading-tight">
                  {orgName}
                </div>
                <div className="font-body text-xs text-white/50 leading-tight tracking-wide uppercase">
                  {headerSubtitle}
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-white/55 leading-relaxed max-w-sm">
              {footerNote}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                {
                  icon: <Instagram className="w-4 h-4" />,
                  href: instagramUrl,
                  label: "Instagram",
                },
                {
                  icon: <Facebook className="w-4 h-4" />,
                  href: facebookUrl,
                  label: "Facebook",
                },
                {
                  icon: <Twitter className="w-4 h-4" />,
                  href: twitterUrl,
                  label: "Twitter",
                },
                {
                  icon: <Youtube className="w-4 h-4" />,
                  href: youtubeUrl,
                  label: "YouTube",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">
              Tautan
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Tentang Kami", id: "tentang" },
                { label: "Program", id: "program" },
                { label: "Berita", id: "berita" },
                { label: "Bergabung", id: "bergabung" },
                { label: "Kontak", id: "kontak" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="font-body text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-garda-red flex-shrink-0 mt-0.5" />
                <span className="font-body text-xs text-white/50 leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-garda-red flex-shrink-0" />
                <span className="font-body text-xs text-white/50">{email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-garda-red flex-shrink-0" />
                <span className="font-body text-xs text-white/50">{phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/35 text-center sm:text-left">
            © {currentYear} Garda Anti Narkoba Indonesia. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="font-body text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              Admin
            </a>
            <p className="font-body text-xs text-white/35 text-center">
              Dibangun dengan{" "}
              <Heart className="w-3 h-3 inline text-garda-red mx-0.5" />{" "}
              menggunakan{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />
      <main>
        <HeroSection />
        <TentangSection />
        <StatistikSection />
        <ProgramSection />
        <BeritaSection />
        <GaleriSection />
        <BergabungSection />
        <KontakSection />
      </main>
      <Footer />
    </>
  );
}
