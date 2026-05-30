import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "./index.css?url";
import { Toaster } from "@/app/_components/ui/sonner";
import { ThemeProvider } from "@/app/_components/theme-provider";
import { AuthProvider } from "@/app/_components/auth-provider";
import { SidebarProvider } from "@/app/_components/ui/sidebar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appCss },
  { rel: "icon", href: "/favicon.svg" },
];

// global HTML shell
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// root route — wraps all pages
export default function Root() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <Outlet />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// global error boundary
export function ErrorBoundary({ error }: { error: unknown }) {
  return (
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Something went wrong</h1>
        <pre>{error instanceof Error ? error.message : "Unknown error"}</pre>
      </body>
    </html>
  );
}
