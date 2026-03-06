import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Determine which app to render based on URL path
// This check happens BEFORE any React rendering
const isAdminRoute = window.location.pathname.startsWith("/admin");

async function bootstrap() {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  const root = ReactDOM.createRoot(rootEl);

  if (isAdminRoute) {
    // Dynamically import AdminApp only when needed
    const { default: AdminApp } = await import("./AdminApp");
    root.render(
      <QueryClientProvider client={queryClient}>
        <AdminApp />
      </QueryClientProvider>,
    );
  } else {
    const { default: App } = await import("./App");
    root.render(
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <App />
        </InternetIdentityProvider>
      </QueryClientProvider>,
    );
  }
}

bootstrap();
