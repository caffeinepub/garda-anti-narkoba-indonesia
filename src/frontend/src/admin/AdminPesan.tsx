import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useGetMessages } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPesan() {
  const { data: messages, isLoading } = useGetMessages();

  return (
    <div className="space-y-4">
      <p className="font-body text-sm" style={{ color: "oklch(0.55 0 0)" }}>
        {messages?.length ?? 0} pesan masuk
      </p>

      {isLoading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="admin.pesan.loading_state"
        >
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "oklch(0.47 0.22 25)" }}
          />
        </div>
      ) : (messages ?? []).length === 0 ? (
        <div
          data-ocid="admin.pesan.empty_state"
          className="text-center py-16 rounded-xl"
          style={{ background: "white", border: "1px solid oklch(0.92 0 0)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "oklch(0.95 0 0)" }}
          >
            <Mail className="w-6 h-6" style={{ color: "oklch(0.60 0 0)" }} />
          </div>
          <p className="font-body text-sm font-semibold text-foreground mb-1">
            Belum ada pesan masuk
          </p>
          <p className="font-body text-xs" style={{ color: "oklch(0.58 0 0)" }}>
            Pesan dari formulir kontak akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(messages ?? []).map((msg, i) => (
            <motion.div
              key={`${msg.email}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card
                data-ocid={`admin.pesan.item.${i + 1}`}
                className="border-0 shadow-card overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      background: "oklch(0.975 0 0)",
                      borderBottom: "1px solid oklch(0.92 0 0)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                        style={{
                          background: "oklch(0.47 0.22 25 / 0.12)",
                          color: "oklch(0.47 0.22 25)",
                        }}
                      >
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-body font-semibold text-sm text-foreground">
                          {msg.name}
                        </p>
                        <p
                          className="font-body text-xs"
                          style={{ color: "oklch(0.55 0 0)" }}
                        >
                          {msg.email}
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-body text-xs"
                      style={{ color: "oklch(0.60 0 0)" }}
                    >
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>

                  {/* Message body */}
                  <div className="px-5 py-4 bg-white">
                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{ color: "oklch(0.35 0 0)" }}
                    >
                      {msg.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
