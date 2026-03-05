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

// ─── Programs ───────────────────────────────────────────────────────────────
export function useGetPrograms() {
  const { actor, isFetching } = useActor();
  return useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrograms();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Articles ───────────────────────────────────────────────────────────────
export function useGetArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Register Volunteer ─────────────────────────────────────────────────────
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
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.registerVolunteer(
        data.name,
        data.email,
        data.phone,
        data.city,
        data.motivation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

// ─── Send Message ────────────────────────────────────────────────────────────
export function useSendMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.sendMessage(
        data.name,
        data.email,
        data.message,
        BigInt(Date.now()),
      );
    },
  });
}

// ─── Admin: Volunteers ───────────────────────────────────────────────────────
export function useGetVolunteers() {
  const { actor, isFetching } = useActor();
  return useQuery<Volunteer[]>({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVolunteers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveVolunteer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.approveVolunteer(email);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
  });
}

export function useRejectVolunteer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.rejectVolunteer(email);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
  });
}

export function useDeleteVolunteer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.deleteVolunteer(email);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
  });
}

// ─── Admin: Articles ─────────────────────────────────────────────────────────
export function useAddArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      author: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.addArticle(
        data.title,
        data.content,
        data.author,
        BigInt(Date.now()),
        data.category,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useUpdateArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      newTitle: string;
      content: string;
      author: string;
      category: string;
    }) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.updateArticle(
        data.title,
        data.newTitle,
        data.content,
        data.author,
        data.category,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useDeleteArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.deleteArticle(title);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });
}

// ─── Admin: Programs ─────────────────────────────────────────────────────────
export function useAddProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      kind: string;
    }) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.addProgram(data.name, data.description, data.kind);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}

export function useUpdateProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      newName: string;
      description: string;
      kind: string;
    }) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.updateProgram(
        data.name,
        data.newName,
        data.description,
        data.kind,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}

export function useDeleteProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.deleteProgram(name);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["programs"] }),
  });
}

// ─── Admin: Messages ─────────────────────────────────────────────────────────
export function useGetMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin: Site Settings ────────────────────────────────────────────────────
const SITE_SETTINGS_KEY = "garda_site_settings";

function loadLocalSettings(): SiteSettings | null {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return null;
  }
}

function saveLocalSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      // Prefer local override so admin changes persist immediately
      const local = loadLocalSettings();
      if (local) return local;
      if (!actor) return null;
      try {
        return await actor.getSiteSettings();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SiteSettings) => {
      // Save to localStorage so it persists without requiring ICP admin auth
      saveLocalSettings(data);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

// ─── Locations (localStorage) ────────────────────────────────────────────────
const LOCATIONS_KEY = "garda_locations";

function loadLocalLocations(): Location[] {
  try {
    const raw = localStorage.getItem(LOCATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Location[];
  } catch {
    return [];
  }
}

function saveLocalLocations(locations: Location[]): void {
  try {
    localStorage.setItem(LOCATIONS_KEY, JSON.stringify(locations));
  } catch {
    // ignore
  }
}

export function useGetLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      return loadLocalLocations();
    },
  });
}

export function useAddLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Location) => {
      const existing = loadLocalLocations();
      saveLocalLocations([...existing, data]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = loadLocalLocations();
      saveLocalLocations(existing.filter((l) => l.id !== id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
}

// ─── Gallery (localStorage) ───────────────────────────────────────────────────
const GALLERY_KEY = "garda_gallery_items";

function loadLocalGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GalleryItem[];
  } catch {
    return [];
  }
}

function saveLocalGallery(items: GalleryItem[]): void {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useGetGalleryItems() {
  return useQuery<GalleryItem[]>({
    queryKey: ["galleryItems"],
    queryFn: async () => {
      return loadLocalGallery();
    },
  });
}

export function useAddGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GalleryItem) => {
      const existing = loadLocalGallery();
      saveLocalGallery([...existing, data]);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["galleryItems"] }),
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = loadLocalGallery();
      saveLocalGallery(existing.filter((g) => g.id !== id));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["galleryItems"] }),
  });
}

// ─── Admin: Check Admin ──────────────────────────────────────────────────────
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
