import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Footer from "../components/footer/footer";
import { GlobalStyle } from "../GlobalStyles";
import { ShoppingCartProvider } from "../context/shoppingCart";
import Navbar from "../components/navbar/navbar";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { SanityUIDProvider } from "../context/sanityUserId";
import { useRouter } from "next/router";
import '../global.css'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCK8Q8M');
            `}
      </Script>
      <UserProvider>
        <SanityUIDProvider>
          <ShoppingCartProvider>
            <main
              style={{
                paddingBottom: "15vmin ",
                height: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <AnimatePresence>
                <Component {...pageProps} key={router.pathname} />
              </AnimatePresence>
            </main>
            <Footer />
            <GlobalStyle />
          </ShoppingCartProvider>
        </SanityUIDProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
