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
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Determine which app to render based on URL path
const isAdminPath = window.location.pathname.startsWith("/admin");

async function renderApp() {
  if (isAdminPath) {
    const { default: AdminApp } = await import("./AdminApp");
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <AdminApp />
        </InternetIdentityProvider>
      </QueryClientProvider>,
    );
  } else {
    const { default: App } = await import("./App");
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <App />
        </InternetIdentityProvider>
      </QueryClientProvider>,
    );
  }
}

renderApp();
