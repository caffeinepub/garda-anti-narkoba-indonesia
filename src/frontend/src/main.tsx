import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
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
      // Reduce aggressive refetching to improve performance
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy load both apps to reduce initial bundle
const App = lazy(() => import("./App"));
const AdminApp = lazy(() => import("./AdminApp"));

const isAdminPath = window.location.pathname.startsWith("/admin");

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e5e7eb",
          borderTopColor: "#1d4ed8",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <Suspense fallback={<LoadingScreen />}>
        {isAdminPath ? <AdminApp /> : <App />}
      </Suspense>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
