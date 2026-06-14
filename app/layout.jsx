import "./globals.css";

export const metadata = {
  title: "Web Wardrobe",
  description: "Fashion, furniture, interior design and lifestyle inspiration"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6WBBP3E512"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6WBBP3E512');
            `
          }}
        />

        {/* Trustpilot */}
        <script
          async
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        />

        {/* Monetag Push */}
        <script
          async
          data-cfasync="false"
          src="https://5gvci.com/act/files/tag.min.js?z=11108856"
        />

        {/* Monetag Verification */}
        <meta name="monetag" content="be9c407b9fda995687b393a47177a445" />

        {/* Clarity / tracking */}
        <meta name="clckd" content="0a0d74b4e414b9ce03fccf601ef65937" />

        {/* Google verification */}
        <meta name="google-site-verification" content="DMHJkLG8riU18tuLec2RHhRcntP7X6INLKVb-aASMHc" />

        {/* Pinterest verification */}
        <meta name="p:domain_verify" content="0302449e61dbef06504f7f431f15356b" />

        {/* Skimlinks */}
        <script src="https://s.skimresources.com/js/303375X1791420.skimlinks.js" />

      </head>

      <body>
        {children}
      </body>
    </html>
  );
}
