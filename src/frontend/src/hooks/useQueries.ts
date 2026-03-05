import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Article,
  Message,
  Program,
  SiteSettings,
  Volunteer,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export type { Article, Message, Program, SiteSettings, Volunteer };

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
export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SiteSettings) => {
      if (!actor) throw new Error("Actor tidak tersedia");
      await actor.updateSiteSettings(
        data.orgName,
        data.tagline,
        data.address,
        data.phone,
        data.email,
        data.facebookUrl,
        data.twitterUrl,
        data.instagramUrl,
        data.youtubeUrl,
        data.headerCtaText,
        data.footerNote,
        data.headerSubtitle,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] }),
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
