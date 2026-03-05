import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface SiteSettings {
    orgName: string;
    tagline: string;
    headerCtaText: string;
    twitterUrl: string;
    instagramUrl: string;
    email: string;
    headerSubtitle: string;
    address: string;
    phone: string;
    youtubeUrl: string;
    facebookUrl: string;
    footerNote: string;
}
export interface Volunteer {
    status: string;
    city: string;
    name: string;
    email: string;
    motivation: string;
    phone: string;
}
export interface Article {
    title: string;
    content: string;
    date: bigint;
    author: string;
    category: string;
}
export interface Program {
    kind: string;
    name: string;
    description: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticle(title: string, content: string, author: string, date: bigint, category: string): Promise<void>;
    addProgram(name: string, description: string, kind: string): Promise<void>;
    approveVolunteer(email: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteArticle(title: string): Promise<void>;
    deleteProgram(name: string): Promise<void>;
    deleteVolunteer(email: string): Promise<void>;
    getArticles(): Promise<Array<Article>>;
    getArticlesByCategory(category: string): Promise<Array<Article>>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(): Promise<Array<Message>>;
    getPrograms(): Promise<Array<Program>>;
    getProgramsByKind(kind: string): Promise<Array<Program>>;
    getSiteSettings(): Promise<SiteSettings>;
    getVolunteers(): Promise<Array<Volunteer>>;
    getVolunteersByStatus(status: string): Promise<Array<Volunteer>>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerVolunteer(name: string, email: string, phone: string, city: string, motivation: string): Promise<void>;
    rejectVolunteer(email: string): Promise<void>;
    sendMessage(name: string, email: string, message: string, timestamp: bigint): Promise<void>;
    updateArticle(title: string, newTitle: string, content: string, author: string, category: string): Promise<void>;
    updateProgram(name: string, newName: string, description: string, kind: string): Promise<void>;
    updateSiteSettings(orgName: string, tagline: string, address: string, phone: string, email: string, facebookUrl: string, twitterUrl: string, instagramUrl: string, youtubeUrl: string, headerCtaText: string, footerNote: string, headerSubtitle: string): Promise<void>;
}
