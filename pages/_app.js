import 'bootstrap/dist/css/bootstrap.css'
import "../styles/custom.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.js");
  }, []);
  return <Component {...pageProps} />
}
