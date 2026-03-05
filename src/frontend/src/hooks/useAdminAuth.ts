import { useCallback, useState } from "react";

const ADMIN_CREDENTIALS_KEY = "admin_credentials";
const ADMIN_SESSION_KEY = "admin_session_token";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "garda2024";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredCredentials {
  username: string;
  hashedPassword: string;
}

interface SessionToken {
  token: string;
  expiresAt: number;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function checkSession(): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const session: SessionToken = JSON.parse(raw);
    if (!session.token || !session.expiresAt) return false;
    return Date.now() < session.expiresAt;
  } catch {
    return false;
  }
}

function getStoredCredentials(): StoredCredentials | null {
  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    return null;
  }
}

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => checkSession());
  const [isLoading, setIsLoading] = useState(false);

  const hasCustomCredentials = useCallback((): boolean => {
    return getStoredCredentials() !== null;
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const hashedInput = await hashPassword(password);
        const stored = getStoredCredentials();

        let expectedUsername: string;
        let expectedHashedPassword: string;

        if (stored) {
          expectedUsername = stored.username;
          expectedHashedPassword = stored.hashedPassword;
        } else {
          expectedUsername = DEFAULT_USERNAME;
          expectedHashedPassword = await hashPassword(DEFAULT_PASSWORD);
        }

        if (
          username !== expectedUsername ||
          hashedInput !== expectedHashedPassword
        ) {
          return { success: false, error: "Username atau password salah" };
        }

        const session: SessionToken = {
          token: generateToken(),
          expiresAt: Date.now() + SESSION_DURATION_MS,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        setIsLoggedIn(true);
        return { success: true };
      } catch {
        return {
          success: false,
          error: "Terjadi kesalahan. Silakan coba lagi.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsLoggedIn(false);
  }, []);

  const changeCredentials = useCallback(
    async (
      oldPassword: string,
      newUsername: string,
      newPassword: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const hashedOld = await hashPassword(oldPassword);
        const stored = getStoredCredentials();

        let expectedHashedPassword: string;
        if (stored) {
          expectedHashedPassword = stored.hashedPassword;
        } else {
          expectedHashedPassword = await hashPassword(DEFAULT_PASSWORD);
        }

        if (hashedOld !== expectedHashedPassword) {
          return { success: false, error: "Password lama salah" };
        }

        const hashedNew = await hashPassword(newPassword);
        const newCreds: StoredCredentials = {
          username: newUsername,
          hashedPassword: hashedNew,
        };
        localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(newCreds));
        return { success: true };
      } catch {
        return {
          success: false,
          error: "Terjadi kesalahan. Silakan coba lagi.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    isLoggedIn,
    isLoading,
    login,
    logout,
    changeCredentials,
    hasCustomCredentials,
    getStoredCredentials,
  };
}
