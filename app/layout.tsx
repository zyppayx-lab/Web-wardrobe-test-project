import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Web Wardrobe - Fashion, Furniture & Lifestyle",
  description: "Discover fashion, furniture, interior design and lifestyle inspiration."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* MONETAG PUSH */}
        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=11108856"
          strategy="afterInteractive"
        />

        {/* MONETAG VIGNETTE */}
        <Script id="monetag-vignette">
          {`
            (function(s){
              s.dataset.zone='11108893';
              s.src='https://n6wxm.com/vignette.min.js';
            })(document.body.appendChild(document.createElement('script')));
          `}
        </Script>

        {children}
      </body>
    </html>
  );
          }
