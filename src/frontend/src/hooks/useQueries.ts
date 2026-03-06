import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Article,
  GalleryItem,
  Location,
  Message,
  Program,
  SiteSettings,
  Volunteer,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export type {
  Article,
  GalleryItem,
  Location,
  Message,
  Program,
  SiteSettings,
  Volunteer,
};

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

const KEYS = {
  articles: "garda_articles",
  programs: "garda_programs",
  volunteers: "garda_volunteers",
  messages: "garda_messages",
  siteSettings: "garda_site_settings",
  locations: "garda_locations",
  galleryItems: "garda_gallery_items",
};

function loadLocal<T>(key: string, reviver?: (v: unknown) => T): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return reviver ? parsed.map(reviver) : (parsed as T[]);
  } catch {
    return [];
  }
}

function saveLocal<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function loadLocalOne<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveLocalOne<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ─── Article helpers ─────────────────────────────────────────────────────────

function articleReviver(v: unknown): Article {
  const a = v as Record<string, unknown>;
  return {
    title: String(a.title ?? ""),
    content: String(a.content ?? ""),
    author: String(a.author ?? ""),
    category: String(a.category ?? ""),
    date: BigInt(String(a.date ?? Date.now())),
  };
}

function loadArticles(): Article[] {
  return loadLocal<Article>(KEYS.articles, articleReviver);
}

function saveArticles(articles: Article[]): void {
  saveLocal(
    KEYS.articles,
    articles.map((a) => ({ ...a, date: a.date.toString() })),
  );
}

// ─── Program helpers ──────────────────────────────────────────────────────────

function loadPrograms(): Program[] {
  return loadLocal<Program>(KEYS.programs);
}

function savePrograms(programs: Program[]): void {
  saveLocal(KEYS.programs, programs);
}

// ─── Volunteer helpers ────────────────────────────────────────────────────────

function loadVolunteers(): Volunteer[] {
  return loadLocal<Volunteer>(KEYS.volunteers);
}

function saveVolunteers(volunteers: Volunteer[]): void {
  saveLocal(KEYS.volunteers, volunteers);
}

// ─── Message helpers ──────────────────────────────────────────────────────────

function messageReviver(v: unknown): Message {
  const m = v as Record<string, unknown>;
  return {
    name: String(m.name ?? ""),
    email: String(m.email ?? ""),
    message: String(m.message ?? ""),
    timestamp: BigInt(String(m.timestamp ?? Date.now())),
  };
}

function loadMessages(): Message[] {
  return loadLocal<Message>(KEYS.messages, messageReviver);
}

function saveMessages(messages: Message[]): void {
  saveLocal(
    KEYS.messages,
    messages.map((m) => ({ ...m, timestamp: m.timestamp.toString() })),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Programs
// ─────────────────────────────────────────────────────────────────────────────

export function useGetPrograms() {
  const { actor, isFetching } = useActor();
  return useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      // Prefer localStorage data (admin-managed)
      const local = loadPrograms();
      if (local.length > 0) return local;
      // Fallback: try ICP backend (read-only, no auth needed for getPrograms)
      if (!actor || isFetching) return [];
      try {
        const remote = await actor.getPrograms();
        if (remote.length > 0) {
          savePrograms(remote);
          return remote;
        }
      } catch {
        // ignore
      }
      return [];
    },
    staleTime: 0,
  });
}

export function useAddProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      kind: string;
    }) => {
      const existing = loadPrograms();
      const newProgram: Program = {
        name: data.name,
        description: data.description,
        kind: data.kind,
      };
      savePrograms([...existing, newProgram]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["programs"] });
      await queryClient.refetchQueries({ queryKey: ["programs"] });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      newName: string;
      description: string;
      kind: string;
    }) => {
      const existing = loadPrograms();
      const updated = existing.map((p) =>
        p.name === data.name
          ? {
              name: data.newName,
              description: data.description,
              kind: data.kind,
            }
          : p,
      );
      savePrograms(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["programs"] });
      await queryClient.refetchQueries({ queryKey: ["programs"] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const existing = loadPrograms();
      savePrograms(existing.filter((p) => p.name !== name));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["programs"] });
      await queryClient.refetchQueries({ queryKey: ["programs"] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Articles
// ─────────────────────────────────────────────────────────────────────────────

export function useGetArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const local = loadArticles();
      if (local.length > 0) return local;
      // Fallback: ICP backend (getArticles is public)
      if (!actor || isFetching) return [];
      try {
        const remote = await actor.getArticles();
        if (remote.length > 0) {
          saveArticles(remote);
          return remote;
        }
      } catch {
        // ignore
      }
      return [];
    },
    staleTime: 0,
  });
}

export function useAddArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      author: string;
      category: string;
    }) => {
      const existing = loadArticles();
      const newArticle: Article = {
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        date: BigInt(Date.now()),
      };
      saveArticles([...existing, newArticle]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.refetchQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      newTitle: string;
      content: string;
      author: string;
      category: string;
    }) => {
      const existing = loadArticles();
      const updated = existing.map((a) =>
        a.title === data.title
          ? {
              ...a,
              title: data.newTitle,
              content: data.content,
              author: data.author,
              category: data.category,
            }
          : a,
      );
      saveArticles(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.refetchQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      const existing = loadArticles();
      saveArticles(existing.filter((a) => a.title !== title));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.refetchQueries({ queryKey: ["articles"] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Volunteers
// ─────────────────────────────────────────────────────────────────────────────

export function useRegisterVolunteer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      city: string;
      motivation: string;
    }) => {
      // Save to localStorage first (always works)
      const existing = loadVolunteers();
      // Avoid duplicate email
      const filtered = existing.filter((v) => v.email !== data.email);
      const newVolunteer: Volunteer = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        motivation: data.motivation,
        status: "pending",
      };
      saveVolunteers([...filtered, newVolunteer]);
      // Also try ICP backend (best effort, no auth needed for registerVolunteer)
      if (actor) {
        try {
          await actor.registerVolunteer(
            data.name,
            data.email,
            data.phone,
            data.city,
            data.motivation,
          );
        } catch {
          // ignore -- data is already saved locally
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useGetVolunteers() {
  return useQuery<Volunteer[]>({
    queryKey: ["volunteers"],
    queryFn: async () => loadVolunteers(),
    staleTime: 0,
  });
}

export function useApproveVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const existing = loadVolunteers();
      const updated = existing.map((v) =>
        v.email === email ? { ...v, status: "approved" } : v,
      );
      saveVolunteers(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.refetchQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useRejectVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const existing = loadVolunteers();
      const updated = existing.map((v) =>
        v.email === email ? { ...v, status: "rejected" } : v,
      );
      saveVolunteers(updated);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.refetchQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useDeleteVolunteer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const existing = loadVolunteers();
      saveVolunteers(existing.filter((v) => v.email !== email));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.refetchQueries({ queryKey: ["volunteers"] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────────────────────────────────────

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      const existing = loadMessages();
      const newMsg: Message = {
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: BigInt(Date.now()),
      };
      saveMessages([...existing, newMsg]);
      // Also try ICP backend (best effort)
      if (actor) {
        try {
          await actor.sendMessage(
            data.name,
            data.email,
            data.message,
            BigInt(Date.now()),
          );
        } catch {
          // ignore
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useGetMessages() {
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => loadMessages(),
    staleTime: 0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────────────────────────────────────────

export function useGetSiteSettings() {
  const { actor } = useActor();
  return useQuery<SiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const local = loadLocalOne<SiteSettings>(KEYS.siteSettings);
      if (local) return local;
      if (!actor) return null;
      try {
        return await actor.getSiteSettings();
      } catch {
        return null;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SiteSettings) => {
      saveLocalOne(KEYS.siteSettings, data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Locations
// ─────────────────────────────────────────────────────────────────────────────

function locationReviver(v: unknown): Location {
  const l = v as Record<string, unknown>;
  return {
    id: String(l.id ?? ""),
    nama: String(l.nama ?? ""),
    alamat: String(l.alamat ?? ""),
    kota: String(l.kota ?? ""),
    provinsi: String(l.provinsi ?? ""),
    tanggalKegiatan: String(l.tanggalKegiatan ?? ""),
    latitude: Number(l.latitude ?? 0),
    longitude: Number(l.longitude ?? 0),
    keterangan: String(l.keterangan ?? ""),
    jumlahPeserta: BigInt(String(l.jumlahPeserta ?? 0)),
  };
}

function loadLocalLocations(): Location[] {
  return loadLocal<Location>(KEYS.locations, locationReviver);
}

function saveLocalLocations(locations: Location[]): void {
  saveLocal(
    KEYS.locations,
    locations.map((l) => ({ ...l, jumlahPeserta: Number(l.jumlahPeserta) })),
  );
}

export function useGetLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => loadLocalLocations(),
    staleTime: 0,
  });
}

export function useAddLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Location) => {
      const existing = loadLocalLocations();
      saveLocalLocations([...existing, data]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["locations"] });
      await queryClient.refetchQueries({ queryKey: ["locations"] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = loadLocalLocations();
      saveLocalLocations(existing.filter((l) => l.id !== id));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["locations"] });
      await queryClient.refetchQueries({ queryKey: ["locations"] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────────────────────────────────────

function galleryReviver(v: unknown): GalleryItem {
  const g = v as Record<string, unknown>;
  return {
    id: String(g.id ?? ""),
    judul: String(g.judul ?? ""),
    deskripsi: String(g.deskripsi ?? ""),
    tipe: String(g.tipe ?? "foto"),
    url: String(g.url ?? ""),
    tanggal: BigInt(String(g.tanggal ?? 0)),
  };
}

function loadLocalGallery(): GalleryItem[] {
  return loadLocal<GalleryItem>(KEYS.galleryItems, galleryReviver);
}

function saveLocalGallery(items: GalleryItem[]): void {
  saveLocal(
    KEYS.galleryItems,
    items.map((g) => ({ ...g, tanggal: Number(g.tanggal) })),
  );
}

export function useGetGalleryItems() {
  return useQuery<GalleryItem[]>({
    queryKey: ["galleryItems"],
    queryFn: async () => loadLocalGallery(),
    staleTime: 0,
  });
}

export function useAddGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GalleryItem) => {
      const existing = loadLocalGallery();
      saveLocalGallery([...existing, data]);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["galleryItems"] });
      await queryClient.refetchQueries({ queryKey: ["galleryItems"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = loadLocalGallery();
      saveLocalGallery(existing.filter((g) => g.id !== id));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["galleryItems"] });
      await queryClient.refetchQueries({ queryKey: ["galleryItems"] });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin check (kept for compatibility, always returns true for local admin)
// ─────────────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => true,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
