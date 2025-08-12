import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";
import Footer from "./components/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        {/* Google Analytics Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-M5HMFJY1V2`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-M5HMFJY1V2', {
        page_path: window.location.pathname,
        });
    `,
          }}
        />
      </head>
      <body className="px-5">
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // // Uncomment For debugging only
  // const errorMessage =
  //   error instanceof Error ? error.message : "Please check back later.";

  const errorMessage = "Please check back later.";

  return (
    <html lang="en" className="h-full bg-gray-900">
      <head>
        <title>An unexpected error occurred!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center text-red-400">
          <h1 className="text-5xl font-bold">
            An unexpected error occurred on our end.
          </h1>
          <p className="max-w-md text-yellow-400">{errorMessage}</p>
          <a
            href="/"
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-blue-300 shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Go back home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
