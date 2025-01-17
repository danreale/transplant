import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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
