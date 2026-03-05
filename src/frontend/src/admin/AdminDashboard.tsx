import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Loader2, Mail, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import {
  useGetArticles,
  useGetMessages,
  useGetPrograms,
  useGetVolunteers,
} from "../hooks/useQueries";

function StatCard({
  title,
  value,
  icon,
  accent,
  delay,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-0 shadow-card overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="font-body text-xs font-medium mb-1"
                style={{ color: "oklch(0.55 0 0)" }}
              >
                {title}
              </p>
              <p className="font-display font-black text-3xl text-foreground">
                {value}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: accent }}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: volunteers, isLoading: loadingVol } = useGetVolunteers();
  const { data: articles, isLoading: loadingArt } = useGetArticles();
  const { data: programs, isLoading: loadingProg } = useGetPrograms();
  const { data: messages, isLoading: loadingMsg } = useGetMessages();

  const totalVolunteers = volunteers?.length ?? 0;
  const pendingVolunteers =
    volunteers?.filter((v) => v.status === "pending") ?? [];
  const totalArticles = articles?.length ?? 0;
  const totalPrograms = programs?.length ?? 0;
  const totalMessages = messages?.length ?? 0;

  const isLoading = loadingVol || loadingArt || loadingProg || loadingMsg;

  const recentPending = pendingVolunteers.slice(0, 5);
  const recentArticles = (articles ?? []).slice(0, 3);

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts)).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {["total", "pending", "artikel", "program", "pesan"].map((key) => (
            <Card key={key} className="border-0 shadow-card">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center py-12">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "oklch(0.47 0.22 25)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Relawan"
          value={totalVolunteers}
          icon={<Users className="w-5 h-5 text-white" />}
          accent="oklch(0.47 0.22 25)"
          delay={0}
        />
        <StatCard
          title="Menunggu Approval"
          value={pendingVolunteers.length}
          icon={<Users className="w-5 h-5 text-white" />}
          accent="oklch(0.70 0.15 85)"
          delay={0.05}
        />
        <StatCard
          title="Total Artikel"
          value={totalArticles}
          icon={<FileText className="w-5 h-5 text-white" />}
          accent="oklch(0.50 0.18 200)"
          delay={0.1}
        />
        <StatCard
          title="Total Program"
          value={totalPrograms}
          icon={<Shield className="w-5 h-5 text-white" />}
          accent="oklch(0.45 0.16 145)"
          delay={0.15}
        />
        <StatCard
          title="Total Pesan"
          value={totalMessages}
          icon={<Mail className="w-5 h-5 text-white" />}
          accent="oklch(0.50 0.14 260)"
          delay={0.2}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Volunteers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display font-bold text-base flex items-center gap-2">
                <Users
                  className="w-4 h-4"
                  style={{ color: "oklch(0.47 0.22 25)" }}
                />
                Relawan Menunggu Approval
                {pendingVolunteers.length > 0 && (
                  <Badge
                    className="ml-auto text-xs font-body px-2 py-0.5"
                    style={{
                      background: "oklch(0.70 0.15 85 / 0.15)",
                      color: "oklch(0.50 0.12 85)",
                      border: "1px solid oklch(0.70 0.15 85 / 0.25)",
                    }}
                  >
                    {pendingVolunteers.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentPending.length === 0 ? (
                <div
                  data-ocid="dashboard.relawan.empty_state"
                  className="text-center py-8"
                >
                  <p
                    className="font-body text-sm"
                    style={{ color: "oklch(0.60 0 0)" }}
                  >
                    Tidak ada relawan yang menunggu approval.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentPending.map((v, i) => (
                    <div
                      key={v.email}
                      data-ocid={`dashboard.relawan.item.${i + 1}`}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: "oklch(0.97 0 0)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                        style={{
                          background: "oklch(0.47 0.22 25 / 0.12)",
                          color: "oklch(0.47 0.22 25)",
                        }}
                      >
                        {v.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground truncate">
                          {v.name}
                        </p>
                        <p
                          className="font-body text-xs truncate"
                          style={{ color: "oklch(0.58 0 0)" }}
                        >
                          {v.city} · {v.email}
                        </p>
                      </div>
                      <Badge
                        className="text-xs font-body flex-shrink-0"
                        style={{
                          background: "oklch(0.70 0.15 85 / 0.12)",
                          color: "oklch(0.48 0.12 85)",
                          border: "1px solid oklch(0.70 0.15 85 / 0.25)",
                        }}
                      >
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Articles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display font-bold text-base flex items-center gap-2">
                <FileText
                  className="w-4 h-4"
                  style={{ color: "oklch(0.50 0.18 200)" }}
                />
                Artikel Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentArticles.length === 0 ? (
                <div
                  data-ocid="dashboard.artikel.empty_state"
                  className="text-center py-8"
                >
                  <p
                    className="font-body text-sm"
                    style={{ color: "oklch(0.60 0 0)" }}
                  >
                    Belum ada artikel.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentArticles.map((a, i) => (
                    <div
                      key={a.title}
                      data-ocid={`dashboard.artikel.item.${i + 1}`}
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: "oklch(0.97 0 0)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "oklch(0.50 0.18 200 / 0.12)" }}
                      >
                        <FileText
                          className="w-4 h-4"
                          style={{ color: "oklch(0.50 0.18 200)" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-semibold text-foreground line-clamp-1">
                          {a.title}
                        </p>
                        <p
                          className="font-body text-xs mt-0.5"
                          style={{ color: "oklch(0.58 0 0)" }}
                        >
                          {a.author} · {formatDate(a.date)}
                        </p>
                      </div>
                      <span
                        className="text-xs font-body px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "oklch(0.92 0 0)",
                          color: "oklch(0.50 0 0)",
                        }}
                      >
                        {a.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
